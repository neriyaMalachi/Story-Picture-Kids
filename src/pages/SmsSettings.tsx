import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import smsService from "@/services/smsService";

const SmsSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testSessionId, setTestSessionId] = useState<string | null>(null);
  const [testCode, setTestCode] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testVerifying, setTestVerifying] = useState(false);
  
  useEffect(() => {
    // Load saved API key on component mount
    const key = smsService.getApiKey();
    setSavedApiKey(key);
    if (key) {
      // Mask the API key for display
      setApiKey("•".repeat(Math.min(key.length, 20)));
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("נא להזין מפתח API תקף");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Skip saving if the key is all bullets (unchanged)
      if (apiKey.match(/^•+$/)) {
        toast.info("לא בוצע שינוי במפתח ה-API");
        setIsLoading(false);
        return;
      }
      
      smsService.setApiKey(apiKey);
      toast.success("מפתח API נשמר בהצלחה");
      setSavedApiKey(apiKey);
      // Mask the API key for display
      setApiKey("•".repeat(Math.min(apiKey.length, 20)));
    } catch (error) {
      console.error("Error saving SMS API key:", error);
      toast.error("אירעה שגיאה בשמירת מפתח ה-API");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestSendSms = async () => {
    if (!testPhone) {
      toast.error("נא להזין מספר טלפון לבדיקה");
      return;
    }
    
    setTestSending(true);
    
    try {
      const result = await smsService.sendVerificationCode({
        phoneNumber: testPhone,
      });
      
      if (result.success && result.sessionId) {
        setTestSessionId(result.sessionId);
        toast.success(result.message);
        
        // In development, get the debug code
        if (process.env.NODE_ENV !== 'production') {
          const code = smsService.getDebugVerificationCode(result.sessionId);
          if (code) {
            toast.info(`קוד בדיקה: ${code}`);
          }
        }
      } else {
        toast.error(result.message || "שגיאה בשליחת קוד האימות");
      }
    } catch (error) {
      console.error("Error testing SMS:", error);
      toast.error("אירעה שגיאה בבדיקת שליחת SMS");
    } finally {
      setTestSending(false);
    }
  };
  
  const handleTestVerifyCode = async () => {
    if (!testSessionId) {
      toast.error("אין מזהה חיבור פעיל. שלח הודעת בדיקה תחילה");
      return;
    }
    
    if (!testCode) {
      toast.error("נא להזין קוד אימות");
      return;
    }
    
    setTestVerifying(true);
    
    try {
      const result = await smsService.verifyCode({
        sessionId: testSessionId,
        code: testCode,
      });
      
      if (result.success) {
        if (result.verified) {
          toast.success(result.message);
          setTestSessionId(null);
          setTestCode("");
        } else {
          toast.error(result.message);
        }
      } else {
        toast.error(result.message || "שגיאה באימות הקוד");
      }
    } catch (error) {
      console.error("Error verifying test code:", error);
      toast.error("אירעה שגיאה בבדיקת אימות קוד");
    } finally {
      setTestVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              הגדרות
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-hebrew">
              הגדרות שירות SMS
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-hebrew">
              הגדר את שירות ה-SMS לאימות מספרי טלפון
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-right font-hebrew">מפתח API</CardTitle>
                <CardDescription className="text-right font-hebrew">
                  הזן את מפתח ה-API של שירות ה-SMS שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="apiKey" className="text-sm font-medium text-right block font-hebrew">
                      מפתח API
                    </label>
                    <Input
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="הזן מפתח API..."
                      className="text-left"
                      type="password"
                    />
                  </div>
                  
                  {savedApiKey && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-right font-hebrew text-green-700">
                        יש לך מפתח API מוגדר
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleSaveApiKey}
                  disabled={isLoading || !apiKey.trim()}
                  className="font-hebrew"
                >
                  {isLoading ? "שומר..." : "שמור מפתח"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right font-hebrew">בדיקת השירות</CardTitle>
                <CardDescription className="text-right font-hebrew">
                  בדוק את פעילות שירות ה-SMS על ידי שליחת הודעת בדיקה
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="testPhone" className="text-sm font-medium text-right block font-hebrew">
                      מספר טלפון לבדיקה
                    </label>
                    <Input
                      id="testPhone"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="הזן מספר טלפון..."
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  
                  {testSessionId && (
                    <div className="space-y-2">
                      <label htmlFor="testCode" className="text-sm font-medium text-right block font-hebrew">
                        קוד אימות
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="testCode"
                          value={testCode}
                          onChange={(e) => setTestCode(e.target.value)}
                          placeholder="הזן קוד אימות..."
                          className="text-left"
                        />
                        <Button
                          onClick={handleTestVerifyCode}
                          disabled={testVerifying || !testCode.trim()}
                          className="font-hebrew"
                        >
                          {testVerifying ? "מאמת..." : "אמת קוד"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleTestSendSms}
                  disabled={testSending || !testPhone.trim() || !savedApiKey}
                  className="font-hebrew"
                >
                  {testSending ? "שולח..." : "שלח הודעת בדיקה"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 text-right font-hebrew">
              מידע נוסף
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground text-right font-hebrew">
                שירות ה-SMS מאפשר לך לאמת משתמשים באמצעות מספר הטלפון שלהם. 
                כדי להשתמש בשירות, עליך להשיג מפתח API משירות SMS כמו Twilio, Vonage, או MessageBird.
              </p>
              
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="font-hebrew">מידע על חיבור לשירותי SMS</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-lg">
                    <DrawerHeader>
                      <DrawerTitle className="text-right font-hebrew">חיבור לשירותי SMS</DrawerTitle>
                      <DrawerDescription className="text-right font-hebrew">
                        מידע על איך לחבר את המערכת לשירותי SMS מובילים
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-right font-hebrew mb-2">Twilio</h3>
                        <p className="text-muted-foreground text-right font-hebrew">
                          צור חשבון ב-Twilio והשג את מפתח ה-API שלך מלוח המחוונים. 
                          עליך להשתמש במזהה החשבון (Account SID) כמפתח ה-API.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-right font-hebrew mb-2">Vonage (Nexmo)</h3>
                        <p className="text-muted-foreground text-right font-hebrew">
                          הירשם ל-Vonage API Platform והשג את מפתח ה-API שלך 
                          מהגדרות החשבון.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-right font-hebrew mb-2">MessageBird</h3>
                        <p className="text-muted-foreground text-right font-hebrew">
                          צור חשבון ב-MessageBird והשג את מפתח ה-API שלך 
                          מהגדרות המפתחות של החשבון.
                        </p>
                      </div>
                    </div>
                    <DrawerFooter>
                      <Button variant="outline" className="font-hebrew">סגור</Button>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SmsSettings;
