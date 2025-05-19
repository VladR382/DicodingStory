import BasePage from "./base-page.js"
import mapHelper from "../utils/map-helper.js";
import MapPresenter from "../presenters/map-page-presenter.js";
import UIHelper from "../utils/ui-helper.js";

class MapPage extends BasePage {
  constructor(options) {
    super(options);
    this.setTitle("Map Cerita");
    this.presenter = new MapPresenter(this);
  }

  async render() {
    this.clearContainer();
    this.showLoading();
    
    const pageContainer = this.createPageContainer("map-page");
    this.container.appendChild(pageContainer);
    
    await this.presenter.loadStories();
  }

  showStories(stories) {
    this.clearContainer();
    
    const pageContainer = this.createPageContainer("map-page");
    const pageHeader = this.createPageHeader(
      "Map Cerita",
      "Lihat lokasi cerita dari pengguna Dicoding Story"
    );
    
    const mapContent = this.createMapContent();
    
    pageContainer.append(pageHeader, mapContent);
    this.container.appendChild(pageContainer);
    
    this.initializeMap(stories);
    this.addEventListeners();
  }

  showError(message) {
    this.clearContainer();
    super.showError(message);
  }

  createMapContent() {
    const mapContent = document.createElement("section");
    mapContent.className = "map-content";

    mapContent.innerHTML = `
      <div class="map-controls">
        <div class="map-search">
          <input 
            type="text" 
            id="map-search-input" 
            class="search-input" 
            placeholder="Cari cerita pada peta..."
            aria-label="Cari cerita pada peta"
          >
        </div>
        <div class="map-filters">
          <select id="map-filter-select" class="filter-select" aria-label="Filter cerita pada peta">
            <option value="all">Semua Cerita</option>
            <option value="recent">Cerita Terbaru</option>
          </select>
        </div>
      </div>
      
      <div id="full-map-container" class="map-container map-full"></div>
      
      <div class="story-preview" id="story-preview">
        <p class="story-preview-hint">Klik pada marker untuk melihat detail cerita</p>
      </div>
    `;

    return mapContent;
  }

  initializeMap(stories) {
    mapHelper.initMap("full-map-container", {
      center: [-2.548926, 118.0148634],
      zoom: 5,
      showLayerControl: true
    });
    
    if (stories.length > 0) {
      this.addStoryMarkers(stories);
    } else {
      const storyPreview = document.getElementById("story-preview");
      storyPreview.innerHTML = `
        <div class="no-content">
          <p>Belum ada cerita dengan lokasi</p>
        </div>
      `;
    }

    this.addEventListeners();
  }

  addStoryMarkers(stories) {
    mapHelper.clearMarkers();

    console.log("Stories to add markers:", stories);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = mapHelper.addMarker(story.lat, story.lon, {
          title: story.name,
          description: UIHelper.truncateText(story.description, 100),
        });

        marker.on("click", () => {
          this.showStoryPreview(story);
        });
      }
    });

    const markersGroup = L.featureGroup(mapHelper.markers);
    if (mapHelper.markers.length > 0) {
      mapHelper.map.fitBounds(markersGroup.getBounds(), { padding: [30, 30] });
    }
  }

  showStoryPreview(story) {
    const storyPreview = document.getElementById("story-preview");

    storyPreview.innerHTML = `
      <div class="story-preview-card">
        <div class="preview-header">
          <h3 class="preview-title">${story.name}</h3>
          <span class="preview-date">${UIHelper.formatDate(
            story.createdAt
          )}</span>
        </div>
        
        <div class="preview-content">
          <img src="${story.photoUrl}" alt="Foto cerita dari ${
      story.name
    }" class="preview-image">
          <p class="preview-description">${story.description}</p>
        </div>
        
        <a href="#/detail/${
          story.id
        }" class="btn btn-primary btn-sm preview-button">
          Lihat Detail
        </a>
      </div>
    `;
  }

  addEventListeners() {
    const searchInput = document.getElementById("map-search-input");
    const filterSelect = document.getElementById("map-filter-select");

    searchInput?.addEventListener("input", (e) => {
      const filtered = this.presenter.filterStories(
        e.target.value.toLowerCase().trim(),
        filterSelect.value
      );
      this.addStoryMarkers(filtered);
    });

    filterSelect?.addEventListener("change", (e) => {
      const filtered = this.presenter.filterStories(
        searchInput.value.toLowerCase().trim(),
        e.target.value
      );
      this.addStoryMarkers(filtered);
    });
  }    
}

export default MapPage;