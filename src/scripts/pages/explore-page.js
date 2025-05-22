import BasePage from "./base-page.js";
import UIHelper from "../utils/ui-helper.js";
import ExplorePresenter from "../presenters/explore-presenter.js";

class ExplorePage extends BasePage {
  constructor(options) {
    super(options);
    this.setTitle("Jelajahi Cerita");
    this.presenter = new ExplorePresenter(this);
  }

  async render() {
    this.clearContainer();
    const pageContainer = this.createPageContainer("explore-page");
    
    const pageHeader = this.createPageHeader(
      "Jelajahi Semua Cerita",
      "Temukan cerita menarik dari komunitas Dicoding"
    );
    pageContainer.appendChild(pageHeader);

    const filterSection = this.createFilterSection();
    pageContainer.appendChild(filterSection);

    const storiesContainer = document.createElement("div");
    storiesContainer.id = "stories-container";
    storiesContainer.className = "stories-container";
    pageContainer.appendChild(storiesContainer);

    const loadMoreContainer = document.createElement("div");
    loadMoreContainer.id = "load-more-container";
    loadMoreContainer.className = "load-more-container";
    loadMoreContainer.style.display = "none";
    pageContainer.appendChild(loadMoreContainer);

    this.container.appendChild(pageContainer);
    this.addEventListeners();
    
    await this.presenter.loadInitialStories();
  }

  createFilterSection() {
    const filterSection = document.createElement("div");
    filterSection.className = "filter-section";

    filterSection.innerHTML = `
    <div class="search-container">
      <input 
        type="text" 
        id="search-input" 
        class="search-input" 
        placeholder="Cari cerita..."
        aria-label="Cari cerita"
      >
      <button id="search-button" class="search-button" aria-label="Tombol cari">
        <i class="fa-solid fa-search"></i>
      </button>
    </div>
    
    <div class="filter-options">
      <select id="sort-select" class="filter-select" aria-label="Urutkan cerita">
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>
    `;

    const sortSelect = filterSection.querySelector("#sort-select");

    sortSelect.style.appearance = "none";
    sortSelect.style.width = "100%";
    sortSelect.style.padding = "10px 16px";
    sortSelect.style.fontSize = "14px";
    sortSelect.style.border = "1px solid #e0e0e0";
    sortSelect.style.borderRadius = "8px";
    sortSelect.style.backgroundColor = "#fff";
    sortSelect.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 12 12\"><path fill=\"%23888\" d=\"M6 9L1 4h10z\"/></svg>')";
    sortSelect.style.backgroundRepeat = "no-repeat";
    sortSelect.style.backgroundPosition = "right 12px center";
    sortSelect.style.backgroundSize = "10px";
    sortSelect.style.color = "#333";
    sortSelect.style.cursor = "pointer";
    sortSelect.style.outline = "none";
    sortSelect.style.transition = "all 0.3s ease";

    return filterSection;
  }

  createLoadMoreButton() {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.id = "load-more-button";
    loadMoreBtn.className = "btn btn-secondary";
    loadMoreBtn.textContent = "Muat Lebih Banyak";
    
    return loadMoreBtn;
  }

  showLoading() {
    const storiesContainer = document.getElementById("stories-container");
    if (storiesContainer) {
      storiesContainer.innerHTML = `
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
          <p>Memuat data...</p>
        </div>
      `;
    }
  }

  displayStories(stories) {
    const storiesContainer = document.getElementById("stories-container");
    if (storiesContainer) {
      UIHelper.renderStoryGrid(stories, storiesContainer);
    }
  }

  showLoadMoreButton() {
    const loadMoreContainer = document.getElementById("load-more-container");
    if (loadMoreContainer) {
      loadMoreContainer.innerHTML = '';
      loadMoreContainer.appendChild(this.createLoadMoreButton());
      loadMoreContainer.style.display = "flex";
    }
  }

  hideLoadMoreButton() {
    const loadMoreContainer = document.getElementById("load-more-container");
    if (loadMoreContainer) {
      loadMoreContainer.style.display = "none";
    }
  }

  showErrorMessage(message) {
    UIHelper.showAlert(
      message,
      "error",
      document.getElementById("explore-page")
    );
  }

  filterStoriesByIds(storyIds) {
    const storiesContainer = document.getElementById("stories-container");
    if (storiesContainer) {
      const storyCards = storiesContainer.querySelectorAll(".card");
      
      storyCards.forEach((card) => {
        const storyId = card.getAttribute("data-story-id");
        if (storyIds.includes(storyId)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    }
  }

  addEventListeners() {
    document.addEventListener('click', (event) => {
      if (event.target && event.target.id === 'load-more-button') {
        const loadMoreBtn = event.target;
        const hideLoading = UIHelper.showButtonLoading(loadMoreBtn, "Memuat...");
        
        this.presenter.loadMoreStories()
          .finally(() => {
            hideLoading();
          });
      }
    });

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    if (searchInput && searchButton) {
      const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        this.presenter.handleSearch(searchTerm);
      };

      searchButton.addEventListener("click", handleSearch);
      searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          handleSearch();
        }
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        const sortValue = sortSelect.value;
        this.presenter.handleSort(sortValue);
      });
    }
  }
}

export default ExplorePage;