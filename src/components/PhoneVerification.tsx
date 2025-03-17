
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import smsService from "@/services/smsService";

const phoneSchema = z.object({
  phone: z.string().min(10, {
    message: "מספר הטלפון חייב להכיל לפחות 10 ספרות",
  }).max(15),
});

const codeSchema = z.object({
  code: z.string().length(6, {
    message: "קוד האימות חייב להכיל 6 ספרות",
  }),
});

type PhoneVerificationProps = {
  onVerified: () => void;
  onBack: () => void;
};

export default function PhoneVerification({ onVerified, onBack }: PhoneVerificationProps) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });

  // Manage countdown timer for resending
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendVerificationCode = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    
    try {
      const result = await smsService.sendVerificationCode({
        phoneNumber: values.phone,
      });
      
      if (result.success && result.sessionId) {
        setSessionId(result.sessionId);
        setStep("code");
        setCountdown(120); // 2 minutes countdown
        toast.success(result.message);
        
        // In development mode, get the verification code for testing
        if (process.env.NODE_ENV !== 'production') {
          const code = smsService.getDebugVerificationCode(result.sessionId);
          setDebugCode(code);
        }
      } else {
        toast.error(result.message || "שגיאה בשליחת קוד האימות");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error("אירעה שגיאה בשליחת קוד האימות. נסה שנית.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (values: z.infer<typeof codeSchema>) => {
    if (!sessionId) {
      toast.error("מזהה החיבור לא תקין");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await smsService.verifyCode({
        sessionId,
        code: values.code,
      });
      
      if (result.success && result.verified) {
        toast.success(result.message);
        onVerified();
      } else {
        toast.error(result.message);
        if (result.message.includes("פג תוקף")) {
          // If the code expired, go back to phone input
          setStep("phone");
        }
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      toast.error("אירעה שגיאה באימות הקוד. נסה שנית.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      const phone = phoneForm.getValues("phone");
      const result = await smsService.sendVerificationCode({
        phoneNumber: phone,
      });
      
      if (result.success && result.sessionId) {
        setSessionId(result.sessionId);
        setCountdown(120); // Reset countdown
        toast.success("קוד אימות חדש נשלח בהצלחה");
        
        // In development mode, get the verification code for testing
        if (process.env.NODE_ENV !== 'production') {
          const code = smsService.getDebugVerificationCode(result.sessionId);
          setDebugCode(code);
        }
      } else {
        toast.error(result.message || "שגיאה בשליחת קוד האימות");
      }
    } catch (error) {
      console.error("Error resending verification code:", error);
      toast.error("אירעה שגיאה בשליחת קוד האימות. נסה שנית.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {step === "phone" ? (
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-right font-hebrew">
            הזינו את מספר הטלפון שלכם
          </h2>
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handleSendVerificationCode)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block font-hebrew">מספר טלפון</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="הזינו את מספר הטלפון שלכם" 
                        className="text-right font-hebrew" 
                        dir="rtl"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-right font-hebrew" />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  disabled={isLoading}
                  className="font-hebrew"
                >
                  חזרה
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="font-hebrew flex-1"
                >
                  {isLoading ? "שולח..." : "שלח קוד אימות"}
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-sm text-muted-foreground mt-4 text-center font-hebrew">
            אנו נשלח קוד אימות למספר הטלפון שהזנתם
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-right font-hebrew">
            הזינו את קוד האימות
          </h2>
          
          {debugCode && process.env.NODE_ENV !== 'production' && (
            <Alert className="mb-4 border-accent/40 bg-accent/10">
              <AlertDescription className="text-right font-hebrew">
                קוד אימות לפיתוח: <span className="font-bold">{debugCode}</span>
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...codeForm}>
            <form onSubmit={codeForm.handleSubmit(handleVerifyCode)} className="space-y-6">
              <FormField
                control={codeForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-right block font-hebrew">קוד אימות</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          render={({ slots }) => (
                            <InputOTPGroup>
                              {slots.map((slot, index) => (
                                <InputOTPSlot key={index} {...slot} index={index} />
                              ))}
                            </InputOTPGroup>
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-right font-hebrew" />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || codeForm.getValues("code").length !== 6} 
                  className="font-hebrew w-full"
                >
                  {isLoading ? "מאמת..." : "אמת קוד"}
                </Button>
                
                <div className="flex justify-between items-center text-sm font-hebrew">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep("phone")}
                    disabled={isLoading}
                    className="font-hebrew text-xs"
                    size="sm"
                  >
                    שנה מספר
                  </Button>
                  
                  {countdown > 0 ? (
                    <p className="text-muted-foreground">
                      שלח קוד חדש בעוד {formatTime(countdown)}
                    </p>
                  ) : (
                    <Button 
                      type="button" 
                      variant="link" 
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="font-hebrew p-0 h-auto"
                    >
                      שלח קוד חדש
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
          
          <p className="text-sm text-muted-foreground mt-4 text-center font-hebrew">
            הזינו את הקוד שנשלח למספר הטלפון שלכם
          </p>
        </div>
      )}
    </div>
  );
}
