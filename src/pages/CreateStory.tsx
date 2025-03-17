
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryCreator from "@/components/StoryCreator";

const CreateStory = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              יצירת סיפור
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-hebrew">
              צרו סיפור מותאם אישית
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-hebrew">
              הפכו את הילד שלכם לגיבור של סיפור מרתק בכמה צעדים פשוטים
            </p>
          </div>
          
          <StoryCreator className="animate-fade-in" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateStory;
