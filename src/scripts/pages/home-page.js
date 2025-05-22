import BasePage from "./base-page.js";
import UIHelper from "../utils/ui-helper.js";
import { navigateTo } from "../routes/routes.js";
import HomePresenter from "../presenters/home-presenter.js";
import { isLoggedIn } from "../utils/auth-helper.js";

class HomeView extends BasePage {
  constructor(options) {
    super(options);
    this.setTitle("Beranda");
    this.presenter = new HomePresenter(this);
  }

  showLoading() {
    this.loadingElement = document.createElement("div");
    this.loadingElement.className = "loading-indicator";
    this.loadingElement.textContent = "Memuat...";
    this.container.appendChild(this.loadingElement);
  }

  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.remove();
    }
  }

  async render() {
    this.clearContainer();
    this.showLoading();
  
    const pageContainer = this.createPageContainer("home-page");
    
    const heroSection = this.createHeroSection();
    pageContainer.appendChild(heroSection);
    
    const storiesSection = this.createStoriesSection();
    pageContainer.appendChild(storiesSection);
    
    this.container.appendChild(pageContainer);
  
    try {
      await this.presenter.loadStories();
      this.addEventListeners();
      this.hideLoading();
    } catch (error) {
      this.hideLoading();
      this.showError(`Gagal memuat cerita: ${error.message}`);
    }
  }
  
  /**
   * Menampilkan data cerita yang diterima dari presenter
   * @param {Array} stories - Array of story objects
   */
  displayStories(stories) {
    const storiesSection = document.querySelector('.stories-section');
    
    if (storiesSection) {
      if (stories.length > 0) {
        const storiesContainer = document.createElement("div");
        storiesContainer.className = "stories-container";
        storiesSection.appendChild(storiesContainer);
        
        UIHelper.renderStoryGrid(stories, storiesContainer);
      } else {
        const noContent = document.createElement("div");
        noContent.className = "no-content";
        noContent.innerHTML = "<p>Belum ada cerita yang dibagikan.</p>";
        storiesSection.appendChild(noContent);
      }
    }
  }

  createHeroSection() {
    const heroSection = document.createElement("section");
    heroSection.className = "hero-section";

    heroSection.innerHTML = `
      <div class="hero-content">
        <h2 class="hero-title">Selamat Datang di Dicoding Story</h2>
        <p class="hero-description">
          Platform berbagi cerita untuk menyelesaikan submission Belajar Pengembangan Web Intermediate
        </p>
        <div class="hero-buttons">
          <a href="#/add" class="btn btn-primary">Bagikan Cerita</a>
          <a href="#/explore" class="btn btn-secondary">Jelajahi Cerita</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="./public/hero-image.png" alt="Ilustrasi Berbagi Cerita" class="hero-illustration">
      </div>
    `;

    return heroSection;
  }

  createStoriesSection() {
    const storiesSection = document.createElement("section");
    storiesSection.className = "stories-section";

    const sectionHeader = document.createElement("div");
    sectionHeader.className = "section-header";

    sectionHeader.innerHTML = `
      <h2 class="section-title">Cerita Terbaru</h2>
      <a href="#/explore" class="section-link">Lihat Semua</a>
    `;

    storiesSection.appendChild(sectionHeader);

    return storiesSection;
  }

  addEventListeners() {
    if (!isLoggedIn()) {
      const shareStoryBtn = document.querySelector(
        ".hero-buttons .btn-primary"
      );

      if (shareStoryBtn) {
        shareStoryBtn.addEventListener("click", (event) => {
          event.preventDefault();
          navigateTo("/login");
        });
      }
    }
  }
}

export default HomeView;