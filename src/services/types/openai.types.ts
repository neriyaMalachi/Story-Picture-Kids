
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "function";
  content: string;
  name?: string;
}

export interface StoryGenerationResult {
  success: boolean;
  content: string;
  error?: string;
}

// Alias OpenAIResponse to StoryGenerationResult for compatibility
export type OpenAIResponse = StoryGenerationResult;

// Define StoryGenerationParams for the generateStory method
export interface StoryGenerationParams {
  childName: string;
  theme: string;
  imageUrl: string;
}

export interface PreGeneratedStory {
  id: string;
  theme: string;
  content: string;
  pdfUrl?: string;
  imageUrl: string;
  images?: string[];
}
