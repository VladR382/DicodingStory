import "../styles/main.css";
import { handleNavigation } from "./routes/routes.js";
import { updateAuthUI } from "./utils/auth-helper.js";
import UIHelper from "./utils/ui-helper.js";
import cameraHelper from "./utils/camera-helper.js";


const app = {
  async init() {
    this.initComponents();
    this.registerServiceWorker();
    this.handleRouteChange();

    window.addEventListener("hashchange", () => {
      this.handleRouteChange();
      cameraHelper.stopCamera()
    });
  },

  initComponents() {
    UIHelper.initMobileMenu();
    updateAuthUI();
    this._initSkipLink();
  },

  _initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#content');

    if (skipLink && mainContent) {
      skipLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        mainContent.setAttribute('tabindex', -1); 
        mainContent.focus(); 
        mainContent.removeAttribute('tabindex'); 
      });
    }
  },

  async handleRouteChange() {
    const content = document.getElementById("content");
    if (!content) {
      console.error("Content element not found");
      return;
    }

    content.innerHTML = "";
    const loadingElement = document.createElement("div");
    loadingElement.className = "loading-indicator";
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Memuat halaman...</p>
    `;
    content.appendChild(loadingElement);

    try {
      const matchedRoute = handleNavigation();

      if (!matchedRoute) {
        content.innerHTML = "<p>Halaman tidak ditemukan</p>";
        return;
      }

      const component = new matchedRoute.component({
        container: content,
        params: matchedRoute.params,
      });

      await component.render();

      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error rendering page:", error);
      content.innerHTML = `
        <div class="error-container">
          <h3>Error</h3>
          <p>${error.message || "Terjadi kesalahan saat memuat halaman"}</p>
          <button onclick="window.location.reload()" class="btn btn-primary">Muat Ulang</button>
        </div>
      `;
    }
  },

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          `${import.meta.env.BASE_URL}service-worker.js`
        );
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});

export default app;