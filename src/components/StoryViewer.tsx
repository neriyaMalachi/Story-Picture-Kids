
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Download, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import openaiService from "@/services/openaiService";
import pdfService from "@/services/pdfService";
import { toast } from "sonner";
import { getPreGeneratedStoryByTheme } from "@/services/stories/preGeneratedStories";

type StoryViewerProps = {
  storyId: string;
};

const StoryViewer = ({ storyId }: StoryViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [storyData, setStoryData] = useState<{
    childName: string;
    theme: string;
    images: string[];
    text: string[];
    fullStoryText?: string;
    pdfUrl?: string;
  } | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the story data from an API
    // For now, we'll use the data from sessionStorage
    const storedImages = sessionStorage.getItem("storyImages");
    const childName = sessionStorage.getItem("childName") || "הילד";
    const storyTheme = sessionStorage.getItem("storyTheme") || "space";
    
    // For demo story, use pre-generated content instead of calling OpenAI
    if (storyId === "demo" || storyId.includes("-demo")) {
      // Extract theme from id
      let theme = storyTheme;
      if (storyId.includes('-demo')) {
        theme = storyId.replace('-demo', '');
      }
      
      loadDemoStory(childName, theme);
    } else {
      // Load or generate the story text for non-demo stories
      loadStoryContent(childName, storyTheme, storedImages);
    }
  }, [storyId]);

  // Get multiple images based on theme for the story pages
  const getThemeImages = (theme: string): string[] => {
    const baseImages: Record<string, string[]> = {
      space: [
        "https://img.freepik.com/premium-vector/cute-astronaut-waving-hand-cartoon-icon-illustration_138676-2722.jpg",
        "https://img.freepik.com/premium-vector/cute-astronaut-riding-rocket-cartoon-vector-icon-illustration_138676-3471.jpg",
        "https://img.freepik.com/premium-vector/astronaut-flying-with-flag-cartoon-vector-icon-illustration_138676-5201.jpg",
        "https://img.freepik.com/premium-vector/cute-astronaut-riding-planet-cartoon-vector-icon-illustration_138676-5743.jpg",
        "https://img.freepik.com/premium-vector/astronaut-sitting-planet-cartoon-vector-icon-illustration_138676-5736.jpg",
        "https://img.freepik.com/premium-vector/cute-astronaut-holding-star-cartoon-icon-illustration_138676-2498.jpg"
      ],
      ocean: [
        "https://img.freepik.com/premium-vector/cute-kids-swimming-sea-cartoon-vector-icon-illustration_138676-5182.jpg",
        "https://img.freepik.com/premium-vector/cute-child-diving-ocean-cartoon-vector-icon-illustration_138676-2822.jpg",
        "https://img.freepik.com/premium-vector/cute-kid-swimming-sea-cartoon-vector-icon-illustration_138676-5177.jpg",
        "https://img.freepik.com/premium-vector/cute-kid-playing-beach-cartoon-vector-icon-illustration_138676-6349.jpg",
        "https://img.freepik.com/premium-vector/cute-children-play-sea-beach-cartoon-icon-illustration_138676-808.jpg",
        "https://img.freepik.com/premium-vector/cute-child-building-sand-castle-beach-cartoon-vector-icon-illustration_138676-2782.jpg"
      ],
      adventure: [
        "https://img.freepik.com/premium-vector/cute-little-boy-hiking-cartoon-vector-icon-illustration_138676-5635.jpg",
        "https://img.freepik.com/premium-vector/cute-boy-with-backpack-hiking-cartoon-vector-icon-illustration_138676-5644.jpg",
        "https://img.freepik.com/premium-vector/cute-child-explorer-cartoon-vector-icon-illustration_138676-5677.jpg",
        "https://img.freepik.com/premium-vector/cute-little-boy-camping-cartoon-vector-icon-illustration_138676-5532.jpg",
        "https://img.freepik.com/premium-vector/camping-kids-cartoon-vector-icon-illustration_138676-5525.jpg",
        "https://img.freepik.com/premium-vector/cute-kids-walking-garden-cartoon-vector-icon-illustration_138676-5168.jpg"
      ],
      dinosaurs: [
        "https://img.freepik.com/premium-vector/cute-kid-with-dinosaur-costume-cartoon-vector-icon-illustration_138676-5543.jpg",
        "https://img.freepik.com/premium-vector/cute-child-with-dinosaur-costume-cartoon-vector-icon-illustration_138676-5538.jpg",
        "https://img.freepik.com/premium-vector/cute-child-with-dinosaur-costume-cartoon-vector-icon-illustration_138676-5546.jpg",
        "https://img.freepik.com/premium-vector/cute-kid-riding-dinosaur-cartoon-vector-icon-illustration_138676-5682.jpg",
        "https://img.freepik.com/premium-vector/cute-children-riding-dinosaur-cartoon-vector-icon-illustration_138676-5673.jpg",
        "https://img.freepik.com/premium-vector/cartoon-cute-kid-with-dinosaur-costume_138676-2297.jpg"
      ],
      fairytale: [
        "https://img.freepik.com/premium-vector/cute-kid-with-prince-costume-cartoon-vector-icon-illustration_138676-5559.jpg",
        "https://img.freepik.com/premium-vector/cute-kid-with-princess-costume-cartoon-vector-icon-illustration_138676-5551.jpg",
        "https://img.freepik.com/premium-vector/cute-children-flying-with-fairy-costume-cartoon-vector-icon-illustration_138676-5562.jpg",
        "https://img.freepik.com/premium-vector/cute-little-kid-riding-unicorn-cartoon-vector-icon-illustration_138676-5633.jpg",
        "https://img.freepik.com/premium-vector/child-with-fairy-costume-cartoon-vector-icon-illustration_138676-5564.jpg",
        "https://img.freepik.com/premium-vector/cute-little-kid-flying-with-cape-hero-costume-cartoon-vector-icon-illustration_138676-5538.jpg"
      ],
      jungle: [
        "https://img.freepik.com/premium-vector/cute-little-kid-safari-costume-cartoon-vector-icon-illustration_138676-5700.jpg",
        "https://img.freepik.com/premium-vector/cute-child-safari-ranger-cartoon-vector-icon-illustration_138676-5696.jpg",
        "https://img.freepik.com/premium-vector/cute-kid-exploring-jungle-cartoon-vector-icon-illustration_138676-5705.jpg",
        "https://img.freepik.com/premium-vector/cute-child-explorer-cartoon-vector-icon-illustration_138676-5677.jpg",
        "https://img.freepik.com/premium-vector/safari-kids-cartoon-vector-icon-illustration_138676-5686.jpg",
        "https://img.freepik.com/premium-vector/cute-little-kid-exploring-jungle-cartoon-vector-icon-illustration_138676-5713.jpg"
      ]
    };
    
    // Return images for the specified theme or default to adventure
    return baseImages[theme as keyof typeof baseImages] || baseImages.adventure;
  };

  const loadDemoStory = async (name: string, theme: string) => {
    // Get multiple images for the story pages based on theme
    const storyImages = getThemeImages(theme);
    
    // Try to get pre-generated story first
    const preGenerated = getPreGeneratedStoryByTheme(theme);
    
    if (preGenerated) {
      console.log('Using pre-generated story for demo:', theme);
      
      // Replace the default name with the provided name if different
      let content = preGenerated.content;
      if (name && name !== 'ילד' && name !== 'הילד') {
        content = content.replace(/ילד/g, name);
      }
      
      // Split the story into pages - exactly 6 paragraphs to match the 6 images
      const storyParagraphs = content
        .split("\n\n")
        .filter(p => !p.startsWith("#") && p !== "**סוף**");
      
      // Group paragraphs into 6 sections to match our 6 images
      const groupedParagraphs: string[] = [];
      const paragraphsPerGroup = Math.ceil(storyParagraphs.length / 6);
      
      for (let i = 0; i < storyParagraphs.length; i += paragraphsPerGroup) {
        const group = storyParagraphs.slice(i, i + paragraphsPerGroup);
        groupedParagraphs.push(group.join("\n\n"));
      }
      
      setStoryData({
        childName: name,
        theme,
        images: preGenerated.images || storyImages,
        text: groupedParagraphs.length === 6 ? groupedParagraphs : storyParagraphs.slice(0, 6),
        fullStoryText: content,
        pdfUrl: preGenerated.pdfUrl
      });
      
      return;
    }
    
    // Fall back to the stored demo stories if pre-generated is not available
    const demoStory = getDemoStoryByTheme(name, theme);
    
    setStoryData({
      childName: name,
      theme,
      images: storyImages,
      text: demoStory,
      fullStoryText: demoStory.join("\n\n")
    });
  };

  const getDemoStoryByTheme = (name: string, theme: string): string[] => {
    // Return pre-defined stories based on theme
    switch (theme) {
      case "space":
        return [
          `בוקר אחד, ${name} התעורר וגילה משהו מדהים – חללית קטנה נחתה בחצר ביתו!
${name} לבש את חליפת החלל המיוחדת, שם קסדה על ראשו, ונכנס לחללית.
החללית המריאה אל החלל החיצון במהירות האור.
${name} ראה כוכבים מנצנצים וגלקסיות צבעוניות בדרך.`,

          `פתאום, החללית של ${name} נעצרה ליד כוכב לכת מעניין במיוחד.
"אני רוצה לחקור את הכוכב הזה!" אמר ${name} בהתרגשות.
${name} יצא מהחללית וקפץ על פני השטח של הכוכב.
הכוכב היה מכוסה באבק כסוף שנצנץ בכל פסיעה של ${name}.`,

          `${name} ראה יצורים ידידותיים מתקרבים אליו בסקרנות.
היצורים היו כחולים עם עיניים גדולות ומחושים זוהרים.
הם הזמינו את ${name} לבקר בעיר שלהם מתחת לפני השטח.
עיני ${name} נפערו לרווחה כשראה עיר מלאה באורות ומבנים מוזרים.`,

          `${name} למד את השפה של היצורים ושיחק איתם משחקים מעניינים.
היצורים לימדו את ${name} איך לקפוץ גבוה בכבידה הנמוכה של הכוכב.
${name} הראה להם תמונות מכדור הארץ והם התפעלו מהאוקיינוסים והיערות.
חיוך גדול הופיע על פניו של ${name} כשהחליפו מתנות קטנות כסימן לחברות.`,

          `כשהגיע זמן לחזור הביתה, ${name} נפרד מחבריו החדשים.
היצורים נתנו ל${name} אבן זוהרת במתנה שתזכיר לו את הביקור שלו.
החללית טסה בחזרה לכדור הארץ, ו${name} נפנף לכוכב המתרחק.
בלילה, האבן הזוהרת האירה את חדרו של ${name} בצבעים קסומים של החלל.`,

          `${name} סיפר להוריו ולחבריו על ההרפתקה המופלאה שלו בחלל.
אף אחד לא האמין ל${name}, אבל הוא ידע שזה באמת קרה.
בכל פעם ש${name} מסתכל בשמיים בלילה, הוא מחפש את הכוכב של חבריו.
ו${name} מקווה שיום אחד הם יבואו לבקר אותו בכדור הארץ.`
        ];
      case "ocean":
        return [
          `יום אחד, ${name} הלך לחוף הים עם משפחתו לטיול מהנה.
השמש זרחה במלוא עוצמתה והמים היו כחולים וצלולים.
החול היה חם ונעים מתחת לכפות הרגליים של ${name}.
${name} רץ אל קו המים בהתרגשות גדולה.`,

          `פתאום, ${name} מצא בקבוק קסום ומסתורי על החוף.
כשפתח אותו, יצאה דולפינה קטנה וחייכנית בצורת אור.
"שלום ${name}," אמרה הדולפינה, "אני מגי, ואני מזמינה אותך להרפתקה."
עיניו של ${name} נפערו בהפתעה כשמגי הפכה אותו ליצור ים קסום.`,

          `${name} צלל אל מתחת לפני המים בעקבות מגי הדולפינה.
עולם חדש ומופלא נגלה לעיני ${name} - צבעים עזים ויצורים מדהימים.
${name} ומגי שחו בין שוניות אלמוגים צבעוניות וורודות, כתומות וסגולות.
דגים בכל הצבעים והגדלים התקרבו אל ${name} בסקרנות.`,

          `מגי הובילה את ${name} אל מערה סודית בקרקעית הים.
בתוך המערה ${name} גילה עיר אבודה עם מבנים עתיקים וזוהרים.
תושבי העיר היו בני ים עם זנבות מרהיבים וכתרי אלמוגים.
הם קיבלו את ${name} בברכה וערכו לכבודו מסיבה תת-ימית.`,

          `${name} רקד עם סוסוני ים וצחק עם צדפות מוזיקליות.
${name} למד איך לתקשר עם כוכבי ים ולשחק כדור עם תמנונים.
מלך בני הים לימד את ${name} איך לזהות אוצרות אבודים בחול.
יחד הם מצאו תיבה עתיקה מלאה בפנינים שנצצו בעיני ${name}.`,

          `כשהשמש החלה לשקוע, מגי אמרה ש${name} חייב לחזור ליבשה.
${name} ומגי שחו בחזרה אל החוף, נפרדו בחיבוק חם ובהבטחה להיפגש שוב.
מלך בני הים העניק ל${name} פנינה קסומה כמזכרת מהביקור.
"כשתחזיק בה ליד אוזנך," אמר המלך ל${name}, "תשמע את קולות הים."`
        ];
      // Additional themes can be added here
      default:
        return [
          `זה היה יום מיוחד עבור ${name}, יום של התחלות חדשות.
השמש זרחה בשמיים כחולים וציפורים שרו שירים עליזים.
האוויר היה מלא בריח פריחת האביב והרפתקה באוויר.
${name} ידע שזה הולך להיות יום שלא ישכח לעולם.`,

          `בזמן טיול בגינה, ${name} מצא מפה מסתורית מקופלת מתחת לאבן.
המפה הייתה ישנה וקצת קרועה, עם סימנים אדומים וכוכב גדול.
${name} פתח אותה וראה שהיא מובילה למקום קסום בלב היער.
בהתרגשות רבה, ${name} החליט לצאת מיד למסע ההרפתקה.`,

          `בדרך אל היער, ${name} פגש חתול כתום עם עיניים ירוקות.
"אני מרקו," אמר החתול להפתעתו הרבה של ${name}.
"אני יודע את דרכי היער ואשמח להצטרף למסע שלך."
${name} ומרקו המשיכו יחד, עוקבים אחר סימני המפה.`,

          `לפי המפה, ${name} והחברים הגיעו למערה קטנה מכוסה בשיחים.
בתוך המערה, ${name} גילה דלת עץ ישנה עם מנעול מיוחד.
${name} מצא מפתח קטן שתאם בדיוק למנעול הקסום.
כש${name} פתח את הדלת, אור זהוב בהיר האיר את המערה כולה.`,

          `מעבר לדלת היה גן פלאי שגרם ל${name} לפעור את פיו בהשתאות.
יצורים קטנים עם כנפיים זוהרות עפו מפרח לפרח בשמחה.
"ברוכים הבאים לגן הסודות," אמרה פיה קטנה ל${name}.
"חיכינו זמן רב למישהו אמיץ וטוב לב כמוך, ${name}."`
        ];
    }
  };

  const loadStoryContent = async (childName: string, theme: string, storedImages: string | null) => {
    try {
      // Get multiple images for the story pages based on theme
      const themeImages = getThemeImages(theme);
      
      // Use example images based on theme if no stored images
      const themeImageMap = {
        space: themeImages[0],
        ocean: themeImages[0],
        dinosaurs: themeImages[0],
        fairytale: themeImages[0],
        jungle: themeImages[0],
        adventure: themeImages[0]
      };
      
      // Get the appropriate image for the theme
      const defaultImage = themeImageMap[theme as keyof typeof themeImageMap] || themeImages[0];
      
      // Parse stored images or use default themeImages
      const images = storedImages ? JSON.parse(storedImages) : themeImages;
      
      // We'll get the story from the OpenAI service
      const response = await openaiService.generateStory(childName, theme, images[0]);
      
      if (response.success) {
        // Split the story into pages (paragraphs)
        const storyParagraphs = response.content
          .split("\n\n")
          .filter(p => !p.startsWith("#") && p !== "**סוף**");
        
        setStoryData({
          childName,
          theme,
          images,
          text: storyParagraphs,
          fullStoryText: response.content
        });
      } else {
        // If OpenAI fails, fall back to the simple generator
        generateSimpleStory(childName, theme, images);
      }
    } catch (error) {
      console.error("Error loading story content:", error);
      // Fall back to the simple generator
      generateSimpleStory(childName, theme, getThemeImages(theme));
    }
  };

  const generateSimpleStory = (name: string, theme: string, images: string[]) => {
    let story: string[] = [];
    
    switch (theme) {
      case "space":
        story = [
          `בוקר אחד, ${name} התעורר/ה וגילה/תה משהו מדהים – חללית קטנה נחתה בחצר ביתו/ה!`,
          `${name} לא היסס/ה לרגע. ${name} לבש/ה את חליפת החלל המיוחדת, שם/ה קסדה על ראשו/ה, ונכנס/ה לחללית.`,
          `החללית המריאה אל החלל החיצון. ${name} ראה/תה כוכבים מנצנצים, גלקסיות צבעוניות, והיה/תה נרגש/ת מאוד.`,
          `לפתע, ${name} ראה/תה כוכב לכת מעניין במיוחד. "אני רוצה לחקור את הכוכב הזה!" אמר/ה ${name} בהתרגשות.`,
          `${name} נחת/ה על הכוכב וגילה/תה יצורים ידידותיים שהזמינו את ${name} לשחק איתם.`,
          `אחרי יום מלא הרפתקאות, ${name} חזר/ה הביתה עם סיפורים מדהימים וחברים חדשים מהחלל החיצון!`
        ];
        break;
      case "ocean":
        story = [
          `יום אחד, ${name} הלך/ה לחוף הים עם משפחתו/ה. השמש זרחה והמים היו כחולים וצלולים.`,
          `פתאום, ${name} מצא/ה בקבוק קסום על החוף. כש${name} פתח/ה אותו, יצאה דולפינה קטנה וחייכנית שהציעה ל${name} הרפתקה.`,
          `הדולפינה הפכה את ${name} ליצור ים קסום שיכול לנשום מתחת למים. איזו הפתעה נפלאה ל${name}!`,
          `יחד עם הדולפינה, ${name} שחה/תה בין שוניות אלמוגים צבעוניות ופגש/ה דגים מכל הצבעים והגדלים.`,
          `${name} אפילו גילה/תה עיר אבודה מתחת למים, שם ${name} רקד/ה עם סוסוני ים וצדפות מוזיקליות.`,
          `בסוף היום, ${name} חזר/ה לחוף עם מתנה מיוחדת מחברי הים - פנינה קסומה שתמיד תזכיר ל${name} את ההרפתקה הנפלאה.`
        ];
        break;
      case "jungle":
        story = [
          `בחופשה האחרונה, ${name} יצא/ה לטיול בג'ונגל עם מפה מיוחדת שקיבל/ה במתנה.`,
          `בדרך, ${name} פגש/ה קוף חכם שהציע ל${name} להיות המדריך שלו/ה בג'ונגל המסתורי.`,
          `${name} והקוף טיפסו על עצים גבוהים, וביחד ${name} גילה צמחים מיוחדים שלא ראה מעולם.`,
          `לפתע, ${name} שמע קול בכי. זה היה גור נמרים קטן שאיבד את אמא שלו. ${name} החליט/ה לעזור לו.`,
          `אחרי חיפושים, ${name} מצא/ה את אמא הנמרה והחזיר/ה לה את הגור. היא לימדה את ${name} את שפת החיות.`,
          `כשהגיע זמן לחזור הביתה, כל חיות הג'ונגל באו להיפרד מ${name} והבטיחו ש${name} תמיד יהיה/תהיה אורח/ת כבוד בג'ונגל.`
        ];
        break;
      case "dinosaurs":
        story = [
          `יום אחד, ${name} מצא/ה מאובן מוזר בחצר ביתו/ה. כש${name} נגע/ה בו, קרה קסם ו${name} הועבר/ה אחורה בזמן!`,
          `${name} מצא/ה את עצמו/ה בעולם של דינוזאורים! במקום לפחד, ${name} התרגש/ה מאוד מההרפתקה החדשה.`,
          `דינוזאור צעיר וידידותי בשם רקסי הציע ל${name} לטייל על גבו וכך ${name} יצא לחקור את העולם הפרהיסטורי.`,
          `${name} ורקסי פגשו סטגוזאורים ענקיים, ו${name} אפילו ראה ביצים של פטרוזאורים בוקעות!`,
          `${name} שיחק במים עם פלזיוזאורים ולמד איך דינוזאורים חיים במשפחות מרקסי החכם.`,
          `כשהגיע זמן לחזור הביתה, ${name} נפרד/ה מחבריו. רקסי נתן ל${name} מתנה קטנה - שן דינוזאור כמזכרת מההרפתקה המדהימה.`
        ];
        break;
      case "fairytale":
        story = [
          `לילה אחד, כשהירח זרח בחלון חדרו/ה של ${name}, פיית אור קטנה הופיעה וזרקה אבקת כוכבים קסומה על ${name}.`,
          `${name} התעורר/ה ומצא/ה את עצמו/ה בממלכה קסומה עם טירות מרהיבות וחד-קרנים צבעוניים.`,
          `נסיך/ה של הממלכה הזמין/ה את ${name} להשתתף בנשף המלכותי. ${name} קיבל/ה בגדים מפוארים וכתר נוצץ.`,
          `בדרך לנשף, ${name} עזר/ה לדרקון קטן שנתקע על עץ גבוה, ו${name} פתר/ה חידה של גמד חכם.`,
          `בנשף, התברר שהמפתח הקסום ש${name} מצא פותח את שער הקסמים של הממלכה. כולם הריעו ל${name} כגיבור/ה.`,
          `לפני ש${name} חזר/ה הביתה, מלך ומלכת הממלכה העניקו ל${name} תליון קסום שיאפשר לו/ה לבקר בממלכה בכל פעם שירצה/תרצה.`
        ];
        break;
      default:
        story = [
          `זה היה יום מיוחד עבור ${name}. הרפתקה מדהימה עמדה להתחיל!`,
          `${name} מצא/ה מפה מסתורית שהובילה את ${name} למקום קסום שאף אחד לא ראה קודם.`,
          `בדרך, ${name} פגש/ה חברים חדשים שהצטרפו למסע של ${name}. יחד הם התגברו על אתגרים מרתקים.`,
          `${name} גילה/תה שיש לו/ה כוחות מיוחדים שעזרו ל${name} לפתור בעיות ולעזור לאחרים.`,
          `כולם העריכו את ${name} על האומץ, החכמה והלב הטוב שהפגין/ה במסע.`,
          `בסוף היום, ${name} חזר/ה הביתה עם חיוך גדול וזכרונות נפלאים מההרפתקה המיוחדת שעבר/ה.`
        ];
    }
    
    // Using String.prototype.replace instead of replaceAll for better compatibility
    
    // Return story and images
    setStoryData({
      childName: name,
      theme,
      images,
      text: getDemoStoryByTheme(name, theme),
      fullStoryText: getDemoStoryByTheme(name, theme).join("\n\n")
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!storyData) return;
    
    try {
      // If we already have a pre-generated PDF URL, use it
      if (storyData.pdfUrl) {
        window.open(storyData.pdfUrl, '_blank');
        return;
      }
      
      setIsGeneratingPDF(true);
      toast.info("מכין קובץ PDF...");
      
      // Create title for the PDF
      const title = `${storyData.childName} והרפתקה ב${storyData.theme === "space" ? "חלל" : 
        storyData.theme === "ocean" ? "ים" : 
        storyData.theme === "jungle" ? "ג'ונגל" : 
        storyData.theme === "dinosaurs" ? "עולם הדינוזאורים" : 
        storyData.theme === "fairytale" ? "ממלכת הקסמים" : "הרפתקה מיוחדת"}`;
      
      // Generate the PDF using our service
      const pdfUrl = await pdfService.generateStoryPDF(
        title,
        storyData.fullStoryText || storyData.text.join("\n\n"),
        storyData.images[0]
      );
      
      if (pdfUrl) {
        // Update the story data with the PDF URL
        setStoryData({
          ...storyData,
          pdfUrl
        });
        
        // Open the PDF in a new tab
        window.open(pdfUrl, '_blank');
        toast.success("הקובץ PDF נוצר בהצלחה!");
      } else {
        toast.error("אירעה שגיאה ביצירת קובץ PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("אירעה שגיאה ביצירת קובץ PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!storyData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative bg-accent/10 p-6 md:p-8 flex items-center">
        <Link to="/" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground font-hebrew mb-2">
            {storyData.childName} והרפתקה ב{storyData.theme === "space" ? "חלל" : 
              storyData.theme === "ocean" ? "ים" : 
              storyData.theme === "jungle" ? "ג'ונגל" : 
              storyData.theme === "dinosaurs" ? "עולם הדינוזאורים" : 
              storyData.theme === "fairytale" ? "ממלכת הקסמים" : "הרפתקה מיוחדת"}
          </h1>
          <p className="text-muted-foreground text-center font-hebrew">
            עמוד {currentPage + 1} מתוך {storyData.text.length}
          </p>
        </div>
      </div>
      
      <div className="relative flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <div className="aspect-square rounded-xl overflow-hidden mb-6 shadow-md">
            <img 
              src={storyData.images[Math.min(currentPage, storyData.images.length - 1)]} 
              alt={`איור לסיפור של ${storyData.childName}`}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
              onError={(e) => {
                console.error('Image failed to load:', e);
                // Fallback to a default image if loading fails
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <Button 
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
              disabled={currentPage === 0}
              variant="outline"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              <span className="font-hebrew">הקודם</span>
            </Button>
            
            <Button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, storyData.text.length - 1))} 
              disabled={currentPage === storyData.text.length - 1}
              variant="outline"
            >
              <span className="font-hebrew">הבא</span>
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-6 md:p-8 md:border-l border-border">
          <div 
            className="h-[300px] md:h-[400px] overflow-y-auto p-4 text-lg leading-relaxed whitespace-pre-wrap text-right font-hebrew"
            dir="rtl"
          >
            {storyData.text[currentPage]}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer size={16} />
              <span className="font-hebrew">הדפסה</span>
            </Button>
            
            <Button 
              variant="accent" 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Download size={16} />
              )}
              <span className="font-hebrew">הורדת PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
