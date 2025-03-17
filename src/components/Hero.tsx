
import { useEffect, useRef } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      
      const scrollPosition = window.scrollY;
      const parallaxFactor = 0.4;
      
      // Apply parallax effect to background
      hero.style.backgroundPositionY = `${scrollPosition * parallaxFactor}px`;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-background to-secondary/30 bg-no-repeat bg-cover px-6 py-32 font-hebrew text-right overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40 z-0"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="lg:order-2 flex justify-center">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full transform -translate-x-4 translate-y-4"></div>
            <img 
              src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80" 
              alt="ילד בסיפור אישי" 
              className="w-[400px] h-[400px] object-cover rounded-xl shadow-xl animate-slide-down"
              style={{ animationDelay: "0.3s" }}
            />
            
            <div className="absolute -bottom-6 -right-6 bg-accent/90 text-white p-4 rounded-lg shadow-lg rotate-3 animate-slide-up" style={{ animationDelay: "0.8s" }}>
              <p className="text-sm">״הסיפור המהמם של דניאל הפך לספר האהוב עליו!״</p>
            </div>
          </div>
        </div>
        
        <div className="lg:order-1 animate-slide-up">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            קסם של סיפור
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
            הפכו את ילדכם לגיבור
            <br /> 
            <span className="text-accent">בסיפור משלו</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            העלו תמונה ושם בחרו נושא ואנו נצור לכם ספר ילדים מרהיב בו ילדכם הגבור הראשי ונשלח לכם אותו מודפס
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="accent" 
              size="lg" 
              className="animate-zoom-in"
              style={{ animationDelay: "0.5s" }}
              onClick={() => navigate("/create")}
            >
              צרו סיפור עכשיו
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="animate-zoom-in"
              style={{ animationDelay: "0.7s" }}
              onClick={() => navigate("/how-it-works")}
            >
              איך זה עובד?
            </Button>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: "1s" }}>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center border-2 border-background">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">+2,500</span> סיפורים נוצרו החודש
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-muted-foreground/80 text-sm mb-2">גלול למטה</span>
        <svg 
          width="20" 
          height="10" 
          viewBox="0 0 20 10" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L10 9L19 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
