class BasePage {
  constructor({ container, params = {} }) {
    this.container = container;
    this.params = params;
    this.isMounted = false;
  }

  /**
   * Set the page title
   * @param {string} title - The page title
   */
  setTitle(title) {
    document.title = `${title} | Dicoding Story`;
  }

  /**
   * Create and return the page container element
   * @param {string} id - The page container ID
   * @returns {HTMLElement} The page container element
   */
  createPageContainer(id) {
    const pageContainer = document.createElement("div");
    pageContainer.className = "page-container";
    pageContainer.id = id;

    return pageContainer;
  }

  /**
   * Clear the container content
   */
  clearContainer() {
    this.container.innerHTML = "";
  }

  /**
   * Create a loading indicator
   * @returns {HTMLElement} The loading indicator element
   */
  createLoadingIndicator() {
    const loader = document.createElement("div");
    loader.className = "loading-indicator";
    loader.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Memuat data...</p>
    `;

    return loader;
  }

  /**
   * Show a loading indicator in the container
   */
  showLoading() {
    this.clearContainer();
    this.container.appendChild(this.createLoadingIndicator());
  }

  /**
   * Show an error message in the container
   * @param {string} message - The error message
   */
  showError(message) {
    this.clearContainer();

    const errorElement = document.createElement("div");
    errorElement.className = "error-container";
    errorElement.innerHTML = `
      <h2>Oops! Terjadi Kesalahan</h2>
      <p>${message}</p>
      <button id="retry-button" class="btn btn-primary">Coba Lagi</button>
    `;

    this.container.appendChild(errorElement);

    document.getElementById("retry-button").addEventListener("click", () => {
      this.render();
    });
  }

  /**
   * Create a page header with title and subtitle
   * @param {string} title - The page title
   * @param {string} subtitle - The page subtitle (optional)
   * @returns {HTMLElement} The page header element
   */
  createPageHeader(title, subtitle = "") {
    const header = document.createElement("header");
    header.className = "page-header";

    let headerContent = `<h2 class="page-title">${title}</h2>`;

    if (subtitle) {
      headerContent += `<p class="page-subtitle">${subtitle}</p>`;
    }

    header.innerHTML = headerContent;

    return header;
  }

  /**
   * Show a no content message in the container
   * @param {string} message - The message to display
   */
  showNoContent(message) {
    const noContent = document.createElement("div");
    noContent.className = "no-content";
    noContent.innerHTML = `
      <p>${message}</p>
    `;

    this.container.appendChild(noContent);
  }

  addEventListeners() {
  }

  async render() {
    this.clearContainer();
  }
}

export default BasePage;