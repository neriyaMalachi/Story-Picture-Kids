
/**
 * Manages API keys for external services
 */

class ApiKeyManager {
  private apiKey: string | null = null;
  private readonly demoApiKey: string = "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";
  private readonly storageKey: string = 'openai_api_key';

  /**
   * Sets the API key and stores it in localStorage
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem(this.storageKey, key);
  }
  
  /**
   * Gets the API key from memory or localStorage, falling back to demo key
   */
  getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem(this.storageKey);
    }
    return this.apiKey || this.demoApiKey;
  }
}

export default new ApiKeyManager();
