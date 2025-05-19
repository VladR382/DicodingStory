import cameraHelper from "../utils/camera-helper.js";
import mapHelper from "../utils/map-helper.js";
import { isLoggedIn } from "../utils/auth-helper.js";
import { navigateTo } from "../routes/routes.js";
import apiService from "../data/api-service.js";

class AddStoryPresenter {
    constructor(view) {
        this.view = view;
        this.photoBlob = null;
        this.selectedLocation = null;
    }

    checkLoginStatus() {
        if (!isLoggedIn()) {
            navigateTo("/login");
            return false;
        }
        return true;
    }

    handleMapClick(position) {
        const { lat, lng } = position;
        this.selectedLocation = { lat, lon: lng };
        this.view.updateLocationInfo(this.selectedLocation);
        mapHelper.setSelectedLocation(lat, lng);
    }

    clearLocation() {
        this.selectedLocation = null;
        mapHelper.clearMarkers();
        this.view.updateLocationInfo(null);
    }

    async handleGetCurrentLocation() {
        try {
            const hideLoading = this.view.showLoading("get-current-location-btn", "Mendapatkan lokasi...");

            const { lat, lon } = await mapHelper.getCurrentLocation();
            this.selectedLocation = { lat, lon };

            mapHelper.setSelectedLocation(lat, lon);
            this.view.updateLocationInfo(this.selectedLocation);

            hideLoading();
        } catch (error) {
            console.error("Get current location error:", error);
            this.view.showAlert(`Gagal mendapatkan lokasi: ${error.message}`, "error");
        }
    }

    async capturePhoto() {
        try {
            const { blob, width, height } = await cameraHelper.takePhoto(this.targetWidth); 
            this.photoBlob = blob;
            this.photoWidth = width;
            this.photoHeight = height;
            if (!this.photoBlob) {
                throw new Error("Failed to capture photo");
            }

            this.view.setPhotoPreview(this.photoBlob);
            this.view.toggleCameraPreview(false);
        } catch (error) {
            console.error("Capture photo error:", error);
            this.view.showAlert(`Gagal mengambil foto: ${error.message}`, "error");
        }
    }

    retakePhoto() {
        this.photoBlob = null;
        this.view.setPhotoPreview(null);
        this.view.toggleCameraPreview(true);
    }

    handleFileUpload(file) {
        if (file) {
            if (!file.type.startsWith("image/")) {
                this.view.showAlert("File harus berupa gambar", "error");
                return;
            }

            this.photoBlob = file;
            this.resizeUploadedImage(file); 
            this.view.setPhotoPreview(this.photoBlob);
            this.view.toggleCameraPreview(false);
        }
    }

    resizeUploadedImage(file) {
        if (this.photoWidth === 0 || this.photoHeight === 0) {
            return; 
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = this.photoWidth;
                canvas.height = this.photoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, this.photoWidth, this.photoHeight);

                canvas.toBlob((blob) => {
                    this.photoBlob = blob;
                    this.view.setPhotoPreview(this.photoBlob); 
                }, 'image/jpeg', 0.7); 
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }


    async handleSubmit(description) {
        if (!description) {
            this.view.showAlert("Cerita tidak boleh kosong", "error");
            return;
        }

        if (!this.photoBlob) {
            this.view.showAlert("Harap tambahkan foto untuk cerita Kamu", "error");
            return;
        }

        const hideLoading = this.view.showLoading("submit-btn", "Mengunggah...");

        try {
            const storyData = {
                description,
                photo: this.photoBlob,
            };

            if (this.selectedLocation) {
                storyData.lat = this.selectedLocation.lat;
                storyData.lon = this.selectedLocation.lon;
            }

            if (isLoggedIn()) {
                await apiService.addStory(storyData);
            } else {
                await apiService.addStoryAsGuest(storyData);
            }

            this.view.showAlert("Cerita berhasil dibagikan!", "success");
            this.view.resetForm();
            this.retakePhoto();
            this.clearLocation();

            this.trySubscribeToPushNotification();

            setTimeout(() => {
                navigateTo("/");
            }, 2000);
        } catch (error) {
            console.error("Submit story error:", error);
            this.view.showAlert(`Gagal mengunggah cerita: ${error.message}`, "error");
        } finally {
            hideLoading();
        }
    }

