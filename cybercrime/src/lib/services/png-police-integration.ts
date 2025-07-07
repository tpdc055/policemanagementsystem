/**
 * PNG Police Main System Integration Service
 * Handles bi-directional communication with https://policemanagementsystem.vercel.app/
 */

import { z } from 'zod';

// Type definitions for PNG Police integration
const BadgeVerificationSchema = z.object({
  badgeNumber: z.string(),
  name: z.string(),
  rank: z.string(),
  department: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  permissions: z.array(z.string()),
});

const CaseDataSchema = z.object({
  caseId: z.string(),
  caseNumber: z.string(),
  title: z.string(),
  status: z.string(),
  assignedOfficer: z.string(),
  lastUpdate: z.string(),
});

type BadgeVerification = z.infer<typeof BadgeVerificationSchema>;
type CaseData = z.infer<typeof CaseDataSchema>;

export class PNGPoliceIntegrationService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly webhookSecret: string;

  constructor() {
    this.baseUrl = process.env.MAIN_SYSTEM_API_URL || 'https://policemanagementsystem.vercel.app/api';
    this.apiKey = process.env.MAIN_SYSTEM_API_KEY || '';
    this.webhookSecret = process.env.MAIN_SYSTEM_WEBHOOK_SECRET || '';
  }

  /**
   * Verify officer badge number with main police system
   */
  async verifyBadgeNumber(badgeNumber: string): Promise<BadgeVerification | null> {
    try {
      const response = await fetch(`${this.baseUrl}/officers/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source': 'PNG-Cyber-Crime-Unit',
        },
        body: JSON.stringify({ badgeNumber }),
      });

      if (!response.ok) {
        throw new Error(`Badge verification failed: ${response.statusText}`);
      }

      const data = await response.json();
      return BadgeVerificationSchema.parse(data);
    } catch (error) {
      console.error('Badge verification error:', error);
      return null;
    }
  }

  /**
   * Sync case data with main police system
   */
  async syncCaseData(caseData: {
    caseNumber: string;
    title: string;
    description: string;
    status: string;
    assignedOfficer: string;
    priority: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/cases/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source': 'PNG-Cyber-Crime-Unit',
        },
        body: JSON.stringify({
          ...caseData,
          source: 'CYBER_CRIME_UNIT',
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Case sync error:', error);
      return false;
    }
  }

  /**
   * Get officer role mapping from main system
   */
  async getOfficerRoles(badgeNumber: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/officers/${badgeNumber}/roles`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source': 'PNG-Cyber-Crime-Unit',
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.roles || [];
    } catch (error) {
      console.error('Role fetch error:', error);
      return [];
    }
  }

  /**
   * Send notification to main police system
   */
  async sendNotification(notification: {
    recipientBadge: string;
    title: string;
    message: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    type: string;
    data?: any;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source': 'PNG-Cyber-Crime-Unit',
        },
        body: JSON.stringify({
          ...notification,
          source: 'CYBER_CRIME_UNIT',
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Notification send error:', error);
      return false;
    }
  }

  /**
   * Verify webhook signature from main system
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(`sha256=${expectedSignature}`)
    );
  }

  /**
   * Handle incoming webhook from main police system
   */
  async handleWebhook(payload: any): Promise<void> {
    try {
      switch (payload.type) {
        case 'officer.updated':
          await this.handleOfficerUpdate(payload.data);
          break;
        case 'case.assigned':
          await this.handleCaseAssignment(payload.data);
          break;
        case 'emergency.alert':
          await this.handleEmergencyAlert(payload.data);
          break;
        default:
          console.log('Unknown webhook type:', payload.type);
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
    }
  }

  private async handleOfficerUpdate(data: any): Promise<void> {
    // Update local officer data based on main system changes
    // This would integrate with your user management system
    console.log('Officer update received:', data);
  }

  private async handleCaseAssignment(data: any): Promise<void> {
    // Handle case assignments from main system
    console.log('Case assignment received:', data);
  }

  private async handleEmergencyAlert(data: any): Promise<void> {
    // Handle emergency alerts that may require cyber crime unit attention
    console.log('Emergency alert received:', data);
  }

  /**
   * Get system health status from main police system
   */
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    lastCheck: string;
    responseTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const responseTime = Date.now() - startTime;

      return {
        status: response.ok ? 'healthy' : 'degraded',
        lastCheck: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      return {
        status: 'down',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      };
    }
  }
}

// Singleton instance
export const pngPoliceIntegration = new PNGPoliceIntegrationService();