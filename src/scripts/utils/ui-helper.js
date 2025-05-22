const UIHelper = {
  /**
   * Show a loading indicator on a button
   * @param {HTMLElement} button - The button element
   * @param {string} loadingText - Text to show during loading
   */
  showButtonLoading(button, loadingText = "Memuat...") {
    const originalText = button.textContent;
    button.setAttribute("data-original-text", originalText);
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add("btn-loading");

    return () => {
      this.hideButtonLoading(button);
    };
  },

  /**
   * Hide the loading indicator from a button
   * @param {HTMLElement} button - The button element
   */
  hideButtonLoading(button) {
    const originalText = button.getAttribute("data-original-text");
    if (originalText) {
      button.textContent = originalText;
    }
    button.disabled = false;
    button.classList.remove("btn-loading");
  },

  /**
   * Validate password requirements
   * @param {string} password - Password to validate
   * @returns {string|null} Error message or null if valid
   */
  validatePassword(password) {
    if (password.length < 8) {
      return "Password harus minimal 8 karakter";
    }
    return null;
  },

  /**
   * Show a message alert
   * @param {string} message - The message to display
   * @param {string} type - The type of alert ('success' or 'error')
   * @param {HTMLElement} container - The container to append the alert to
   * @param {number} timeout - Time in ms before auto-dismiss (0 to disable)
   */
  showAlert(message, type = "success", container, timeout = 5000) {
    const alertEl = document.createElement("div");
    alertEl.className = `alert alert-${type}`;
    alertEl.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "alert-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Close alert");
    alertEl.appendChild(closeBtn);

    const removeAlert = () => {
      alertEl.classList.add("alert-dismissing");
      setTimeout(() => {
        if (alertEl.parentNode) {
          alertEl.parentNode.removeChild(alertEl);
        }
      }, 300);
    };

    closeBtn.addEventListener("click", removeAlert);

    if (timeout > 0) {
      setTimeout(removeAlert, timeout);
    }

    container.prepend(alertEl);

    return removeAlert;
  },

  /**
   * Format a date string to a readable format
   * @param {string} dateString - ISO date string
   * @param {string} locale - Locale string (default: 'id-ID')
   * @returns {string} Formatted date string
   */
  formatDate(dateString, locale = "id-ID") {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  },

  /**
   * Create a story card element
   * @param {Object} story - Story data
   * @returns {HTMLElement} Card element
   */
  createStoryCard(story) {
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("data-story-id", story.id);

    const hasLocation = story.lat && story.lon;

    card.innerHTML = `
      <img src="${story.photoUrl}" alt="Story photo by ${
      story.name
    }" class="card-image">
      <div class="card-content">
        <h3 class="card-title">${story.name}</h3>
        <p class="card-description">${story.description}</p>
        <div class="card-meta">
          <span class="card-date">
            <i class="fa-regular fa-calendar"></i>
            ${this.formatDate(story.createdAt)}
          </span>
          ${
            hasLocation
              ? `
            <span class="card-location">
              <i class="fa-solid fa-location-dot"></i>
              Lihat Lokasi
            </span>
          `
              : ""
          }
        </div>
        <a href="#/detail/${
          story.id
        }" class="btn btn-primary card-button">Lihat Detail</a>
      </div>
    `;

    return card;
  },

  /**
   * Create a story grid from story data
   * @param {Array} stories - Array of story objects
   * @param {HTMLElement} container - Container to append the grid
   */
  renderStoryGrid(stories, container) {
    container.innerHTML = "";

    if (stories.length === 0) {
      container.innerHTML =
        '<p class="no-stories">Belum ada cerita yang dibagikan.</p>';
      return;
    }

    const grid = document.createElement("div");
    grid.className = "story-grid";

    stories.forEach((story) => {
      const card = this.createStoryCard(story);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  },

  /**
   * Toggle the mobile navigation menu
   */
  toggleMobileMenu() {
    const nav = document.getElementById("navigation-menu");
    nav.classList.toggle("active");
  },

  /**
   * Initialize the mobile menu handler
   */
  initMobileMenu() {
    const hamburgerButton = document.getElementById("hamburger-button");
    if (hamburgerButton) {
      hamburgerButton.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }
  },

  /**
   * Truncate text to a certain length
   * @param {string} text - The text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength) + "...";
  },
};

export default UIHelper;