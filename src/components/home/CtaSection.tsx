
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

const CtaSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto bg-accent/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501286353178-1ec871216838?auto=format&fit=crop&w=1600&q=80')] opacity-10"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-hebrew">
            מוכנים ליצור סיפור מיוחד במינו?
          </h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto font-hebrew">
            הפכו את הילד שלכם לגיבור של סיפור משלו בכמה צעדים פשוטים
          </p>
          <Button 
            variant="accent" 
            size="lg" 
            onClick={() => navigate("/create")}
            className="font-hebrew"
          >
            צרו סיפור עכשיו
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;