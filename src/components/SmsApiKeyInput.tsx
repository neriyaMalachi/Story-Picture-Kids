
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import smsService from "@/services/smsService";

interface SmsApiKeyInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SmsApiKeyInput = ({ isOpen, onClose, onSuccess }: SmsApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("נא להזין מפתח API תקף");
      return;
    }
    
    setIsLoading(true);
    
    // Save the API key
    try {
      smsService.setApiKey(apiKey);
      toast.success("מפתח API נשמר בהצלחה");
      onSuccess();
    } catch (error) {
      console.error("Error saving SMS API key:", error);
      toast.error("אירעה שגיאה בשמירת מפתח ה-API");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right font-hebrew">הזן מפתח API של שירות SMS</DialogTitle>
          <DialogDescription className="text-right font-hebrew">
            כדי לשלוח הודעות SMS לאימות, אנו זקוקים למפתח API של שירות SMS.
            המפתח יישמר באופן מקומי במכשיר שלך ולא יישלח לשרתים שלנו.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="הזן מפתח API של שירות SMS..."
              className="text-left"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground text-right font-hebrew">
              אתה יכול למצוא את מפתח ה-API בהגדרות החשבון של שירות ה-SMS שלך.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="font-hebrew"
            >
              ביטול
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="font-hebrew"
            >
              {isLoading ? "שומר..." : "שמור מפתח"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SmsApiKeyInput;
