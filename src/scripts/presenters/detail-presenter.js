import apiService from "../data/api-service.js";
import { getStory, saveStory, deleteStory } from "../data/database.js";

class DetailPresenter {
    constructor({ view, storyId }) {
        this.view = view;
        this.storyId = storyId;
        this.story = null;
    }

    async init() {
        this.view.showLoading();

        try {
            const response = await apiService.getStoryDetail(this.storyId);
            this.story = response.story;

            if (this.story) {
                this.view.renderStory(this.story);

                if (this.story.lat && this.story.lon) {
                    this.view.renderMap(this.story.lat, this.story.lon, this.story.name, this.story.description);
                }

                this.checkIfStorySaved();
            } else {
                throw new Error("Data cerita tidak ditemukan");
            }
        } catch (error) {
            this.view.showError(`Gagal memuat cerita: ${error.message}`);
        }
    }

async saveStory() {
    if (!this.story) return;

    const storyData = {
        id: this.story.id, 
        name: this.story.name,
        description: this.story.description,
        photoUrl: this.story.photoUrl,
        createdAt: this.story.createdAt,
        lat: this.story.lat,
        lon: this.story.lon,
    };

    try {
        await saveStory(storyData);
        this.view.showAlert("Cerita berhasil disimpan", "success");
        await this.checkIfStorySaved(); 
    } catch (error) {
        console.error("Gagal menyimpan Cerita:", error);
        this.view.showAlert("Gagal menyimpan cerita", "error");
    }
}

async removeStory() {
    try {
        await deleteStory(this.story.id);
        this.view.showAlert("Cerita berhasil dihapus dari bookmark", "success");
        await this.checkIfStorySaved(); 
    } catch (error) {
        console.error("Gagal menghapus Cerita:", error);
        this.view.showAlert("Gagal menghapus cerita dari bookmark", "error");
    }
}

async checkIfStorySaved() {
    try {
        const savedStory = await getStory(this.story.id);
        this.updateSaveButtonState(!!savedStory);
    } catch (error) {
        console.error("Gagal memeriksa status cerita:", error);
        this.view.showAlert(
            "Gagal memuat data penyimpanan lokal", 
            "error"
        );
        this.updateSaveButtonState(false);
    }
}

    updateSaveButtonState(isSaved) {
        const saveStoryButton = document.getElementById('save-story');
        if (saveStoryButton) {
            saveStoryButton.innerHTML = isSaved
                ? '<i class="fa-solid fa-bookmark"></i> Cerita Tersimpan'
                : '<i class="fa-solid fa-bookmark"></i> Simpan Cerita';
            saveStoryButton.classList.toggle('saved', isSaved);
        }
    }

    handleShareWhatsApp() {
        const url = encodeURIComponent(window.location.href);
        const name = this.story?.name || "Pengguna";
        window.open(`https://api.whatsapp.com/send?text=Lihat cerita dari ${name} di Dicoding Story: ${url}`, "_blank");
    }

    handleShareFacebook() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    }

    async handleCopyUrl(button) {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this.view.showCopySuccess(button);
        } catch (err) {
            console.error("Gagal menyalin:", err);
            this.view.showCopyError();
        }
    }
}

export default DetailPresenter;