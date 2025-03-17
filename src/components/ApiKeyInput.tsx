import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import openaiService from "@/services/openaiService";

interface ApiKeyInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ApiKeyInput = ({ isOpen, onClose, onSuccess }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If empty, inform user they can use demo key
    if (!apiKey.trim()) {
      toast.info("אתה יכול להשתמש במפתח הדמו או להזין מפתח אישי");
      onSuccess(); // Allow them to proceed with demo key
      return;
    }
    
    setIsLoading(true);
    
    // Save the API key
    try {
      openaiService.setApiKey(apiKey);
      toast.success("מפתח API נשמר בהצלחה");
      onSuccess();
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("אירעה שגיאה בשמירת מפתח ה-API");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right font-hebrew">הזן מפתח API של OpenAI</DialogTitle>
          <DialogDescription className="text-right font-hebrew">
            כדי ליצור סיפורים מותאמים אישית, אנו זקוקים למפתח API של OpenAI.
            המפתח יישמר באופן מקומי במכשיר שלך ולא יישלח לשרתים שלנו.
            <br />
            <span className="text-green-600 font-bold">מפתח דמו כבר הוגדר במערכת אז אתה יכול להמשיך בלי להזין מפתח.</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="text-left"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground text-right font-hebrew">
              אתה יכול למצוא את מפתח ה-API שלך בהגדרות החשבון של OpenAI.
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

export default ApiKeyInput;
