
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import runwareService from "@/services/runwareService";
import { toast } from "sonner";

type ImageUploaderProps = {
  onImageSelected: (file: File) => void;
  className?: string;
  enableCartoonify?: boolean;
};

const ImageUploader = ({ onImageSelected, className, enableCartoonify = false }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isCartoonified, setIsCartoonified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    handleFile(file);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      // Handle non-image file
      console.error("Please upload an image file");
      return;
    }

    setIsLoading(true);
    setIsCartoonified(false);
    setOriginalFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setIsLoading(false);
      onImageSelected(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    handleFile(files[0]);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCartoonify = async () => {
    if (!originalFile) return;
    
    try {
      setIsLoading(true);
      toast.info("הופך את התמונה לקריקטורה...");
      
      // Call the cartoonify API
      const cartoonImageUrl = await runwareService.cartoonifyImage(originalFile);
      
      // Update the preview with the cartoonified image
      setPreviewUrl(cartoonImageUrl);
      setIsCartoonified(true);
      
      // Convert URL to File object to pass back
      const response = await fetch(cartoonImageUrl);
      const blob = await response.blob();
      const cartoonFile = new File([blob], `cartoon_${originalFile.name}`, { type: originalFile.type });
      
      // Call the parent's onImageSelected with the new cartoon image
      onImageSelected(cartoonFile);
      
      toast.success("התמונה הומרה לקריקטורה בהצלחה!");
    } catch (error) {
      console.error("Error converting to cartoon:", error);
      toast.error("אירעה שגיאה בהמרה לקריקטורה");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCartoonMode = async () => {
    if (!originalFile) return;
    
    if (isCartoonified) {
      // Switch back to original image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setIsCartoonified(false);
        onImageSelected(originalFile);
      };
      reader.readAsDataURL(originalFile);
    } else {
      // Convert to cartoon
      await handleCartoonify();
    }
  };

  return (
    <div 
      className={cn(
        "w-full bg-secondary/50 rounded-xl transition-all duration-300",
        {
          "ring-2 ring-accent ring-offset-2": isDragging,
          "hover:bg-secondary": !isDragging && !previewUrl,
        },
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div 
        className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 cursor-pointer"
        onClick={previewUrl ? undefined : triggerFileInput}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">מעבד את התמונה...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full flex flex-col items-center">
            <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-lg">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto object-cover rounded-xl image-reveal" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {enableCartoonify && originalFile && (
                <Button 
                  onClick={toggleCartoonMode} 
                  variant="default" 
                  size="sm"
                  className="font-hebrew"
                >
                  {isCartoonified ? "הצג תמונה מקורית" : "הפוך לקריקטורה"}
                </Button>
              )}
              <Button onClick={triggerFileInput} variant="outline" size="sm" className="font-hebrew">
                החלף תמונה
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 font-hebrew"
                onClick={() => {
                  setPreviewUrl(null);
                  setOriginalFile(null);
                  setIsCartoonified(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                הסר
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-accent"
              >
                <path 
                  d="M9 10C9 11.1046 8.10457 12 7 12C5.89543 12 5 11.1046 5 10C5 8.89543 5.89543 8 7 8C8.10457 8 9 8.89543 9 10Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M4 3C2.34315 3 1 4.34315 1 6V18C1 19.6569 2.34315 21 4 21H20C21.6569 21 23 19.6569 23 18V6C23 4.34315 21.6569 3 20 3H4ZM20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M4 19H20C20.5523 19 21 18.5523 21 18V15L17.5 11.5L13.5 15.5L8.5 10.5L3 16V18C3 18.5523 3.44772 19 4 19Z" 
                  fill="currentColor" 
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-foreground font-hebrew">גרור ושחרר תמונה כאן</p>
              <p className="text-muted-foreground mt-1 font-hebrew">או לחץ לבחירת קובץ</p>
              {enableCartoonify && (
                <p className="text-sm text-accent mt-2 font-hebrew">אפשרות להפוך לקריקטורה זמינה!</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-hebrew">
              PNG, JPG או GIF (מקסימום 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
