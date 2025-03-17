
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

const steps = [
  {
    id: 1,
    title: "העלאת תמונה",
    description: "העלו תמונה של הילד שלכם",
    icon: "📷",
  },
  {
    id: 2,
    title: "בחירת נושא",
    description: "בחרו נושא לסיפור מתוך מגוון אפשרויות",
    icon: "🎨",
  },
  {
    id: 3,
    title: "המרה לאיור",
    description: "המערכת תמיר את התמונה לאיור מקצועי",
    icon: "✨",
  },
  {
    id: 4,
    title: "יצירת סיפור",
    description: "הילד שלכם יהפוך לגיבור בסיפור מרתק",
    icon: "📚",
  },
  {
    id: 5,
    title: "שליחה להדפסה",
    description: "שלחו את הסיפור המוכן להדפסה וקבלו ספר מוחשי",
    icon: "🖨️",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            פשוט וקל
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-hebrew">
            איך זה עובד?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-hebrew">
            חמישה שלבים פשוטים להפוך את הילד שלכם לגיבור של סיפור מיוחד במינו
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] text-right animate-slide-up"
              style={{ animationDelay: `${step.id * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 text-2xl">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 font-hebrew">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-hebrew">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="accent" 
            size="lg" 
            onClick={() => navigate("/create")}
            className="font-hebrew animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            צרו סיפור עכשיו
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;