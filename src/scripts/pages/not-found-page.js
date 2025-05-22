import BasePage from "./base-page.js";

class NotFoundPage extends BasePage {
  constructor(options) {
    super(options);
    this.setTitle("Halaman Tidak Ditemukan");
  }

  async render() {
    this.clearContainer();

    const pageContainer = this.createPageContainer("not-found-page");

    pageContainer.innerHTML = `
      <div class="not-found-container">
        <div class="not-found-content">
          <h2 class="not-found-title">404</h2>
          <h3 class="not-found-subtitle">Halaman Tidak Ditemukan</h3>
          <p class="not-found-description">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <a href="#/" class="btn btn-primary not-found-button">
            <i class="fa-solid fa-home"></i> Kembali ke Beranda
          </a>
        </div>
        <div class="not-found-image">
          <img src="./public/images/not-found.webp" alt="Ilustrasi Halaman Tidak Ditemukan" class="not-found-illustration">
        </div>
      </div>
    `;

    this.container.appendChild(pageContainer);
  }
}

export default NotFoundPage;