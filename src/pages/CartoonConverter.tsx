
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import { Input } from "@/components/ui/input";

const CartoonConverter = () => {
  const [convertedImage, setConvertedImage] = useState<File | null>(null);

  const handleImageSelected = (file: File) => {
    setConvertedImage(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4 font-hebrew">
              המרת תמונות
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-hebrew">
              המרת תמונות אמיתיות לקריקטורות
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-hebrew">
              צור ספור ילדים מדהים ומרהיב שהילד הוא הכוכב הראשי בספר
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-right font-hebrew">העלה תמונה</h2>
            
            <ImageUploader 
              onImageSelected={handleImageSelected}
              enableCartoonify={true}
            />
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground font-hebrew">
                האלגוריתם שלנו ממיר תמונות אמיתיות לקריקטורות בסגנון ספר ילדים.
                לתוצאות הטובות ביותר, השתמש בתמונות ברורות עם פנים ברורות ורקע פשוט.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartoonConverter;