    async trySubscribeToPushNotification() {
        try {
            if ("serviceWorker" in navigator && "PushManager" in window && isLoggedIn()) {
                const permission = await Notification.requestPermission();

                if (permission === "granted") {
                    const registration = await navigator.serviceWorker.ready;
                    if (!registration) {
                        throw new Error("Service worker not ready");
                    }

                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey:
                            "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",
                    });

                    if (!subscription) {
                        throw new Error("Failed to create push subscription");
                    }

                    const p256dhKey = subscription.getKey("p256dh");
                    const authKey = subscription.getKey("auth");

                    if (!p256dhKey || !authKey) {
                        throw new Error("Subscription keys not available");
                    }

                    await apiService.subscribeNotification({
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: btoa(
                                String.fromCharCode.apply(null, new Uint8Array(p256dhKey))
                            ),
                            auth: btoa(
                                String.fromCharCode.apply(null, new Uint8Array(authKey))
                            ),
                        },
                    });
                }
            }
        } catch (error) {
            console.error("Failed to subscribe to push notification:", error);
        }
    }

    async handleSubscribeClick() {
        try {
            await this.trySubscribeToPushNotification();
            this.updateSubscribeButtonVisibility(true);
            this.view.showAlert("Berhasil berlangganan notifikasi!", "success");
        } catch (error) {
            console.error("Subscribe error:", error);
            this.view.showAlert(`Gagal berlangganan notifikasi: ${error.message}`, "error");
        }
    }

    async handleUnsubscribeClick() {
        try {
            await this.tryUnsubscribeFromPushNotification();
            this.updateSubscribeButtonVisibility(false);
            this.view.showAlert("Berhasil berhenti berlangganan notifikasi!", "success");
        } catch (error) {
            console.error("Unsubscribe error:", error);
            this.view.showAlert(`Gagal berhenti berlangganan notifikasi: ${error.message}`, "error");
        }
    }

    async tryUnsubscribeFromPushNotification() {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            const registration = await navigator.serviceWorker.ready;
            if (!registration) {
                throw new Error("Service worker not ready");
            }

            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();

                try {
                    await apiService.unsubscribeNotification({ endpoint: subscription.endpoint });
                } catch (error) {
                    console.error("Failed to unsubscribe from server:", error);
                }
            }
        }
    }

    updateSubscribeButtonVisibility(isSubscribed) {
        const subscribeBtn = document.getElementById("subscribe-btn");
        const unsubscribeBtn = document.getElementById("unsubscribe-btn");

        if (subscribeBtn && unsubscribeBtn) {
            subscribeBtn.style.display = isSubscribed ? "none" : "block";
            unsubscribeBtn.style.display = isSubscribed ? "block" : "none";
        }
    }

    async switchCamera() {
        try {
            await cameraHelper.switchCamera();
        } catch (error) {
            console.error("Switch camera error:", error);
            this.view.showAlert(`Gagal mengganti kamera: ${error.message}`, "error");
        }
    }

    closeCamera() {
        cameraHelper.stopCamera();
        const cameraSection = document.getElementById("camera-section");
        if (cameraSection) {
            cameraSection.style.display = "none";
        }
    }

    addEventListeners() {
        const subscribeBtn = document.getElementById("subscribe-btn");
        if (subscribeBtn) {
            subscribeBtn.addEventListener("click", () => this.handleSubscribeClick());
        }

        const unsubscribeBtn = document.getElementById("unsubscribe-btn");
        if (unsubscribeBtn) {
            unsubscribeBtn.addEventListener("click", () => this.handleUnsubscribeClick());
        }
    }

    cleanup() {
        cameraHelper.stopCamera();
    }
}

export default AddStoryPresenter;