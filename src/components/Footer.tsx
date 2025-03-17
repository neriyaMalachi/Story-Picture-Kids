
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary py-12 px-6 mt-20 font-hebrew text-right">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link to="/" className="text-xl font-bold text-foreground">
            <span className="text-accent">Story</span>Picture
          </Link>
          <p className="mt-4 text-muted-foreground">
            הפכו את ילדכם לגיבור של סיפור משלהם, עם הדמות והשם שלהם.
          </p>
        </div>
        
        <div className="md:col-span-1">
          <h3 className="font-semibold text-foreground mb-4">קישורים</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                דף הבית
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                איך זה עובד
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                מחירים
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="md:col-span-1">
          <h3 className="font-semibold text-foreground mb-4">עזרה ותמיכה</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                שאלות נפוצות
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                צור קשר
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                מדיניות פרטיות
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="md:col-span-1">
          <h3 className="font-semibold text-foreground mb-4">השאירו פרטים</h3>
          <p className="text-muted-foreground mb-3">
            הירשמו לקבלת עדכונים והנחות
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="האימייל שלך" 
              className="bg-background border-input rounded-r-none rounded-l-md border px-3 py-2 text-sm w-full" 
            />
            <button className="bg-accent text-accent-foreground rounded-l-none rounded-r-md px-3 py-2 text-sm">
              הרשמה
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} StoryPicture. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
};

export default Footer;
