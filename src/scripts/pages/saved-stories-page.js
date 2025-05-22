import BasePage from "./base-page.js";
import { getAllStories, deleteStory } from "../data/database.js";
import UIHelper from "../utils/ui-helper.js";
import { navigateTo } from "../routes/routes.js";

class SavedStoriesPage extends BasePage {
    constructor(options) {
        super(options);
        this.setTitle("Cerita Tersimpan");
    }

    async render() {
        this.clearContainer();
        this.showLoading();

        try {
            const savedStories = await getAllStories();
            this.renderStories(savedStories);
        } catch (error) {
            this.showError(`Gagal memuat cerita tersimpan: ${error.message}`);
        }

        this.addEventListeners(); 
    }

    renderStories(stories) {
        this.clearContainer();
        const pageContainer = this.createPageContainer("saved-stories-page");
        const storiesContainer = document.createElement("div");
        storiesContainer.className = "saved-stories-container";

        if (stories.length === 0) {
            storiesContainer.innerHTML = "<p class='no-saved-stories'>Belum ada cerita yang disimpan.</p>";
        } else {
            stories.forEach(story => {
                const storyElement = this.createStoryElement(story);
                storiesContainer.appendChild(storyElement);
            });
        }

        pageContainer.appendChild(storiesContainer);
        this.container.appendChild(pageContainer);
        this.addStyles();
    }

    createStoryElement(story) {
        const storyElement = document.createElement("article");
        storyElement.className = "saved-story-item";
        storyElement.innerHTML = `
            <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" class="saved-story-image">
            <div class="saved-story-info">
                <h2 class="saved-story-title">${story.name}</h2>
                <p class="saved-story-description">${UIHelper.truncateText(story.description, 100)}</p>
                <div class="saved-story-actions">
                    <button class="btn-primary btn-view-detail" data-id="${story.id}">Lihat Detail</button>
                    <button class="btn-danger btn-delete-story" data-id="${story.id}">Hapus</button>
                </div>
            </div>
        `;
        return storyElement;
    }

    addEventListeners() {
        const viewDetailButtons = document.querySelectorAll(".btn-view-detail");
        viewDetailButtons.forEach(button => {
            button.addEventListener("click", () => {
                const storyId = button.dataset.id;
                navigateTo(`/detail/${storyId}`);
            });
        });

        const deleteStoryButtons = document.querySelectorAll(".btn-delete-story");
        deleteStoryButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const storyId = button.dataset.id;
                try {
                    await deleteStory(storyId);
                    this.showAlert("Cerita berhasil dihapus.", "success");
                    await this.render(); 
                } catch (error) {
                    this.showAlert("Gagal menghapus cerita.", "error");
                }
            });
        });
    }

    addStyles() {
        if (!document.getElementById("saved-stories-styles")) {
            const styleEl = document.createElement("style");
            styleEl.id = "saved-stories-styles";
            styleEl.textContent = `
                .saved-stories-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-top: 2rem;
                }

                .saved-story-item {
                    display: flex;
                    flex-direction: column;
                    background-color: #f9f7f1;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .saved-story-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    object-position: center;
                    margin-bottom: 1rem;
                }

                .saved-story-info {
                    padding: 1rem;
                }

                .saved-story-title {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: #333;
                }

                .saved-story-description {
                    font-size: 1rem;
                    color: #666;
                    margin-bottom: 1rem;
                }

                .saved-story-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.5rem;
                }

                .btn-view-detail {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .btn-view-detail:hover {
                    background-color: #0056b3;
                }

                .btn-delete-story {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .btn-delete-story:hover {
                    background-color: #c82333;
                }

                .no-saved-stories {
                    text-align: center;
                    font-style: italic;
                    color: #888;
                }
            `;
            document.head.appendChild(styleEl);
        }
    }

    showLoading() {
        super.showLoading();
    }

    hideLoading() {
        super.hideLoading();
    }

    showError(message) {
        super.showError(message);
    }

    showAlert(message, type) {
        UIHelper.showAlert(message, type);
    }
}

export default SavedStoriesPage;