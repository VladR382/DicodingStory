import BasePage from "./base-page.js";
import DetailPresenter from "../presenters/detail-presenter.js";
import UIHelper from "../utils/ui-helper.js";
import mapHelper from "../utils/map-helper.js";
import { isLoggedIn } from "../utils/auth-helper.js";
import { navigateTo } from "../routes/routes.js";

class DetailPage extends BasePage {
  constructor(options) {
    super(options);
    this.storyId = options.params.id;
    this.story = null; 
    this.presenter = new DetailPresenter({
      view: this,
      storyId: this.storyId
    });
  }

  showAlert(message, type) {
    UIHelper.showAlert(message, type, this.container, 3000);
  }

  async render() {
    if (!isLoggedIn()) {
      navigateTo("/login");
      return;
    }

    this.clearContainer();
    this.showLoading();
    
    await this.presenter.init();
  }
  renderStory(story) {
    this.story = story;
    
    if (!this.story || !this.story.name) {
      this.showError("Data cerita tidak valid");
      return;
    }
    
    this.setTitle(`Cerita dari ${this.story.name}`);
    this.clearContainer();

    const pageContainer = this.createPageContainer("detail-page");
    const storyDetail = this.createStoryDetail();
    
    pageContainer.appendChild(storyDetail);
    this.container.appendChild(pageContainer);

    const backLink = storyDetail.querySelector(".back-link");
    if (backLink) {
      backLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("/");
      });
    }

    this.addEventListeners();
    this.addStyles();
  }

  renderMap(lat, lon, name, description) {
    mapHelper.initMap("story-map-container", {
      center: [lat, lon],
      zoom: 15,
      showLayerControl: true,
    });

    mapHelper.addMarker(lat, lon, {
      title: name,
      description: UIHelper.truncateText(description, 100),
    });
  }

  createStoryDetail() {
    if (!this.story) {
      return document.createElement('div');
    }

    const storyDetail = document.createElement("article");
    storyDetail.className = "story-detail";

    const formattedDate = UIHelper.formatDate(this.story.createdAt);
    const hasLocation = this.story.lat && this.story.lon;

    storyDetail.innerHTML = `
      <div class="story-header">
        <a href="#/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </a>
        <h2 class="story-title">Cerita dari ${this.story.name}</h2>
                <button id="save-story" class="btn-futuristic btn-save-story">
                    <i class="fa-solid fa-bookmark"></i> Simpan Cerita
                </button>
      </div>
      
      <div class="story-meta">
        <span class="story-date">
          <i class="fa-regular fa-calendar"></i> ${formattedDate}
        </span>
        ${
          hasLocation
            ? `
          <span class="story-location">
            <i class="fa-solid fa-location-dot"></i> Memiliki Lokasi
          </span>
        `
            : ""
        }
      </div>
      
      <div class="story-content">
        <img src="${this.story.photoUrl}" alt="Foto cerita dari ${
      this.story.name
    }" class="story-image">
        
        <p class="story-description">${this.story.description}</p>
      </div>
      
      ${
        hasLocation
          ? `
        <div class="story-map-section">
          <div class="section-header-futuristic">
            <h3 class="section-title-futuristic">Lokasi</h3>
            <div class="section-line"></div>
          </div>
          
          <div class="location-futuristic-card">
            <div class="location-futuristic-header">
              <div class="location-icon-container">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <h4 class="location-futuristic-title">Koordinat Titik Lokasi</h4>
            </div>
            
            <div class="location-coordinates-container">
              <div class="coordinate-item">
                <div class="coordinate-label">Latitude</div>
                <div class="coordinate-value">${this.story.lat.toFixed(6)}</div>
              </div>
              <div class="coordinate-item">
                <div class="coordinate-label">Longitude</div>
                <div class="coordinate-value">${this.story.lon.toFixed(6)}</div>
              </div>
            </div>
            
            <div class="location-info-visual">
              <div class="pulse-effect"></div>
              <i class="fa-solid fa-satellite-dish"></i>
              <span class="signal-text">Sinyal GPS Terdeteksi</span>
            </div>
          </div>
          
          <div id="story-map-container" class="map-container-futuristic"></div>
        </div>
      `
          : ""
      }
      
      <div class="story-share-section">
            <div class="section-header-futuristic">
                <h3 class="section-title-futuristic">Bagikan</h3>
                <div class="section-line"></div>
            </div>
            <div class="share-buttons-futuristic">
                <button id="share-whatsapp" class="btn-futuristic btn-share">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
                <button id="share-facebook" class="btn-futuristic btn-share">
                    <i class="fa-brands fa-facebook"></i> Facebook
                </button>
                <button id="share-copy" class="btn-futuristic btn-share">
                    <i class="fa-solid fa-copy"></i> Salin Tautan
                </button>

            </div>
        </div>
    `;

    return storyDetail;
  }

  addStyles() {
    if (!document.getElementById("futuristic-detail-styles")) {
        const styleEl = document.createElement("style");
        styleEl.id = "futuristic-detail-styles";
        styleEl.textContent = `
          .section-header-futuristic {
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            position: relative;
          }
          
          .section-title-futuristic {
            font-size: 2.2rem;
            font-weight: 600;
            color: #2563eb;
            margin-right: 1.5rem;
            position: relative;
            z-index: 1;
          }
          
          .section-line {
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, #2563eb, rgba(37, 99, 235, 0.1));
            position: relative;
          }
          
          .section-line::after {
            content: '';
            position: absolute;
            right: 0;
            top: -3px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #2563eb;
          }
          
          .location-futuristic-card {
            background: linear-gradient(135deg, #ffffff, #f1f5f9);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05),
                        0 8px 10px -6px rgba(0, 0, 0, 0.01);
            position: relative;
            overflow: hidden;
          }
          
          .location-futuristic-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
            z-index: 0;
          }
          
          .location-futuristic-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
            z-index: 1;
            position: relative;
          }
          
          .location-icon-container {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
          }
          
          .location-icon-container i {
            font-size: 1.8rem;
            color: white;
          }
          
          .location-futuristic-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
          }
          
          .location-coordinates-container {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            z-index: 1;
            position: relative;
          }
          
          .coordinate-item {
            flex: 1;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            padding: 1.2rem;
            border: 1px solid rgba(37, 99, 235, 0.1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
            backdrop-filter: blur(5px);
          }
          
          .coordinate-label {
            font-size: 1.4rem;
            color: #64748b;
            margin-bottom: 0.8rem;
          }
          
          .coordinate-value {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1e293b;
            font-family: 'Consolas', monospace;
            text-shadow: 0 0 2px rgba(37, 99, 235, 0.1);
          }
          
          .location-info-visual {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: rgba(243, 244, 246, 0.7);
            border-radius: 8px;
            margin-top: 1rem;
            position: relative;
            z-index: 1;
          }
          
          .pulse-effect {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.2);
            position: relative;
            margin-right: 1.5rem;
          }
          
          .pulse-effect::before,
          .pulse-effect::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.4);
            animation: pulse 2s infinite;
            z-index: -1;
          }
          
          .pulse-effect::after {
            animation-delay: 0.5s;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.7;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
          
          .signal-text {
            color: #0f766e;
            font-size: 1.4rem;
            font-weight: 500;
            margin-left: 0.8rem;
          }
          
          .location-info-visual i {
            color: #0f766e;
            font-size: 1.6rem;
          }
          
          .map-container-futuristic {
            height: 350px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(37, 99, 235, 0.1);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05),
                        0 4px 6px -2px rgba(0, 0, 0, 0.01);
            position: relative;
          }
          
          .map-container-futuristic::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-radius: 12px;
            background: linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa, #93c5fd) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
            pointer-events: none;
            z-index: 10;
          }
          
          .share-buttons-futuristic {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          
          .btn-futuristic {
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .btn-share {
            background: linear-gradient(135deg, #f1f5f9, #ffffff);
            color: #1e293b;
            border: 1px solid rgba(37, 99, 235, 0.1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          
          .btn-share:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #ffffff, #f8fafc);
          }
          
          .btn-share:active {
            transform: translateY(0);
          }

          .btn-save-story {
            background-color: #4CAF50; /* Green */
            color: white;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 1em;
            transition: background-color 0.3s;
          }

          .btn-save-story.saved {
            background-color: #f44336; 
            color: white;
          }

          .btn-save-story:hover {
            background-color:rgb(69, 21, 227); 
          }
          
          @media (max-width: 768px) {
            .location-coordinates-container {
              flex-direction: column;
              gap: 1rem;
            }
          }
        `;
        document.head.appendChild(styleEl);
      }
  }
  
  addEventListeners() {
        super.addEventListeners(); 

const saveStoryButton = document.getElementById('save-story');
    if (saveStoryButton) {
        saveStoryButton.addEventListener('click', () => {
            if (saveStoryButton.classList.contains('saved')) {
                this.presenter.removeStory(); 
            } else {
                this.presenter.saveStory();  
            }
        });
    }

    const shareButtons = [
      { 
        id: "share-whatsapp", 
        url: (url, name) => `https://api.whatsapp.com/send?text=Lihat cerita dari ${name} di Dicoding Story: ${url}`
      },
      { 
        id: "share-facebook", 
        url: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`
      },
      { 
        id: "share-copy", 
        action: "copy" 
      }
    ];

    shareButtons.forEach(({ id, url, action }) => {
      const button = document.getElementById(id);
      if (!button) return;

      button.addEventListener("click", () => {
        const currentUrl = encodeURIComponent(window.location.href);
        const name = this.story?.name || "Pengguna";

        if (action === "copy") {
          this.handleCopyUrl(button);
        } else {
          const shareUrl = typeof url === 'function' 
            ? url(currentUrl, name)
            : url;
          window.open(shareUrl, "_blank");
        }
      });
    });
  }
  
  showCopySuccess(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i> Disalin!';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  }
  
  showCopyError() {
    UIHelper.showAlert("Gagal menyalin tautan", "error");
  }
}

export default DetailPage;