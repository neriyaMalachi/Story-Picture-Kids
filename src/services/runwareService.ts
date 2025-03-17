export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: "compel" | "sdEmbeds" | "none";
  seed?: number | null;
  lora?: string[];
  style?: string;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

class RunwareService {
  private apiKey: string;
  private apiEndpoint = "https://api.runware.ai/v1";
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    try {
      const taskUUID = crypto.randomUUID();
      
      const requestBody = [
        {
          taskType: "authentication",
          apiKey: this.apiKey
        },
        {
          taskType: "imageInference",
          taskUUID,
          positivePrompt: params.positivePrompt,
          model: params.model || "runware:100@1",
          width: 1024,
          height: 1024,
          numberResults: params.numberResults || 1,
          outputFormat: params.outputFormat || "WEBP",
          CFGScale: params.CFGScale || 1,
          scheduler: params.scheduler || "FlowMatchEulerDiscreteScheduler",
          strength: params.strength || 0.8,
          promptWeighting: params.promptWeighting || "none",
          seed: params.seed || "",
          lora: params.lora || [],
          style: params.style || "Disney Character"
        }
      ];
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check for errors in response
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message || 'Error generating image');
      }
      
      // Find the image generation task in the response
      const imageTask = data.data.find((item: any) => 
        item.taskType === "imageInference" && item.taskUUID === taskUUID
      );
      
      if (!imageTask) {
        throw new Error('Image generation task not found in response');
      }
      
      return {
        imageURL: imageTask.imageURL,
        positivePrompt: imageTask.positivePrompt,
        seed: imageTask.seed,
        NSFWContent: imageTask.NSFWContent || false
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
  
  async generateMultipleImages(params: GenerateImageParams, count: number = 2): Promise<GeneratedImage[]> {
    try {
      // For the demo version, we'll generate the same prompt with different seeds
      const results: GeneratedImage[] = [];
      
      // Generate the first image
      const firstImage = await this.generateImage(params);
      results.push(firstImage);
      
      // Generate the second image with a different seed
      const secondParams = { ...params };
      // Use a different seed for variation
      secondParams.seed = Math.floor(Math.random() * 1000000000);
      
      try {
        const secondImage = await this.generateImage(secondParams);
        results.push(secondImage);
      } catch (error) {
        // If second image fails, duplicate the first one for demo purposes
        console.error("Failed to generate second image, using first image as fallback");
        results.push({...firstImage, seed: (firstImage.seed || 0) + 1});
      }
      
      return results;
    } catch (error) {
      console.error('Error generating multiple images:', error);
      throw error;
    }
  }

  async cartoonifyImage(imageFile: File): Promise<string> {
    try {
      // Convert the image file to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Create a task UUID for this request
      const taskUUID = crypto.randomUUID();
      
      const requestBody = [
        {
          taskType: "authentication",
          apiKey: this.apiKey
        },
        {
          taskType: "imageTransformation",
          taskUUID,
          inputImage: base64Image,
          transformationType: "cartoonify",
          model: "runware:cartoon@1",
          outputFormat: "WEBP",
          strength: 0.85  // Adjust the cartoon effect strength
        }
      ];
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check for errors in response
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message || 'Error cartoonifying image');
      }
      
      // Find the transformation task in the response
      const transformTask = data.data.find((item: any) => 
        item.taskType === "imageTransformation" && item.taskUUID === taskUUID
      );
      
      if (!transformTask) {
        throw new Error('Image transformation task not found in response');
      }
      
      return transformTask.outputImageURL;
    } catch (error) {
      console.error('Error cartoonifying image:', error);
      throw error;
    }
  }

  // Helper method to convert File to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }
}

// יצירת instance יחיד של השירות
const runwareService = new RunwareService(
  // מפתח API זמני - מומלץ להשתמש בסביבת Supabase לשמירת מפתחות API
  "TEMP_API_KEY"
);

export default runwareService;
