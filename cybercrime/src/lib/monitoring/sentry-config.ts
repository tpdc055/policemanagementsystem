import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Adjust this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Capture 100% of the transactions for performance monitoring
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Custom error filtering
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      const error = hint.originalException;

      if (error instanceof Error) {
        // Don't send authentication errors to Sentry
        if (error.message.includes('Unauthorized') || error.message.includes('Invalid token')) {
          return null;
        }

        // Don't send client-side network errors
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          return null;
        }
      }

      return event;
    },

    // Enhanced context
    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
        return null;
      }

      return breadcrumb;
    },

    // Custom tags for filtering
    initialScope: {
      tags: {
        component: 'cyber-crime-monitoring',
        country: 'PNG',
        department: 'police',
      },
    },

    // Performance monitoring
    integrations: [
      // BrowserTracing integration commented out
        // Set up automatic route change tracking for Next.js App Router
    ],

    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || 'development',

    // Additional options for production
    ...(process.env.NODE_ENV === 'production' && {
      // Enable session replay in production
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      integrations: [
        // Replay integration commented out
      ],
    }),
  });
}

// Custom error reporting functions
export const reportError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};

export const reportMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureMessage(message);
  });
};

export const setUserContext = (user: { id: string; email: string; role: string; department: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
    department: user.department,
  });
};

export const addBreadcrumb = (message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};

// Transaction tracking for performance monitoring
export const startTransaction = (name: string, operation: string) => {
  return null // Sentry.startTransaction not available({ name, op: operation });
};

export const measureTime = async <T>(name: string, operation: string, fn: () => Promise<T>): Promise<T> => {
  const transaction = startTransaction(name, operation);

  try {
    const result = await fn();
    // transaction?.setStatus('ok');
    return result;
  } catch (error) {
    // transaction?.setStatus('internal_error');
    throw error;
  } finally {
    // transaction?.finish();
  }
};
