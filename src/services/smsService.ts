
// SMS verification service that can be connected to an actual SMS provider
// like Twilio, Vonage (Nexmo), or MessageBird

interface VerificationRequest {
  phoneNumber: string;
}

interface VerificationResponse {
  success: boolean;
  sessionId?: string;
  message: string;
}

interface CodeVerificationRequest {
  sessionId: string;
  code: string;
}

interface CodeVerificationResponse {
  success: boolean;
  message: string;
  verified?: boolean;
}

class SmsService {
  private apiKey: string | null = null;
  private verificationCodes: Map<string, { code: string, phone: string, expiresAt: number }> = new Map();
  
  /**
   * Set the API key for the SMS service
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('sms_api_key', key);
    console.log('SMS API key has been set');
  }
  
  /**
   * Get the stored API key
   */
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('sms_api_key');
    }
    return this.apiKey;
  }
  
  /**
   * Send a verification code to the provided phone number
   */
  async sendVerificationCode(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      // Check if API key is set
      if (!this.getApiKey()) {
        console.warn('SMS API key is not set');
        // For demo purposes, we'll continue without an API key
      }
      
      console.log(`Sending verification code to ${request.phoneNumber}`);
      
      // In production, this would make an API call to an SMS provider
      // For demo purposes, we'll generate a random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Store the code for later verification with 10 minute expiry
      this.verificationCodes.set(sessionId, {
        code,
        phone: request.phoneNumber,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      });
      
      console.log(`Generated verification code: ${code} for session: ${sessionId}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        sessionId,
        message: "קוד אימות נשלח בהצלחה"
      };
    } catch (error) {
      console.error("Error sending verification code:", error);
      return {
        success: false,
        message: "שגיאה בשליחת קוד האימות"
      };
    }
  }
  
  /**
   * Verify the code provided by the user
   */
  async verifyCode(request: CodeVerificationRequest): Promise<CodeVerificationResponse> {
    try {
      console.log(`Verifying code for session ${request.sessionId}`);
      
      // Check if the session exists
      const verificationData = this.verificationCodes.get(request.sessionId);
      
      if (!verificationData) {
        return {
          success: false,
          verified: false,
          message: "מזהה חיבור לא תקין או שפג תוקפו"
        };
      }
      
      // Check if the code has expired
      if (Date.now() > verificationData.expiresAt) {
        this.verificationCodes.delete(request.sessionId);
        return {
          success: false,
          verified: false,
          message: "פג תוקף קוד האימות. אנא בקש קוד חדש"
        };
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In production, this would validate with the SMS provider
      // For demo, we'll compare against our stored code
      const isValid = request.code === verificationData.code;
      
      if (isValid) {
        // Clean up after successful verification
        this.verificationCodes.delete(request.sessionId);
      }
      
      return {
        success: true,
        verified: isValid,
        message: isValid 
          ? "קוד אומת בהצלחה" 
          : "קוד אימות שגוי"
      };
    } catch (error) {
      console.error("Error verifying code:", error);
      return {
        success: false,
        verified: false,
        message: "שגיאה באימות הקוד"
      };
    }
  }
  
  /**
   * For development only - get the stored verification code
   */
  getDebugVerificationCode(sessionId: string): string | null {
    if (process.env.NODE_ENV !== 'production') {
      const data = this.verificationCodes.get(sessionId);
      return data?.code || null;
    }
    return null;
  }
}

const smsService = new SmsService();
export default smsService;
