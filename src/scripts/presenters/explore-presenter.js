import apiService from "../data/api-service.js";

class ExplorePresenter {
  constructor(view) {
    this.view = view;
    this.apiService = apiService;
    this.stories = [];
    this.page = 1;
    this.size = 12;
    this.hasMoreStories = true;
  }

  async loadInitialStories() {
    try {
      this.view.showLoading();
      const response = await this.apiService.getAllStories({
        page: this.page,
        size: this.size,
        location: 1,
      });

      this.stories = response.listStory || [];
      this.hasMoreStories = this.stories.length === this.size;

      this.view.displayStories(this.stories);
      
      if (this.stories.length === 0) {
        this.view.showNoContent("Belum ada cerita yang tersedia.");
      }
      
      if (this.hasMoreStories) {
        this.view.showLoadMoreButton();
      }
    } catch (error) {
      this.view.showError(`Gagal memuat cerita: ${error.message}`);
    }
  }

  async loadMoreStories() {
    try {
      this.page += 1;
      const response = await this.apiService.getAllStories({
        page: this.page,
        size: this.size,
        location: 1,
      });

      const newStories = response.listStory || [];
      this.stories = [...this.stories, ...newStories];
      this.hasMoreStories = newStories.length === this.size;

      this.view.displayStories(this.stories);
      
      if (!this.hasMoreStories) {
        this.view.hideLoadMoreButton();
      }
      
      return true;
    } catch (error) {
      this.view.showErrorMessage(`Gagal memuat cerita: ${error.message}`);
      return false;
    }
  }

  handleSearch(searchTerm) {
    const filteredStoryIds = this.stories
      .filter(story => 
        story.name.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm)
      )
      .map(story => story.id);
    
    this.view.filterStoriesByIds(filteredStoryIds);
  }

  handleSort(sortType) {
    let sortedStories = [...this.stories];
    
    if (sortType === "newest") {
      sortedStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      sortedStories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    this.view.displayStories(sortedStories);
  }
}

export default ExplorePresenter;