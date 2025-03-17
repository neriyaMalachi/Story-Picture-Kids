
const testimonials = [
    {
      id: 1,
      text: "הסיפור שיצרתם עבור הבת שלי הפך להיות הספר האהוב עליה! היא מבקשת לקרוא אותו כל ערב לפני השינה.",
      author: "רונית כהן",
      role: "אמא ל-3 ילדים",
    },
    {
      id: 2,
      text: "איזה רעיון מבריק! הילדים שלי התרגשו כל כך לראות את עצמם כגיבורים בסיפור. אפשר לראות שהם מתחברים לתוכן בצורה שונה לגמרי.",
      author: "אבי לוי",
      role: "אבא ל-2 ילדים",
    },
    {
      id: 3,
      text: "הפתעתי את הנכד שלי עם סיפור מותאם אישית, והתגובה שלו הייתה פשוט מדהימה! מומלץ בחום לכל הסבים והסבתות.",
      author: "שושנה ברקוביץ'",
      role: "סבתא גאה",
    },
  ];
  
  const Testimonials = () => {
    return (
      <section className="py-20 px-6 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              המלצות
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-hebrew">
              מה לקוחותינו אומרים
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-hebrew">
              הנה כמה חוויות מלקוחות שכבר יצרו סיפורים מותאמים אישית
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg text-right animate-slide-up"
                style={{ animationDelay: `${testimonial.id * 0.1}s` }}
              >
                <div className="mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="mb-4 text-foreground font-hebrew">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-foreground font-hebrew">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground font-hebrew">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;