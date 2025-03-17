
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-10 transition-all duration-300 ease-out-expo",
        {
          "bg-background/70 backdrop-blur-lg shadow-sm": scrolled,
          "bg-transparent": !scrolled,
        }
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-lg md:text-xl font-bold text-foreground transition-all hover:scale-105 duration-300"
        >
          <span className="text-accent">Story</span>Picture
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200"
            >
              דף הבית
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200"
            >
              איך זה עובד
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200"
            >
              מחירים
            </Link>
          </nav>
          
          <Button variant="accent" size="sm" className="font-hebrew">
            התחברות
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
