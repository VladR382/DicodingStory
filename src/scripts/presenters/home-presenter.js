import apiService from "../data/api-service.js";

class HomePresenter {
    constructor(view) {
      this.view = view;
      this.stories = [];
    }
  
    /**
     * Memuat data cerita dari API
     * @returns {Promise} Promise yang diselesaikan ketika data berhasil dimuat
     */
    async loadStories() {
      try {
        if (!apiService || typeof apiService.getAllStories !== 'function') {
          console.error('API Service tidak tersedia atau getAllStories bukan fungsi', apiService);
          throw new Error('API Service tidak tersedia');
        }
        
        const response = await apiService.getAllStories({
          size: 10,
          location: 1,
        });
  
        this.stories = response.listStory || [];
        
        this.view.displayStories(this.stories);
        
        return this.stories;
      } catch (error) {
        console.error("Error loading stories:", error);
        throw error;
      }
    }
  }
  
  export default HomePresenter;