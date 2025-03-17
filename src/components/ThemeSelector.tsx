import { useState } from "react";
import { cn } from "@/lib/utils";

export type StoryTheme = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

const storyThemes: StoryTheme[] = [
  {
    id: "space-adventure",
    title: "הרפתקה בחלל",
    description: "הילד שלך יצא להרפתקה מרתקת בין כוכבים וגלקסיות",
    imageUrl: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ocean-explorer",
    title: "חוקר האוקיינוס",
    description: "מסע מתחת למים בין יצורי ים מופלאים",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dinosaur-world",
    title: "עולם הדינוזאורים",
    description: "הילד שלך נוסע בזמן לעולם הדינוזאורים",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fairy-tale",
    title: "אגדת פיות",
    description: "הרפתקה בעולם קסום של פיות ויצורים מופלאים",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "superhero",
    title: "גיבור-על",
    description: "הילד שלך הופך לגיבור-על עם כוחות מיוחדים",
    imageUrl: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "safari",
    title: "ספארי באפריקה",
    description: "הרפתקה בין חיות הבר המרהיבות של אפריקה",
    imageUrl: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=800&q=80",
  },
];

type ThemeSelectorProps = {
  onThemeSelected: (theme: StoryTheme) => void;
};

const ThemeSelector = ({ onThemeSelected }: ThemeSelectorProps) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const handleThemeClick = (theme: StoryTheme) => {
    setSelectedThemeId(theme.id);
    onThemeSelected(theme);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-right font-hebrew">בחרו נושא לסיפור</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {storyThemes.map((theme) => (
          <div
            key={theme.id}
            className={cn(
              "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] book-shadow",
              {
                "ring-2 ring-accent scale-[1.02]": selectedThemeId === theme.id,
              }
            )}
            onClick={() => handleThemeClick(theme)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-10"></div>
            
            <img
              src={theme.imageUrl}
              alt={theme.title}
              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-right">
              <h3 className="text-white font-semibold text-lg mb-1 font-hebrew">
                {theme.title}
              </h3>
              <p className="text-white/80 text-sm line-clamp-2 font-hebrew">
                {theme.description}
              </p>
            </div>
            
            {selectedThemeId === theme.id && (
              <div className="absolute top-3 right-3 z-20 bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
