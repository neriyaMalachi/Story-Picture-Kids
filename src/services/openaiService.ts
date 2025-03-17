
import { OpenAIResponse, StoryGenerationParams, StoryGenerationResult } from './types/openai.types';
import { getStoryByTheme } from './stories/demoStories';
import apiKeyManager from './auth/apiKeyManager';
import { initializePreGeneratedStories, getPreGeneratedStoryByTheme } from './stories/preGeneratedStories';

/**
 * Service for interacting with OpenAI API
 */
class OpenAIService {
  private initialized = false;

  constructor() {
    // Initialize pre-generated stories when the service is created
    this.initPreGeneratedStories();
  }

  /**
   * Initializes pre-generated stories
   */
  async initPreGeneratedStories(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      console.log('OpenAIService: Starting pre-generated stories initialization');
      await initializePreGeneratedStories();
      this.initialized = true;
      console.log('OpenAIService: Finished pre-generated stories initialization');
    } catch (error) {
      console.error('OpenAIService: Failed to initialize pre-generated stories:', error);
    }
  }

  /**
   * Sets the OpenAI API key
   */
  setApiKey(key: string): void {
    apiKeyManager.setApiKey(key);
  }
  
  /**
   * Gets the current OpenAI API key
   */
  getApiKey(): string | null {
    return apiKeyManager.getApiKey();
  }
  
  /**
   * Generates a story based on the child's name, theme, and image
   */
  async generateStory(childName: string, theme: string, imageUrl: string): Promise<StoryGenerationResult> {
    // Make sure pre-generated stories are initialized
    if (!this.initialized) {
      await this.initPreGeneratedStories();
    }
    
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return {
        content: '',
        success: false,
        error: 'API key not found. Please set your OpenAI API key.'
      };
    }
    
    try {
      // For demo purposes, we'll use a simulation instead of actually calling the API
      console.log('Generating story with OpenAI for:', childName, 'theme:', theme);
      
      // Check if this is a demo story request
      const isDemoRequest = !childName || childName === 'ילד' || childName === 'הילד';
      
      if (isDemoRequest) {
        // Try to get a pre-generated story for this theme
        const preGenerated = getPreGeneratedStoryByTheme(theme);
        
        if (preGenerated) {
          console.log('Using pre-generated story for theme:', theme);
          
          // Replace the default name with the provided name if different
          let content = preGenerated.content;
          if (childName && childName !== 'ילד' && childName !== 'הילד') {
            content = content.replace(/ילד/g, childName);
          }
          
          return {
            content,
            success: true
          };
        }
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a story based on the theme
      const story = getStoryByTheme(childName, theme);
      
      return {
        content: story,
        success: true
      };
    } catch (error) {
      console.error('Error generating story with OpenAI:', error);
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default new OpenAIService();
