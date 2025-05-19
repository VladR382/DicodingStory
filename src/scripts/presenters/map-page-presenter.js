import apiService from "../data/api-service.js";
import UIHelper from "../utils/ui-helper.js";

class MapPresenter {
    constructor(view) {
        this.view = view;
        this.stories = [];
    }

    async loadStories() {
        try {
        const response = await apiService.getAllStories({
            size: 100,
            location: 1,
        });

        this.stories = this.processStories(response.listStory || []);
        this.view.showStories(this.stories);
        } catch (error) {
        this.view.showError(`Gagal memuat cerita: ${error.message}`);
        }
    }

    processStories(stories) {
        return stories
        .filter(
            (story) =>
            story.lat !== null &&
            story.lon !== null &&
            !isNaN(story.lat) &&
            !isNaN(story.lon)
        )
        .map((story) => ({
            ...story,
            lat: parseFloat(story.lat),
            lon: parseFloat(story.lon),
        }));
    }

    filterStories(searchTerm, filterValue) {
        let filtered = [...this.stories];

        if (searchTerm) {
        filtered = filtered.filter((story) => {
            const name = story.name.toLowerCase();
            const desc = story.description.toLowerCase();
            return name.includes(searchTerm) || desc.includes(searchTerm);
        });
        }

        if (filterValue === "recent") {
        filtered = filtered
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
        }

        return filtered;
    }
}

export default MapPresenter;
