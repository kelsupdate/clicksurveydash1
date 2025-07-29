/**
 * M-Pesa Message Processor
 * Automatically processes pasted M-Pesa messages for plan upgrades
 */

export interface MpesMessageInfo {
  amount: number;
  transactionId: string;
  phoneNumber: string;
  timestamp: Date;
  isValid: boolean;
}

export class MessageProcessor {
  /**
   * Extract payment details from M-Pesa message
   * @param message - Raw M-Pesa message text
   * @returns Extracted payment information
   */
  static extractPaymentInfo(message: string): MpesMessageInfo | null {
    if (!message || typeof message !== 'string') {
      return null;
    }

    // Common M-Pesa message patterns
    const patterns = [
      // Pattern 1: "KshXXX.00 sent to Till Number XXXXXXXX"
      /Ksh(\d+(?:\.\d{2})?)\s+sent\s+to\s+Till\s+Number\s+(\d+)/i,
      // Pattern 2: "KshXXX.00 paid to XXXXXXXX"
      /Ksh(\d+(?:\.\d{2})?)\s+paid\s+to\s+(\d+)/i,
      // Pattern 3: "Confirmed. KshXXX.00 sent to XXXXXXXX"
      /Confirmed\.\s*Ksh(\d+(?:\.\d{2})?)\s+sent\s+to\s+(\d+)/i,
      // Pattern 4: "KshXXX.00 has been sent to XXXXXXXX"
      /Ksh(\d+(?:\.\d{2})?)\s+has\s+been\s+sent\s+to\s+(\d+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const amount = parseFloat(match[1]);
        const tillNumber = match[2];
        
        // Check if it's the correct till number
        const correctTillNumber = "3566188"; // From plan.json
        
        if (tillNumber === correctTillNumber) {
          return {
            amount: Math.round(amount), // Round to nearest KSh
            transactionId: this.generateTransactionId(),
            phoneNumber: this.extractPhoneNumber(message),
            timestamp: new Date(),
            isValid: true
          };
        }
      }
    }

    return null;
  }

  /**
   * Generate a unique transaction ID
   */
  private static generateTransactionId(): string {
    return `MP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }

  /**
   * Extract phone number from message
   */
  private static extractPhoneNumber(message: string): string {
    const phonePattern = /(?:\+254|0)?7\d{8}/;
    const match = message.match(phonePattern);
    return match ? match[0] : 'Unknown';
  }

  /**
   * Validate if message is a valid M-Pesa payment message
   */
  static isValidMpesMessage(message: string): boolean {
    return this.extractPaymentInfo(message) !== null;
  }

  /**
   * Get suggested plan based on payment amount
   */
  static getSuggestedPlan(amount: number): string | null {
    const planMapping: { [key: number]: string } = {
      250: "Silver",
      500: "Gold",
      1000: "Platinum"
    };

    return planMapping[amount] || null;
  }
}
