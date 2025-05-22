import BasePage from "./base-page.js";
import UIHelper from "../utils/ui-helper.js";
import cameraHelper from "../utils/camera-helper.js";
import mapHelper from "../utils/map-helper.js";
import AddStoryPresenter from "../presenters/add-story-presenter.js";

class AddStoryView extends BasePage {
    constructor(options) {
        super(options);
        this.setTitle("Tambah Cerita");
        this.presenter = new AddStoryPresenter(this);
        this.photoPreviewUrl = null;
    }

    async render() {
        if (!this.presenter.checkLoginStatus()) {
            return;
        }

        this.clearContainer();

        const pageContainer = this.createPageContainer("add-story-page");

        const pageHeader = this.createPageHeader(
            "Bagikan Cerita Baru",
            "Ceritakan pengalaman belajar Kamu di Dicoding"
        );
        pageContainer.appendChild(pageHeader);

        const formContainer = document.createElement("div");
        formContainer.className = "form-container add-story-form";

        formContainer.innerHTML = `
            <div id="alert-container"></div>

            <form id="add-story-form">

                <div class="form-group">
                    <button type="button" id="subscribe-btn" class="btn btn-success">
                        Jangan Lewatkan Notifikasi
                    </button>
                    <button type="button" id="unsubscribe-btn" class="btn btn-danger" style="display: none;">
                        Berhenti Berlangganan Notifikasi
                    </button>
                </div>

                <div class="form-group">
                    <label for="story-description" class="form-label">Cerita Kamu</label>
                    <textarea 
                        id="story-description" 
                        class="form-textarea" 
                        placeholder="Tulis cerita Kamu di sini..." 
                        required
                    ></textarea>
                </div>

        <div class="form-group">
            <label class="form-label">Foto Dulu Dong</label>

            <div class="camera-container">
                <div id="camera-section">
                    <video id="camera-preview" autoplay playsinline></video>

                    <div class="camera-buttons">
                        <button type="button" id="capture-btn" class="btn btn-primary">
                            <i class="fa-solid fa-camera"></i> Ambil Foto
                        </button>
                        <button type="button" id="switch-camera-btn" class="btn btn-secondary">
                            <i class="fa-solid fa-sync"></i> Putar Kamera
                        </button>
                        <button type="button" id="close-camera-btn" class="btn btn-danger">
                            <i class="fa-solid fa-times"></i> Tutup Kamera
                        </button>
                    </div>
                </div>

                <div class="camera-error">
                    <p>Atau unggah foto:</p>
                    <input type="file" id="photo-upload" accept="image/*" class="form-input">
                    <label for="photo-upload" class="btn btn-primary">
                        <i class="fa-solid fa-upload"></i> Unggah Foto
                    </label>
                </div>

                <div id="photo-preview-section" style="display: none;">
                    <img id="photo-preview" alt="Preview foto yang diambil" class="photo-preview">

                    <div class="preview-buttons">
                        <button type="button" id="retake-btn" class="btn btn-secondary">
                            <i class="fa-solid fa-redo"></i> Ambil Ulang
                        </button>
                    </div>
                </div>
            </div>
        </div>

                <div class="form-group">
                    <label class="form-label">Lokasi Kamu Dimana?</label>
                    <p class="form-hint">Klik pada peta untuk memilih lokasi</p>

                    <div id="map-container" class="map-container"></div>

                    <div class="location-info" id="location-info">
                        <p>Lokasi belum dipilih</p>
                        <button type="button" id="get-current-location-btn" class="btn btn-secondary btn-sm">
                            <i class="fa-solid fa-location-dot"></i> Gunakan Lokasi Saat Ini
                        </button>
                    </div>
                </div>

                <button type="submit" id="submit-btn" class="btn btn-primary btn-block">
                    Bagikan Cerita
                </button>
            </form>
        `;

        pageContainer.appendChild(formContainer);
        this.container.appendChild(pageContainer);

        Promise.resolve().then(() => {
            this.initializeCamera();
            this.initializeMap();
            this.addEventListeners();
            this.presenter.addEventListeners();
        });
    }

async initializeCamera() {
    try {
        const videoElement = document.getElementById("camera-preview");
        if (!videoElement) {
            throw new Error("Camera preview element not found");
        }
        await cameraHelper.initCamera(videoElement);
    } catch (error) {
        console.error("Camera initialization error:", error);
        const cameraSection = document.getElementById("camera-section");
        if (cameraSection) {
            cameraSection.innerHTML = `
                <p>Tidak dapat mengakses kamera: ${error.message}</p>
            `;
        }
    }
}

