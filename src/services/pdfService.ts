
import { jsPDF } from "jspdf";
import { toast } from "sonner";

class PDFService {
  async generateStoryPDF(
    title: string, 
    storyText: string, 
    imageUrl: string
  ): Promise<string> {
    try {
      console.log(`Generating PDF with title: ${title}, image: ${imageUrl}`);
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      const titleWidth = pdf.getStringUnitWidth(title) * 24 / pdf.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(title, titleX, 30);
      
      let yPosition = 50; // Start position for text if no image
      
      // Add image if available - but make it optional
      if (imageUrl) {
        try {
          const imgWidth = 100;
          const imgHeight = 100;
          const imgX = (pageWidth - imgWidth) / 2;
          const imgY = 40;
          
          // Try loading the image - with a timeout and error handling
          const img = await this.loadImage(imageUrl, 10000).catch(err => {
            console.error("Error loading image for PDF:", err);
            return null;
          });
          
          if (img) {
            pdf.addImage(
              img, 
              'JPEG', 
              imgX, 
              imgY, 
              imgWidth, 
              imgHeight
            );
            console.log("Image added to PDF successfully");
            yPosition = 150; // Adjust starting position for text after image
          } else {
            console.log("Image loading failed, continuing without image");
          }
        } catch (imgError) {
          console.error("Error processing image for PDF:", imgError);
          // Continue without the image
        }
      }
      
      // Add story text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      
      // Split text into paragraphs
      const paragraphs = storyText.split("\n\n");
      
      for (const paragraph of paragraphs) {
        // Skip markdown headers
        if (paragraph.startsWith("#")) continue;
        if (paragraph === "**סוף**") {
          pdf.setFont("helvetica", "bold");
          pdf.text("סוף", pageWidth - margin, yPosition, { align: "right" });
          break;
        }
        
        // Add the paragraph
        const lines = pdf.splitTextToSize(paragraph, contentWidth);
        
        // Check if we need a new page
        if (yPosition + (lines.length * 7) > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // RTL support for Hebrew
        pdf.text(lines, pageWidth - margin, yPosition, { align: "right" });
        yPosition += (lines.length * 7) + 10;
      }
      
      // Generate PDF as data URL
      const pdfOutput = pdf.output("datauristring");
      console.log(`Generated PDF successfully, URL length: ${pdfOutput.length}`);
      return pdfOutput;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("אירעה שגיאה ביצירת קובץ PDF");
      return "";
    }
  }
  
  // Helper method to load an image with timeout
  private loadImage(src: string, timeout: number = 15000): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // To avoid CORS issues
      
      // Make sure image URL is absolute
      const fullImageUrl = src.startsWith('http') ? src : window.location.origin + src;
            
      const timer = setTimeout(() => {
        img.src = ""; // Cancel the image request
        reject(new Error("Image load timeout"));
      }, timeout);
      
      img.onload = () => {
        clearTimeout(timer);
        console.log("Image loaded successfully, dimensions:", img.width, "x", img.height);
        resolve(img);
      };
      
      img.onerror = (e) => {
        clearTimeout(timer);
        console.error("Error loading image:", e);
        reject(new Error("Failed to load image"));
      };
      
      img.src = fullImageUrl;
      console.log(`Loading image from: ${fullImageUrl}`);
    });
  }
}

export default new PDFService();
