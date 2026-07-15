import QRCode from 'qrcode';

export class QRService {
  /**
   * Generates a base64 encoded data URI for a QR code image.
   * This is useful for embedding the QR code directly into PDFs or saving to DB.
   * 
   * @param data The string data to encode (e.g., URL to verification page)
   * @returns Base64 string of the QR code image
   */
  public static async generateQRCodeDataURI(data: string): Promise<string> {
    try {
      const url = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#000000', // Black dots
          light: '#ffffff' // White background
        }
      });
      return url;
    } catch (err) {
      console.error("Failed to generate QR code", err);
      throw new Error("QR Code generation failed");
    }
  }
}
