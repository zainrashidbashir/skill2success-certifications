import crypto from 'crypto';

export interface CertificateDataPayload {
  credentialId: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  issueDate: string;
  completionDate: string;
}

export class HashService {
  /**
   * Generates a deterministic string from certificate data payload
   * We sort the keys to ensure the payload order is always identical before hashing
   */
  private static serializePayload(payload: CertificateDataPayload): string {
    return JSON.stringify({
      credentialId: payload.credentialId,
      studentName: payload.studentName,
      courseName: payload.courseName,
      instructorName: payload.instructorName,
      issueDate: new Date(payload.issueDate).toISOString(),
      completionDate: new Date(payload.completionDate).toISOString(),
    });
  }

  /**
   * Generates a SHA-256 hash of the serialized certificate data.
   */
  public static generateHash(payload: CertificateDataPayload): string {
    const serializedData = this.serializePayload(payload);
    return crypto.createHash('sha256').update(serializedData).digest('hex');
  }

  /**
   * Verifies if a given hash matches the payload data
   */
  public static verifyHash(payload: CertificateDataPayload, expectedHash: string): boolean {
    const currentHash = this.generateHash(payload);
    return currentHash === expectedHash;
  }
}
