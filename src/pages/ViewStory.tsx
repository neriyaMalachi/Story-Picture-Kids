
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryViewer from "@/components/StoryViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import openaiService from "@/services/openaiService";
import { initializePreGeneratedStories, getPreGeneratedStoryByTheme } from "@/services/stories/preGeneratedStories";

const ViewStory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [storyExists, setStoryExists] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize pre-generated stories
    const initStories = async () => {
      try {
        console.log("ViewStory: Starting initialization of pre-generated stories");
        setInitializing(true);
        await initializePreGeneratedStories();
        console.log("ViewStory: Finished initialization of pre-generated stories");
      } catch (error) {
        console.error("Failed to initialize pre-generated stories:", error);
      } finally {
        setInitializing(false);
        checkStoryExists(); // Check story exists after initialization completes
      }
    };
    
    // Check if story exists
    const checkStoryExists = async () => {
      console.log(`Checking if story exists with ID: ${id}`);
      setIsLoading(false);
      
      // Special handling for demo stories
      if (id && (id.includes('-demo') || id === 'demo' || id === 'space-demo' || id === 'ocean-demo' || id === 'adventure-demo')) {
        console.log(`This is a demo story: ${id}`);
        
        // Extract theme from id
        let theme = 'space';
        if (id.includes('-demo')) {
          theme = id.replace('-demo', '');
        }
        
        // Check if pre-generated story exists
        const preGenerated = getPreGeneratedStoryByTheme(theme);
        if (preGenerated) {
          console.log(`Demo story found for theme: ${theme}`);
          setStoryExists(true);
          return;
        } else {
          console.log(`Demo story NOT found for theme: ${theme}, will need to generate it`);
        }
      }
      
      // For demo purposes, let's assume all stories exist except for ones with id="invalid"
      if (id === "invalid") {
        setStoryExists(false);
        toast.error("הסיפור לא נמצא");
      } else {
        setStoryExists(true);
      }
    };
    
    // For demo stories, we now have a built-in API key, so no need to show the dialog
    const apiKey = openaiService.getApiKey();
    if (!apiKey && id !== "demo" && !id?.includes('-demo')) {
      setShowApiKeyDialog(true);
    }
    
    initStories();
  }, [id]);

  const handleApiKeySuccess = () => {
    setShowApiKeyDialog(false);
  };

  if (isLoading || initializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-xl text-muted-foreground font-hebrew">טוען את הסיפור...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!storyExists) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 font-hebrew">הסיפור לא נמצא</h1>
            <Button onClick={() => navigate("/")}>חזרה לעמוד הראשי</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              <span className="font-hebrew">חזרה</span>
            </Button>
          </div>
          
          <StoryViewer storyId={id || ""} />
        </div>
      </main>
      
      <Footer />
      
      <ApiKeyInput 
        isOpen={showApiKeyDialog} 
        onClose={() => setShowApiKeyDialog(false)}
        onSuccess={handleApiKeySuccess}
      />
    </div>
  );
};

export default ViewStory;