    initializeMap() {
        const mapContainer = document.getElementById("map-container");
        if (!mapContainer) {
            console.error("Map container not found");
            return;
        }

        try {
            mapHelper.initMap("map-container", {
                center: [-2.548926, 118.0148634],
                zoom: 5,
                onClick: (position) => this.presenter.handleMapClick(position),
                showLayerControl: true,
            });

            Promise.resolve().then(() => {
                mapHelper.updateMapSize();
            });
        } catch (error) {
            console.error("Map initialization error:", error);
            this.showAlert(`Gagal memuat peta: ${error.message}`, "error");
        }
    }

    updateLocationInfo(selectedLocation) {
        const locationInfo = document.getElementById("location-info");
        if (!locationInfo) return;

        if (selectedLocation) {
            const { lat, lon } = selectedLocation;
            locationInfo.innerHTML = `
                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    Lokasi yang dipilih: ${lat.toFixed(6)}, ${lon.toFixed(6)}
                </p>
                <button type="button" id="clear-location-btn" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-times"></i> Hapus Lokasi
                </button>
            `;

            const clearLocationBtn = document.getElementById("clear-location-btn");
            if (clearLocationBtn) {
                clearLocationBtn.addEventListener("click", () => {
                    this.presenter.clearLocation();
                });
            }
        } else {
            locationInfo.innerHTML = `
                <p>Lokasi belum dipilih</p>
                <button type="button" id="get-current-location-btn" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-location-dot"></i> Gunakan Lokasi Saat Ini
                </button>
            `;

            const getCurrentLocationBtn = document.getElementById(
                "get-current-location-btn"
            );
            if (getCurrentLocationBtn) {
                getCurrentLocationBtn.addEventListener(
                    "click",
                    () => this.presenter.handleGetCurrentLocation()
                );
            }
        }
    }

    setPhotoPreview(photoBlob) {
        if (this.photoPreviewUrl) {
            URL.revokeObjectURL(this.photoPreviewUrl);
        }
        
        if (photoBlob) {
            this.photoPreviewUrl = URL.createObjectURL(photoBlob);
            const photoPreview = document.getElementById("photo-preview");
            if (photoPreview) {
                photoPreview.src = this.photoPreviewUrl;
            }
        } else {
            this.photoPreviewUrl = null;
        }
    }

    toggleCameraPreview(showCamera) {
        const cameraSection = document.getElementById("camera-section");
        const photoPreviewSection = document.getElementById("photo-preview-section");

        if (cameraSection) {
            cameraSection.style.display = showCamera ? "block" : "none";
        }

        if (photoPreviewSection) {
            photoPreviewSection.style.display = showCamera ? "none" : "block";
        }
    }

    showAlert(message, type, duration = 5000) {
        const alertContainer = document.getElementById("alert-container");
        if (alertContainer) {
            UIHelper.showAlert(message, type, alertContainer, duration);
        }
    }

    showLoading(buttonId, loadingText) {
        const button = document.getElementById(buttonId);
        if (button) {
            return UIHelper.showButtonLoading(button, loadingText);
        }
        return () => {};
    }

addEventListeners() {
    const captureBtn = document.getElementById("capture-btn");
    if (captureBtn) {
        captureBtn.addEventListener("click", () => this.presenter.capturePhoto());
    }

    const switchCameraBtn = document.getElementById("switch-camera-btn");
    if (switchCameraBtn) {
        switchCameraBtn.addEventListener("click", () => this.presenter.switchCamera());
    }

    const retakeBtn = document.getElementById("retake-btn");
    if (retakeBtn) {
        retakeBtn.addEventListener("click", () => this.presenter.retakePhoto());
    }

    const getCurrentLocationBtn = document.getElementById("get-current-location-btn");
    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener("click", () => this.presenter.handleGetCurrentLocation());
    }

    const form = document.getElementById("add-story-form");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const descriptionElement = document.getElementById("story-description");
            const description = descriptionElement ? descriptionElement.value.trim() : "";
            this.presenter.handleSubmit(description);
        });
    }

    const closeCameraBtn = document.getElementById("close-camera-btn");
    if (closeCameraBtn) {
        closeCameraBtn.addEventListener("click", () => this.presenter.closeCamera());
    }

    const photoUpload = document.getElementById("photo-upload");
    if (photoUpload) {
        photoUpload.addEventListener(
            "change",
            (event) => this.presenter.handleFileUpload(event.target.files[0])
        );
    }
}

    removeEventListeners() {
        this.presenter.cleanup();
        
        if (this.photoPreviewUrl) {
            URL.revokeObjectURL(this.photoPreviewUrl);
        }
    }

    resetForm() {
        const form = document.getElementById("add-story-form");
        if (form) {
            form.reset();
        }
    }
}

export default AddStoryView;
