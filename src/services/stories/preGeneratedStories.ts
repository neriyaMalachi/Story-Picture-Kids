
import { PreGeneratedStory } from '../types/openai.types';
import { createSpaceStory, createOceanStory, createAdventureStory } from './demoStories';
import pdfService from '../pdfService';

// Default child name for pre-generated stories
const DEFAULT_CHILD_NAME = 'ילד';

// Cache for pre-generated PDFs
let preGeneratedCache: Record<string, PreGeneratedStory> = {};
let isInitializing = false;

/**
 * Generates all demo PDFs in advance
 */
export const initializePreGeneratedStories = async (): Promise<void> => {
  if (Object.keys(preGeneratedCache).length > 0 || isInitializing) {
    console.log('Pre-generated stories already initialized or initializing');
    return; // Already initialized or initializing
  }
  
  console.log('Initializing pre-generated stories...');
  isInitializing = true;
  
  // Define themes and their associated images - animated child-friendly images
  const themesToGenerate = [
    { 
      id: 'space-demo', 
      theme: 'space', 
      imageUrl: 'https://img.freepik.com/premium-vector/cute-astronaut-waving-hand-cartoon-icon-illustration_138676-2722.jpg',
      images: [
        "https://img.freepik.com/premium-vector/cute-astronaut-waving-hand-cartoon-icon-illustration_138676-2722.jpg",
        "https://img.freepik.com/premium-vector/cute-astronaut-riding-rocket-cartoon-vector-icon-illustration_138676-3471.jpg",
        "https://img.freepik.com/premium-vector/astronaut-flying-with-flag-cartoon-vector-icon-illustration_138676-5201.jpg",
        "https://img.freepik.com/premium-vector/cute-astronaut-riding-planet-cartoon-vector-icon-illustration_138676-5743.jpg",
        "https://img.freepik.com/premium-vector/astronaut-sitting-planet-cartoon-vector-icon-illustration_138676-5736.jpg",
        "https://img.freepik.com/premium-vector/cute-astronaut-holding-star-cartoon-icon-illustration_138676-2498.jpg"
      ]
    },
    { 
      id: 'ocean-demo', 
      theme: 'ocean', 
      imageUrl: 'https://img.freepik.com/premium-vector/cute-kids-swimming-sea-cartoon-vector-icon-illustration_138676-5182.jpg',
      images: [
        "https://img.freepik.com/premium-vector/cute-kids-swimming-sea-cartoon-vector-icon-illustration_138676-5182.jpg",
        "https://img.freepik.com/premium-vector/cute-child-diving-ocean-cartoon-vector-icon-illustration_138676-2822.jpg",
        "https://img.freepik.com/premium-vector/cute-kid-swimming-sea-cartoon-vector-icon-illustration_138676-5177.jpg",
        "https://img.freepik.com/premium-vector/cute-kid-playing-beach-cartoon-vector-icon-illustration_138676-6349.jpg",
        "https://img.freepik.com/premium-vector/cute-children-play-sea-beach-cartoon-icon-illustration_138676-808.jpg",
        "https://img.freepik.com/premium-vector/cute-child-building-sand-castle-beach-cartoon-vector-icon-illustration_138676-2782.jpg"
      ]
    },
    { 
      id: 'adventure-demo', 
      theme: 'adventure', 
      imageUrl: 'https://img.freepik.com/premium-vector/cute-little-boy-hiking-cartoon-vector-icon-illustration_138676-5635.jpg',
      images: [
        "https://img.freepik.com/premium-vector/cute-little-boy-hiking-cartoon-vector-icon-illustration_138676-5635.jpg",
        "https://img.freepik.com/premium-vector/cute-boy-with-backpack-hiking-cartoon-vector-icon-illustration_138676-5644.jpg",
        "https://img.freepik.com/premium-vector/cute-child-explorer-cartoon-vector-icon-illustration_138676-5677.jpg",
        "https://img.freepik.com/premium-vector/cute-little-boy-camping-cartoon-vector-icon-illustration_138676-5532.jpg",
        "https://img.freepik.com/premium-vector/camping-kids-cartoon-vector-icon-illustration_138676-5525.jpg",
        "https://img.freepik.com/premium-vector/cute-kids-walking-garden-cartoon-vector-icon-illustration_138676-5168.jpg"
      ]
    }
  ];
  
  // Generate stories for each theme
  for (const { id, theme, imageUrl, images } of themesToGenerate) {
    try {
      console.log(`Generating pre-generated story for theme: ${theme}`);
      
      // Get story content based on theme
      let content = '';
      switch (theme) {
        case 'space':
          content = createSpaceStory(DEFAULT_CHILD_NAME);
          break;
        case 'ocean':
          content = createOceanStory(DEFAULT_CHILD_NAME);
          break;
        default:
          content = createAdventureStory(DEFAULT_CHILD_NAME);
      }
      
      // Create title for the PDF
      const title = `${DEFAULT_CHILD_NAME} והרפתקה ב${
        theme === "space" ? "חלל" : 
        theme === "ocean" ? "ים" : 
        "הרפתקה מיוחדת"
      }`;
      
      console.log(`Starting PDF generation for theme: ${theme}, title: ${title}`);
      
      // Generate PDF - we'll still try to generate it but won't rely on it for displaying
      let pdfUrl = "";
      try {
        pdfUrl = await pdfService.generateStoryPDF(title, content, imageUrl);
        console.log(`Successfully generated PDF for theme ${theme}, URL length: ${pdfUrl.length}`);
      } catch (pdfError) {
        console.error(`Error generating PDF for theme ${theme}:`, pdfError);
        // Continue without PDF, we'll use images instead
      }
      
      // Store in cache
      preGeneratedCache[id] = {
        id,
        theme,
        content,
        pdfUrl,
        imageUrl,
        images
      };
      console.log(`Pre-generated story for theme: ${theme} cached successfully`);
      
    } catch (error) {
      console.error(`Failed to pre-generate story for theme ${theme}:`, error);
    }
  }
  
  isInitializing = false;
  console.log('Finished initializing pre-generated stories', Object.keys(preGeneratedCache));
};

/**
 * Gets a pre-generated story by ID
 */
export const getPreGeneratedStory = (id: string): PreGeneratedStory | null => {
  return preGeneratedCache[id] || null;
};

/**
 * Gets a pre-generated story by theme
 */
export const getPreGeneratedStoryByTheme = (theme: string): PreGeneratedStory | null => {
  const id = `${theme}-demo`;
  const story = preGeneratedCache[id];
  console.log(`Getting pre-generated story for theme ${theme}, found:`, story ? 'yes' : 'no');
  return story || null;
};

/**
 * Gets all pre-generated stories
 */
export const getAllPreGeneratedStories = (): PreGeneratedStory[] => {
  return Object.values(preGeneratedCache);
};
