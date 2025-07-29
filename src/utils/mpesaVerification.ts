/**
 * M-Pesa Verification System
 * Validates M-Pesa payment confirmation messages
 */

export interface MpesaVerificationResult {
  isValid: boolean;
  message: string;
  details: {
    containsRequiredText: boolean;
    merchantName?: string;
    amount?: string;
    transactionId?: string;
    timestamp?: string;
  };
}

export class MpesaVerifier {
  private static readonly REQUIRED_MERCHANT_TEXT = "VEDACOM 4 SOLUTIONS";
  
  /**
   * Verify M-Pesa payment message
   * @param message - The M-Pesa confirmation message
   * @returns Verification result
   */
  static verifyMessage(message: string): MpesaVerificationResult {
    if (!message || typeof message !== 'string') {
      return {
        isValid: false,
        message: "Invalid message format",
        details: {
          containsRequiredText: false
        }
      };
    }

    const normalizedMessage = message.toUpperCase().trim();
    const requiredText = this.REQUIRED_MERCHANT_TEXT.toUpperCase();
    
    // Check if message contains the required merchant text
    const containsRequiredText = normalizedMessage.includes(requiredText);
    
    if (!containsRequiredText) {
      return {
        isValid: false,
        message: "Invalid payment message - merchant verification failed",
        details: {
          containsRequiredText: false
        }
      };
    }

    // Extract additional details from the message
    const details = this.extractMessageDetails(message);
    
    return {
      isValid: true,
      message: "Payment message verified successfully",
      details: {
        containsRequiredText: true,
        ...details
      }
    };
  }

  /**
   * Extract payment details from M-Pesa message
   * @param message - The M-Pesa confirmation message
   * @returns Extracted details
   */
  private static extractMessageDetails(message: string) {
    const details: any = {
      containsRequiredText: true
    };

    // Extract amount (KSh XXX.XX)
    const amountMatch = message.match(/KSH\s*([\d,]+\.?\d*)/i);
    if (amountMatch) {
      details.amount = amountMatch[1];
    }

    // Extract transaction ID (TXN ID: XXXXXXXX)
    const txnMatch = message.match(/(?:TXN\s*ID|TRANSACTION\s*ID)[:\s]*([A-Z0-9]+)/i);
    if (txnMatch) {
      details.transactionId = txnMatch[1];
    }

    // Extract timestamp
    const timeMatch = message.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    if (timeMatch) {
      details.timestamp = timeMatch[1];
    }

    // Extract merchant name (usually after "to" or "paid to")
    const merchantMatch = message.match(/(?:TO|PAID\s*TO)[:\s]*([A-Z\s]+?)(?:\s*ON|\s*\d|$)/i);
    if (merchantMatch) {
      details.merchantName = merchantMatch[1].trim();
    }

    return details;
  }

  /**
   * Get verification status with user-friendly messages
   * @param message - The M-Pesa confirmation message
   * @returns Status object
   */
  static getVerificationStatus(message: string) {
    const result = this.verifyMessage(message);
    
    if (result.isValid) {
      return {
        status: 'verified',
        title: 'Payment Verified',
        description: 'Your M-Pesa payment has been successfully verified.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        status: 'invalid',
        title: 'Payment Not Verified',
        description: 'The payment message does not contain the required merchant verification. Please ensure you paid to the correct till number.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  }

  /**
   * Validate message format
   * @param message - The message to validate
   * @returns Validation result
   */
  static validateMessageFormat(message: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!message || message.trim().length === 0) {
      errors.push("Message cannot be empty");
    }
    
    if (message && message.length < 10) {
      errors.push("Message appears to be too short");
    }
    
    if (message && !message.toUpperCase().includes("KSH")) {
      errors.push("Message should contain payment amount (KSH)");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
