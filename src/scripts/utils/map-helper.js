class MapHelper {
  constructor() {
    this.map = null;
    this.markers = [];
    this.selectedLocation = null;
    this.layerControl = null;
  }

  initMap(containerId, options = {}) {
    const {
      center = [-2.548926, 118.0148634],
      zoom = 5,
      onClick = null,
      showLayerControl = true,
    } = options;

    this.map = L.map(containerId).setView(center, zoom);

    const layers = {
      OpenStreetMap: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ),
      Satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        }
      ),
      Terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }),
      Dark: L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ),
    };

    layers["OpenStreetMap"].addTo(this.map);

    if (showLayerControl) {
      this.layerControl = L.control.layers(layers).addTo(this.map);
    }

    if (onClick) {
      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        onClick({ lat, lng });
      });
    }

    return this.map;
  }

  addMarker(lat, lon, options = {}) {
    const {
      title = "",
      description = "",
      icon = null,
      draggable = false,
      onDragEnd = null,
    } = options;

    const markerOptions = {
      draggable,
      title,
    };

    if (icon) {
      markerOptions.icon = icon;
    }

    const marker = L.marker([lat, lon], markerOptions);

    if (title || description) {
      let popupContent = "";

      if (title) {
        popupContent += `<strong>${title}</strong>`;
      }

      if (description) {
        popupContent += popupContent ? `<br>${description}` : description;
      }

      marker.bindPopup(popupContent);
    }

    if (draggable && onDragEnd) {
      marker.on("dragend", (e) => {
        const position = e.target.getLatLng();
        onDragEnd({ lat: position.lat, lng: position.lng });
      });
    }

    marker.addTo(this.map);

    this.markers.push(marker);

    return marker;
  }

  setSelectedLocation(lat, lon) {
    this.selectedLocation = { lat, lon };

    this.clearMarkers();

    this.addMarker(lat, lon, {
      title: "Lokasi yang dipilih",
      draggable: true,
      onDragEnd: ({ lat, lng }) => {
        this.selectedLocation = { lat, lon: lng };
      },
    });

    this.map.setView([lat, lon], 15);
  }

  getSelectedLocation() {
    return this.selectedLocation;
  }

  addStoryMarkers(stories = []) {
    this.clearMarkers();

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        this.addMarker(story.lat, story.lon, {
          title: story.name,
          description: story.description,
        });
      }
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      marker.remove();
    });

    this.markers = [];
  }

  updateMapSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lon: longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

export default new MapHelper();