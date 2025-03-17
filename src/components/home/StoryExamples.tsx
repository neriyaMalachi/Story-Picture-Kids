
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

const StoryExamples = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            הסיפורים שלנו
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-hebrew">
            דוגמאות לסיפורים
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-hebrew">
            הנה כמה דוגמאות לסיפורים שיצרנו עבור ילדים אחרים
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              image: "https://img.freepik.com/premium-vector/cute-astronaut-waving-hand-cartoon-icon-illustration_138676-2722.jpg",
              theme: "space-demo",
              title: "הרפתקה בחלל",
              desc: "דניאל יוצא להרפתקה מרהיבה בין כוכבים וגלקסיות"
            },
            {
              id: 2,
              image: "https://img.freepik.com/premium-vector/cute-little-boy-hiking-cartoon-vector-icon-illustration_138676-5635.jpg",
              theme: "adventure-demo",
              title: "גיבור-על",
              desc: "מיכל מגלה את הכוחות המיוחדים שלה ומצילה את העיר"
            },
            {
              id: 3,
              image: "https://img.freepik.com/premium-vector/cute-kids-swimming-sea-cartoon-vector-icon-illustration_138676-5182.jpg",
              theme: "ocean-demo",
              title: "עולם הים",
              desc: "יואב יוצא להרפתקה מופלאה מתחת לגלי האוקיינוס"
            }
          ].map((story) => (
            <div 
              key={story.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl hover:translate-y-[-8px] group animate-scale-in cursor-pointer"
              style={{ animationDelay: `${story.id * 0.2}s` }}
              onClick={() => navigate(`/story/${story.theme}`)}
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={story.image}
                  alt={`דוגמת סיפור ${story.title}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full text-white font-hebrew">
                    <span className="text-sm animate-pulse">לחץ לצפייה בדוגמה</span>
                  </div>
                </div>
              </div>
              <div className="p-6 text-right font-hebrew">
                <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors group-hover:text-accent">
                  {story.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {story.desc}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-center group-hover:bg-accent/10 group-hover:text-accent transition-all duration-300"
                >
                  צפייה בדוגמה
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryExamples;