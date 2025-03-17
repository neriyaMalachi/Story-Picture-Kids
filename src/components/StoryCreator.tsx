
import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import ImageUploader from "./ImageUploader";
import ThemeSelector, { StoryTheme } from "./ThemeSelector";
import PhoneVerification from "./PhoneVerification";
import { useNavigate } from "react-router-dom";
import runwareService from "@/services/runwareService";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Input } from "./ui/input";

type StoryCreatorProps = {
  className?: string;
};

type Step = "upload" | "phone-verification" | "child-info" | "theme-selection" | "processing" | "select-image";

const StoryCreator = ({ className }: StoryCreatorProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [childName, setChildName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedGeneratedImageIndex, setSelectedGeneratedImageIndex] = useState<number | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const navigate = useNavigate();

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
  };

  const handleThemeSelected = (theme: StoryTheme) => {
    setSelectedTheme(theme);
  };

  const handlePhoneVerified = () => {
    setPhoneVerified(true);
    setCurrentStep("child-info");
    toast.success("מספר הטלפון אומת בהצלחה!");
  };

  const handleNext = () => {
    if (currentStep === "upload" && selectedImage) {
      setCurrentStep("phone-verification");
    } else if (currentStep === "child-info" && childName.trim()) {
      setCurrentStep("theme-selection");
    } else if (currentStep === "theme-selection" && selectedTheme) {
      setCurrentStep("processing");
      processStory();
    } else if (currentStep === "select-image" && selectedGeneratedImageIndex !== null) {
      const finalImage = generatedImages[selectedGeneratedImageIndex];
      sessionStorage.setItem("storyImages", JSON.stringify([finalImage]));
      sessionStorage.setItem("childName", childName);
      sessionStorage.setItem("storyTheme", selectedTheme?.id || "");
      
      navigate("/story/1");
    }
  };

  const handleBack = () => {
    if (currentStep === "phone-verification") {
      setCurrentStep("upload");
    } else if (currentStep === "child-info") {
      setCurrentStep("phone-verification");
      setPhoneVerified(false);
    } else if (currentStep === "theme-selection") {
      setCurrentStep("child-info");
    } else if (currentStep === "select-image") {
      setCurrentStep("theme-selection");
      setSelectedGeneratedImageIndex(null);
    }
  };

  const processStory = async () => {
    try {
      setProcessingProgress(10);
      
      const prompt = createPromptFromTheme(selectedTheme, childName);
      
      setProcessingProgress(20);
      toast.info("יוצר איורים לסיפור...");
      
      const imageURLs = await generateStoryImages(prompt);
      setGeneratedImages(imageURLs);
      
      setProcessingProgress(70);
      toast.success("האיורים נוצרו בהצלחה!");
      
      setCurrentStep("select-image");
      setProcessingProgress(80);
    } catch (error) {
      console.error("Error processing story:", error);
      toast.error("אירעה שגיאה ביצירת הסיפור. נסה שנית.");
      setCurrentStep("theme-selection");
    }
  };
  
  const createPromptFromTheme = (theme: StoryTheme | null, name: string): string => {
    if (!theme) return "";
    
    switch (theme.id) {
      case "space":
        return `A cute, friendly children's book illustration of a child named ${name} as an astronaut exploring space, colorful planets and stars in background, digital art style`;
      case "ocean":
        return `A cute, friendly children's book illustration of a child named ${name} exploring underwater ocean with colorful fish and sea creatures, digital art style`;
      case "jungle":
        return `A cute, friendly children's book illustration of a child named ${name} exploring a lush jungle with friendly animals, digital art style`;
      case "dinosaurs":
        return `A cute, friendly children's book illustration of a child named ${name} discovering friendly dinosaurs in a prehistoric world, digital art style`;
      case "fairytale":
        return `A cute, friendly children's book illustration of a child named ${name} in a magical fairytale world with castles and magical creatures, digital art style`;
      default:
        return `A cute, friendly children's book illustration of a child named ${name} having an adventure, digital art style`;
    }
  };
  
  const generateStoryImages = async (basePrompt: string): Promise<string[]> => {
    try {
      const prompt = `${basePrompt}, scene 1`;
      
      const results = await runwareService.generateMultipleImages({ 
        positivePrompt: prompt,
        model: "runware:100@1",
        style: "Disney Character"
      });
      
      return results.map(result => result.imageURL);
    } catch (error) {
      console.error("Error generating images:", error);
      return new Array(2).fill("/placeholder.svg");
    }
  };

  return (
    <div 
      className={cn(
        "w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8",
        className
      )}
    >
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          {["upload", "phone-verification", "child-info", "theme-selection", "processing", "select-image"].map((step, index) => (
            <div key={step} className="flex flex-col items-center z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  {
                    "bg-accent text-white": step === currentStep,
                    "bg-accent/20 text-accent": 
                      (step === "upload" && ["phone-verification", "child-info", "theme-selection", "processing", "select-image"].includes(currentStep)) ||
                      (step === "phone-verification" && ["child-info", "theme-selection", "processing", "select-image"].includes(currentStep)) ||
                      (step === "child-info" && ["theme-selection", "processing", "select-image"].includes(currentStep)) ||
                      (step === "theme-selection" && ["processing", "select-image"].includes(currentStep)) ||
                      (step === "processing" && ["select-image"].includes(currentStep)),
                    "bg-muted text-muted-foreground": 
                      (step === "phone-verification" && ["upload"].includes(currentStep)) ||
                      (step === "child-info" && ["upload", "phone-verification"].includes(currentStep)) ||
                      (step === "theme-selection" && ["upload", "phone-verification", "child-info"].includes(currentStep)) ||
                      (step === "processing" && ["upload", "phone-verification", "child-info", "theme-selection"].includes(currentStep)) ||
                      (step === "select-image" && ["upload", "phone-verification", "child-info", "theme-selection", "processing"].includes(currentStep)),
                  }
                )}
              >
                {index + 1}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 font-hebrew",
                  {
                    "text-accent font-medium": 
                      (step === currentStep) ||
                      (step === "upload" && ["phone-verification", "child-info", "theme-selection", "processing", "select-image"].includes(currentStep)) ||
                      (step === "phone-verification" && ["child-info", "theme-selection", "processing", "select-image"].includes(currentStep)) ||
                      (step === "child-info" && ["theme-selection", "processing", "select-image"].includes(currentStep)) ||
                      (step === "theme-selection" && ["processing", "select-image"].includes(currentStep)) ||
                      (step === "processing" && ["select-image"].includes(currentStep)),
                    "text-muted-foreground": 
                      (step === "phone-verification" && currentStep === "upload") ||
                      (step === "child-info" && ["upload", "phone-verification"].includes(currentStep)) ||
                      (step === "theme-selection" && ["upload", "phone-verification", "child-info"].includes(currentStep)) ||
                      (step === "processing" && ["upload", "phone-verification", "child-info", "theme-selection"].includes(currentStep)) ||
                      (step === "select-image" && ["upload", "phone-verification", "child-info", "theme-selection", "processing"].includes(currentStep)),
                  }
                )}
              >
                {step === "upload" && "העלאת תמונה"}
                {step === "phone-verification" && "אימות טלפון"}
                {step === "child-info" && "פרטי הילד"}
                {step === "theme-selection" && "בחירת נושא"}
                {step === "processing" && "יצירת סיפור"}
                {step === "select-image" && "בחירת איור"}
              </span>
            </div>
          ))}
          
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-accent -z-10 transition-all duration-500"
            style={{ 
              width: currentStep === "upload" 
                ? "0%" 
                : currentStep === "phone-verification" 
                ? "16%" 
                : currentStep === "child-info" 
                ? "32%" 
                : currentStep === "theme-selection" 
                ? "48%" 
                : currentStep === "processing" 
                ? "64%" 
                : "80%" 
            }}
          ></div>
        </div>
      </div>
      
      <div className="mt-10">
        {currentStep === "upload" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-right font-hebrew">העלו תמונה של הילד</h2>
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              enableCartoonify={true}
            />
            <p className="text-sm text-muted-foreground mt-3 text-center font-hebrew">
              טיפ: נסו להשתמש באופציית "הפוך לקריקטורה" לקבלת תוצאות טובות יותר!
            </p>
          </div>
        )}
        
        {currentStep === "phone-verification" && (
          <PhoneVerification 
            onVerified={handlePhoneVerified} 
            onBack={handleBack} 
          />
        )}
        
        {currentStep === "child-info" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-right font-hebrew">הזינו את שם הילד</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="childName" className="block text-sm font-medium text-muted-foreground mb-1 text-right font-hebrew">
                  שם הילד/ה
                </label>
                <input
                  type="text"
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="הזינו את שם הילד/ה"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-right font-hebrew"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === "theme-selection" && (
          <div className="animate-fade-in">
            <ThemeSelector onThemeSelected={handleThemeSelected} />
          </div>
        )}
        
        {currentStep === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="w-24 h-24 relative mb-8">
              <svg className="animate-spin w-full h-full text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-medium text-accent">
                {processingProgress}%
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 font-hebrew">יוצר את הסיפור שלך...</h3>
            <p className="text-muted-foreground max-w-md text-center font-hebrew">
              אנחנו יוצרים סיפור מיוחד עבור {childName || "הילד שלך"} בנושא {selectedTheme?.title || "שבחרת"}. זה ייקח רק כמה רגעים.
            </p>
            
            {processingProgress >= 20 && processingProgress < 70 && (
              <div className="mt-4 text-sm text-accent font-hebrew">
                יוצר איורים מותאמים אישית...
              </div>
            )}
            
            {processingProgress >= 70 && (
              <div className="mt-4 text-sm text-accent font-hebrew">
                מסיים את היצירה...
              </div>
            )}
          </div>
        )}
        
        {currentStep === "select-image" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-right font-hebrew">בחרו את האיור המועדף עליכם</h2>
            <p className="text-muted-foreground mb-8 text-right font-hebrew">
              יצרנו שני איורים שונים עבור הסיפור שלכם. בחרו את האיור שאתם מעדיפים:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all",
                    selectedGeneratedImageIndex === index 
                      ? "border-accent shadow-lg" 
                      : "border-transparent hover:border-accent/50"
                  )}
                  onClick={() => setSelectedGeneratedImageIndex(index)}
                >
                  <div className="aspect-square">
                    <img 
                      src={imageUrl} 
                      alt={`איור אפשרות ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {selectedGeneratedImageIndex === index && (
                    <div className="absolute top-3 right-3 bg-accent text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-center font-hebrew">
                    אפשרות {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {currentStep !== "processing" && currentStep !== "phone-verification" && (
        <div className="mt-10 flex justify-between">
          {currentStep !== "upload" ? (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="font-hebrew"
            >
              חזרה
            </Button>
          ) : (
            <div></div>
          )}
          
          <Button 
            variant="accent"
            onClick={handleNext}
            disabled={
              (currentStep === "upload" && !selectedImage) ||
              (currentStep === "child-info" && !childName.trim()) ||
              (currentStep === "theme-selection" && !selectedTheme) ||
              (currentStep === "select-image" && selectedGeneratedImageIndex === null)
            }
            className="font-hebrew"
          >
            {currentStep === "select-image" ? "סיים ויצור את הסיפור" : "המשך"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoryCreator;
