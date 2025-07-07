export interface ProcessedEvidence {
  originalFile: {
    name: string;
    size: number;
    type: string;
    hash: string;
  };
  analysis: {
    isImage: boolean;
    isDocument: boolean;
    isVideo: boolean;
    isAudio: boolean;
    fileSignature: string;
    securityRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  metadata?: {
    fileSize: number;
    mimeType: string;
    fileName: string;
  };
  extractedText?: string;
  thumbnails?: {
    small: Buffer;
    medium: Buffer;
    large: Buffer;
  };
  processed: {
    optimizedFile?: Buffer;
    watermarked?: Buffer;
    redacted?: Buffer;
  };
  forensics: {
    md5: string;
    sha1: string;
    sha256: string;
    entropy: number;
    suspiciousPatterns: string[];
  };
}

export class EvidenceProcessor {
  private static instance: EvidenceProcessor;

  private constructor() {}

  public static getInstance(): EvidenceProcessor {
    if (!EvidenceProcessor.instance) {
      EvidenceProcessor.instance = new EvidenceProcessor();
    }
    return EvidenceProcessor.instance;
  }

  public async processEvidence(
    file: Buffer,
    filename: string,
    mimeType: string
  ): Promise<ProcessedEvidence> {
    const analysis = this.analyzeFileType(filename, mimeType);
    const forensics = await this.performForensicAnalysis(file);

    const metadata = {
      fileSize: file.length,
      mimeType: mimeType,
      fileName: filename,
    };

    // Security analysis
    (analysis as any).securityRisk = this.assessSecurityRisk(file, forensics, '');

    return {
      originalFile: {
        name: filename,
        size: file.length,
        type: mimeType,
        hash: forensics.sha256,
      },
      analysis,
      metadata,
      extractedText: '',
      thumbnails: undefined,
      processed: {},
      forensics,
    };
  }

  private analyzeFileType(filename: string, mimeType: string) {
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    return {
      isImage: mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension),
      isDocument: mimeType.includes('pdf') || mimeType.includes('document') ||
                 ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension),
      isVideo: mimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension),
      isAudio: mimeType.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac'].includes(extension),
      fileSignature: this.getFileSignature(mimeType),
      securityRisk: 'LOW' as const,
    };
  }

  private getFileSignature(mimeType: string): string {
    const signatures: { [key: string]: string } = {
      'image/jpeg': 'FFD8FF',
      'image/png': '89504E47',
      'application/pdf': '25504446',
      'video/mp4': '66747970',
      'audio/mp3': 'ID3',
    };
    return signatures[mimeType] || 'UNKNOWN';
  }

  private async performForensicAnalysis(file: Buffer) {
    const crypto = await import('crypto');

    const md5 = crypto.createHash('md5').update(file).digest('hex');
    const sha1 = crypto.createHash('sha1').update(file).digest('hex');
    const sha256 = crypto.createHash('sha256').update(file).digest('hex');

    // Calculate entropy to detect encrypted/compressed data
    const entropy = this.calculateEntropy(file);

    // Look for suspicious patterns
    const suspiciousPatterns = this.detectSuspiciousPatterns(file);

    return {
      md5,
      sha1,
      sha256,
      entropy,
      suspiciousPatterns,
    };
  }

  private calculateEntropy(buffer: Buffer): number {
    const frequencies: { [key: number]: number } = {};
    const length = buffer.length;

    // Count byte frequencies
    for (let i = 0; i < length; i++) {
      const byte = buffer[i];
      frequencies[byte] = (frequencies[byte] || 0) + 1;
    }

    // Calculate entropy
    let entropy = 0;
    for (const freq of Object.values(frequencies)) {
      const probability = freq / length;
      entropy -= probability * Math.log2(probability);
    }

    return entropy;
  }

  private detectSuspiciousPatterns(buffer: Buffer): string[] {
    const patterns: string[] = [];
    const content = buffer.toString('binary');

    // Check for embedded executables
    if (content.includes('MZ\x90\x00') || content.includes('\x7fELF')) {
      patterns.push('EMBEDDED_EXECUTABLE');
    }

    // Check for suspicious URLs
    if (/https?:\/\/[^\s]+\.(tk|ml|ga|cf)/.test(content)) {
      patterns.push('SUSPICIOUS_DOMAIN');
    }

    // Check for base64 encoded content
    if (/[A-Za-z0-9+\/]{50,}={0,2}/.test(content)) {
      patterns.push('BASE64_CONTENT');
    }

    // Check for cryptocurrency addresses
    if (/[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59}/.test(content)) {
      patterns.push('CRYPTOCURRENCY_ADDRESS');
    }

    return patterns;
  }

  private assessSecurityRisk(
    file: Buffer,
    forensics: { entropy: number; suspiciousPatterns: unknown[]; [key: string]: unknown },
    extractedText: string
  ): 'LOW' | 'MEDIUM' | 'HIGH' {
    let risk = 0;

    // High entropy suggests encryption or compression
    if (forensics.entropy > 7.5) risk += 2;

    // Suspicious patterns
    risk += forensics.suspiciousPatterns.length;

    // Check extracted text for suspicious content
    const suspiciousKeywords = [
      'password', 'login', 'credential', 'bitcoin', 'wallet',
      'private key', 'social security', 'bank account'
    ];

    const textLower = extractedText.toLowerCase();
    for (const keyword of suspiciousKeywords) {
      if (textLower.includes(keyword)) risk += 1;
    }

    if (risk >= 5) return 'HIGH';
    if (risk >= 2) return 'MEDIUM';
    return 'LOW';
  }

  public async cleanup() {
    // Cleanup any resources
  }
}
