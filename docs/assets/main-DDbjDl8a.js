(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();class m{constructor({container:e,params:t={}}){this.container=e,this.params=t,this.isMounted=!1}setTitle(e){document.title=`${e} | Dicoding Story`}createPageContainer(e){const t=document.createElement("div");return t.className="page-container",t.id=e,t}clearContainer(){this.container.innerHTML=""}createLoadingIndicator(){const e=document.createElement("div");return e.className="loading-indicator",e.innerHTML=`
      <div class="loading-spinner"></div>
      <p>Memuat data...</p>
    `,e}showLoading(){this.clearContainer(),this.container.appendChild(this.createLoadingIndicator())}showError(e){this.clearContainer();const t=document.createElement("div");t.className="error-container",t.innerHTML=`
      <h2>Oops! Terjadi Kesalahan</h2>
      <p>${e}</p>
      <button id="retry-button" class="btn btn-primary">Coba Lagi</button>
    `,this.container.appendChild(t),document.getElementById("retry-button").addEventListener("click",()=>{this.render()})}createPageHeader(e,t=""){const r=document.createElement("header");r.className="page-header";let a=`<h2 class="page-title">${e}</h2>`;return t&&(a+=`<p class="page-subtitle">${t}</p>`),r.innerHTML=a,r}showNoContent(e){const t=document.createElement("div");t.className="no-content",t.innerHTML=`
      <p>${e}</p>
    `,this.container.appendChild(t)}addEventListeners(){}async render(){this.clearContainer()}}const l={showButtonLoading(i,e="Memuat..."){const t=i.textContent;return i.setAttribute("data-original-text",t),i.textContent=e,i.disabled=!0,i.classList.add("btn-loading"),()=>{this.hideButtonLoading(i)}},hideButtonLoading(i){const e=i.getAttribute("data-original-text");e&&(i.textContent=e),i.disabled=!1,i.classList.remove("btn-loading")},validatePassword(i){return i.length<8?"Password harus minimal 8 karakter":null},showAlert(i,e="success",t,r=5e3){const a=document.createElement("div");a.className=`alert alert-${e}`,a.textContent=i;const n=document.createElement("button");n.className="alert-close",n.innerHTML="&times;",n.setAttribute("aria-label","Close alert"),a.appendChild(n);const o=()=>{a.classList.add("alert-dismissing"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)};return n.addEventListener("click",o),r>0&&setTimeout(o,r),t.prepend(a),o},formatDate(i,e="id-ID"){const t=new Date(i);return new Intl.DateTimeFormat(e,{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(t)},createStoryCard(i){const e=document.createElement("article");e.className="card",e.setAttribute("data-story-id",i.id);const t=i.lat&&i.lon;return e.innerHTML=`
      <img src="${i.photoUrl}" alt="Story photo by ${i.name}" class="card-image">
      <div class="card-content">
        <h3 class="card-title">${i.name}</h3>
        <p class="card-description">${i.description}</p>
        <div class="card-meta">
          <span class="card-date">
            <i class="fa-regular fa-calendar"></i>
            ${this.formatDate(i.createdAt)}
          </span>
          ${t?`
            <span class="card-location">
              <i class="fa-solid fa-location-dot"></i>
              Lihat Lokasi
            </span>
          `:""}
        </div>
        <a href="#/detail/${i.id}" class="btn btn-primary card-button">Lihat Detail</a>
      </div>
    `,e},renderStoryGrid(i,e){if(e.innerHTML="",i.length===0){e.innerHTML='<p class="no-stories">Belum ada cerita yang dibagikan.</p>';return}const t=document.createElement("div");t.className="story-grid",i.forEach(r=>{const a=this.createStoryCard(r);t.appendChild(a)}),e.appendChild(t)},toggleMobileMenu(){document.getElementById("navigation-menu").classList.toggle("active")},initMobileMenu(){const i=document.getElementById("hamburger-button");i&&i.addEventListener("click",()=>{this.toggleMobileMenu()})},truncateText(i,e=100){return i.length<=e?i:i.substring(0,e)+"..."}};class X{constructor(){this.videoElement=null,this.stream=null,this.facingMode="environment",this.constraints={video:{facingMode:this.facingMode,width:{ideal:1280},height:{ideal:720}},audio:!1}}async initCamera(e){try{if(this.videoElement=e,!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Camera API is not supported in your browser");this.stream=await navigator.mediaDevices.getUserMedia(this.constraints),this.videoElement.srcObject=this.stream,await new Promise((t,r)=>{this.videoElement.onloadedmetadata=t,this.videoElement.onerror=r}),await this.videoElement.play()}catch(t){throw this.stopCamera(),t}}async switchCamera(){return this.stopCamera(),this.facingMode=this.facingMode==="environment"?"user":"environment",this.constraints.video.facingMode=this.facingMode,this.initCamera(this.videoElement)}takePhoto(e=530,t=.7){return new Promise(r=>{const a=this.videoElement,n=a.videoWidth/a.videoHeight,o=Math.min(e,a.videoWidth),s=o/n,c=document.createElement("canvas"),d=c.getContext("2d");c.width=o,c.height=s,d.drawImage(a,0,0,a.videoWidth,a.videoHeight,0,0,o,s),c.toBlob(u=>r({blob:u,width:o,height:s}),"image/jpeg",t)})}stopCamera(){var e;(e=this.stream)==null||e.getTracks().forEach(t=>{t.stop(),this.stream.removeTrack(t)}),this.videoElement&&(this.videoElement.srcObject=null,this.videoElement.src&&window.URL.revokeObjectURL(this.videoElement.src),this.videoElement.src=null),this.stream=null}}const k=new X;class Z{constructor(){this.map=null,this.markers=[],this.selectedLocation=null,this.layerControl=null}initMap(e,t={}){const{center:r=[-2.548926,118.0148634],zoom:a=5,onClick:n=null,showLayerControl:o=!0}=t;this.map=L.map(e).setView(r,a);const s={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),Satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"}),Terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}),Dark:L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'})};return s.OpenStreetMap.addTo(this.map),o&&(this.layerControl=L.control.layers(s).addTo(this.map)),n&&this.map.on("click",c=>{const{lat:d,lng:u}=c.latlng;n({lat:d,lng:u})}),this.map}addMarker(e,t,r={}){const{title:a="",description:n="",icon:o=null,draggable:s=!1,onDragEnd:c=null}=r,d={draggable:s,title:a};o&&(d.icon=o);const u=L.marker([e,t],d);if(a||n){let w="";a&&(w+=`<strong>${a}</strong>`),n&&(w+=w?`<br>${n}`:n),u.bindPopup(w)}return s&&c&&u.on("dragend",w=>{const H=w.target.getLatLng();c({lat:H.lat,lng:H.lng})}),u.addTo(this.map),this.markers.push(u),u}setSelectedLocation(e,t){this.selectedLocation={lat:e,lon:t},this.clearMarkers(),this.addMarker(e,t,{title:"Lokasi yang dipilih",draggable:!0,onDragEnd:({lat:r,lng:a})=>{this.selectedLocation={lat:r,lon:a}}}),this.map.setView([e,t],15)}getSelectedLocation(){return this.selectedLocation}addStoryMarkers(e=[]){if(this.clearMarkers(),e.forEach(t=>{t.lat&&t.lon&&this.addMarker(t.lat,t.lon,{title:t.name,description:t.description})}),this.markers.length>0){const t=L.featureGroup(this.markers);this.map.fitBounds(t.getBounds(),{padding:[30,30]})}}clearMarkers(){this.markers.forEach(e=>{e.remove()}),this.markers=[]}updateMapSize(){this.map&&this.map.invalidateSize()}async getCurrentLocation(){return new Promise((e,t)=>{if(!navigator.geolocation){t(new Error("Geolocation is not supported by your browser"));return}navigator.geolocation.getCurrentPosition(r=>{const{latitude:a,longitude:n}=r.coords;e({lat:a,lon:n})},r=>{t(r)})})}}const h=new Z,$="dicoding_story_token",S="dicoding_story_user",ee=i=>{localStorage.setItem($,i.token),localStorage.setItem(S,JSON.stringify({userId:i.userId,name:i.name}))},W=()=>localStorage.getItem($),te=()=>{const i=localStorage.getItem(S);if(!i)return null;try{return JSON.parse(i)}catch(e){return console.error("Failed to parse user data:",e),localStorage.removeItem(S),null}},E=()=>!!W(),ie=()=>{localStorage.removeItem($),localStorage.removeItem(S),window.location.hash="#/",window.location.reload()},K=()=>{const i=E(),e=document.getElementById("auth-menu-item");if(e)if(i){const t=te();e.innerHTML=`
                <div class="user-menu">
                    <span class="user-name">${(t==null?void 0:t.name)||"User"}</span>
                    <button id="logout-button" class="nav-link logout-button">Keluar</button>
                </div>
            `;const r=document.getElementById("logout-button");if(r){const a=r.cloneNode(!0);r.parentNode.replaceChild(a,r),a.addEventListener("click",ie)}}else e.innerHTML=`
                <a href="#/login" class="nav-link login-button">Masuk</a>
            `},g="https://story-api.dicoding.dev/v1",N=i=>{const e=new FormData;return e.append("description",i.description),e.append("photo",i.photo),i.lat&&e.append("lat",i.lat),i.lon&&e.append("lon",i.lon),e},f=async(i,e={})=>{const t=W(),r=e.requiresAuth!==!1;if(r&&!t)throw new Error("Authentication required");const a=e.headers?{...e.headers}:{};r&&t&&(a.Authorization=`Bearer ${t}`);const n={...e,headers:a,requiresAuth:void 0},o=await fetch(i,n),s=await o.json();if(!o.ok)throw new Error(s.message||"Something went wrong");return s},p={register:async i=>f(`${g}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i),requiresAuth:!1}),login:async i=>f(`${g}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i),requiresAuth:!1}),getAllStories:async(i={})=>{const e=new URLSearchParams;i.page&&e.append("page",i.page),i.size&&e.append("size",i.size),i.location&&e.append("location",i.location);const t=`${g}/stories?${e.toString()}`;return f(t)},getStoryDetail:async i=>{const e=`${g}/stories/${i}`;return f(e)},addStory:async i=>{const e=N(i);return f(`${g}/stories`,{method:"POST",body:e})},addStoryAsGuest:async i=>{const e=N(i);return f(`${g}/stories/guest`,{method:"POST",body:e,requiresAuth:!1})},subscribeNotification:async i=>f(`${g}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),unsubscribeNotification:async i=>f(`${g}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({endpoint:i})})};class re{constructor(e){this.view=e,this.photoBlob=null,this.selectedLocation=null}checkLoginStatus(){return E()?!0:(y("/login"),!1)}handleMapClick(e){const{lat:t,lng:r}=e;this.selectedLocation={lat:t,lon:r},this.view.updateLocationInfo(this.selectedLocation),h.setSelectedLocation(t,r)}clearLocation(){this.selectedLocation=null,h.clearMarkers(),this.view.updateLocationInfo(null)}async handleGetCurrentLocation(){try{const e=this.view.showLoading("get-current-location-btn","Mendapatkan lokasi..."),{lat:t,lon:r}=await h.getCurrentLocation();this.selectedLocation={lat:t,lon:r},h.setSelectedLocation(t,r),this.view.updateLocationInfo(this.selectedLocation),e()}catch(e){console.error("Get current location error:",e),this.view.showAlert(`Gagal mendapatkan lokasi: ${e.message}`,"error")}}async capturePhoto(){try{const{blob:e,width:t,height:r}=await k.takePhoto(this.targetWidth);if(this.photoBlob=e,this.photoWidth=t,this.photoHeight=r,!this.photoBlob)throw new Error("Failed to capture photo");this.view.setPhotoPreview(this.photoBlob),this.view.toggleCameraPreview(!1)}catch(e){console.error("Capture photo error:",e),this.view.showAlert(`Gagal mengambil foto: ${e.message}`,"error")}}retakePhoto(){this.photoBlob=null,this.view.setPhotoPreview(null),this.view.toggleCameraPreview(!0)}handleFileUpload(e){if(e){if(!e.type.startsWith("image/")){this.view.showAlert("File harus berupa gambar","error");return}this.photoBlob=e,this.resizeUploadedImage(e),this.view.setPhotoPreview(this.photoBlob),this.view.toggleCameraPreview(!1)}}resizeUploadedImage(e){if(this.photoWidth===0||this.photoHeight===0)return;const t=new FileReader;t.onload=r=>{const a=new Image;a.onload=()=>{const n=document.createElement("canvas");n.width=this.photoWidth,n.height=this.photoHeight,n.getContext("2d").drawImage(a,0,0,this.photoWidth,this.photoHeight),n.toBlob(s=>{this.photoBlob=s,this.view.setPhotoPreview(this.photoBlob)},"image/jpeg",.7)},a.src=r.target.result},t.readAsDataURL(e)}async handleSubmit(e){if(!e){this.view.showAlert("Cerita tidak boleh kosong","error");return}if(!this.photoBlob){this.view.showAlert("Harap tambahkan foto untuk cerita Kamu","error");return}const t=this.view.showLoading("submit-btn","Mengunggah...");try{const r={description:e,photo:this.photoBlob};this.selectedLocation&&(r.lat=this.selectedLocation.lat,r.lon=this.selectedLocation.lon),E()?await p.addStory(r):await p.addStoryAsGuest(r),this.view.showAlert("Cerita berhasil dibagikan!","success"),this.view.resetForm(),this.retakePhoto(),this.clearLocation(),this.trySubscribeToPushNotification(),setTimeout(()=>{y("/")},2e3)}catch(r){console.error("Submit story error:",r),this.view.showAlert(`Gagal mengunggah cerita: ${r.message}`,"error")}finally{t()}}async trySubscribeToPushNotification(){try{if("serviceWorker"in navigator&&"PushManager"in window&&E()&&await Notification.requestPermission()==="granted"){const t=await navigator.serviceWorker.ready;if(!t)throw new Error("Service worker not ready");const r=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"});if(!r)throw new Error("Failed to create push subscription");const a=r.getKey("p256dh"),n=r.getKey("auth");if(!a||!n)throw new Error("Subscription keys not available");await p.subscribeNotification({endpoint:r.endpoint,keys:{p256dh:btoa(String.fromCharCode.apply(null,new Uint8Array(a))),auth:btoa(String.fromCharCode.apply(null,new Uint8Array(n)))}})}}catch(e){console.error("Failed to subscribe to push notification:",e)}}async handleSubscribeClick(){try{await this.trySubscribeToPushNotification(),this.updateSubscribeButtonVisibility(!0),this.view.showAlert("Berhasil berlangganan notifikasi!","success")}catch(e){console.error("Subscribe error:",e),this.view.showAlert(`Gagal berlangganan notifikasi: ${e.message}`,"error")}}async handleUnsubscribeClick(){try{await this.tryUnsubscribeFromPushNotification(),this.updateSubscribeButtonVisibility(!1),this.view.showAlert("Berhasil berhenti berlangganan notifikasi!","success")}catch(e){console.error("Unsubscribe error:",e),this.view.showAlert(`Gagal berhenti berlangganan notifikasi: ${e.message}`,"error")}}async tryUnsubscribeFromPushNotification(){if("serviceWorker"in navigator&&"PushManager"in window){const e=await navigator.serviceWorker.ready;if(!e)throw new Error("Service worker not ready");const t=await e.pushManager.getSubscription();if(t){await t.unsubscribe();try{await p.unsubscribeNotification({endpoint:t.endpoint})}catch(r){console.error("Failed to unsubscribe from server:",r)}}}}updateSubscribeButtonVisibility(e){const t=document.getElementById("subscribe-btn"),r=document.getElementById("unsubscribe-btn");t&&r&&(t.style.display=e?"none":"block",r.style.display=e?"block":"none")}async switchCamera(){try{await k.switchCamera()}catch(e){console.error("Switch camera error:",e),this.view.showAlert(`Gagal mengganti kamera: ${e.message}`,"error")}}closeCamera(){k.stopCamera();const e=document.getElementById("camera-section");e&&(e.style.display="none")}addEventListeners(){const e=document.getElementById("subscribe-btn");e&&e.addEventListener("click",()=>this.handleSubscribeClick());const t=document.getElementById("unsubscribe-btn");t&&t.addEventListener("click",()=>this.handleUnsubscribeClick())}cleanup(){k.stopCamera()}}class ae extends m{constructor(e){super(e),this.setTitle("Tambah Cerita"),this.presenter=new re(this),this.photoPreviewUrl=null}async render(){if(!this.presenter.checkLoginStatus())return;this.clearContainer();const e=this.createPageContainer("add-story-page"),t=this.createPageHeader("Bagikan Cerita Baru","Ceritakan pengalaman belajar Kamu di Dicoding");e.appendChild(t);const r=document.createElement("div");r.className="form-container add-story-form",r.innerHTML=`
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
        `,e.appendChild(r),this.container.appendChild(e),Promise.resolve().then(()=>{this.initializeCamera(),this.initializeMap(),this.addEventListeners(),this.presenter.addEventListeners()})}async initializeCamera(){try{const e=document.getElementById("camera-preview");if(!e)throw new Error("Camera preview element not found");await k.initCamera(e)}catch(e){console.error("Camera initialization error:",e);const t=document.getElementById("camera-section");t&&(t.innerHTML=`
                <p>Tidak dapat mengakses kamera: ${e.message}</p>
            `)}}initializeMap(){if(!document.getElementById("map-container")){console.error("Map container not found");return}try{h.initMap("map-container",{center:[-2.548926,118.0148634],zoom:5,onClick:t=>this.presenter.handleMapClick(t),showLayerControl:!0}),Promise.resolve().then(()=>{h.updateMapSize()})}catch(t){console.error("Map initialization error:",t),this.showAlert(`Gagal memuat peta: ${t.message}`,"error")}}updateLocationInfo(e){const t=document.getElementById("location-info");if(t)if(e){const{lat:r,lon:a}=e;t.innerHTML=`
                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    Lokasi yang dipilih: ${r.toFixed(6)}, ${a.toFixed(6)}
                </p>
                <button type="button" id="clear-location-btn" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-times"></i> Hapus Lokasi
                </button>
            `;const n=document.getElementById("clear-location-btn");n&&n.addEventListener("click",()=>{this.presenter.clearLocation()})}else{t.innerHTML=`
                <p>Lokasi belum dipilih</p>
                <button type="button" id="get-current-location-btn" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-location-dot"></i> Gunakan Lokasi Saat Ini
                </button>
            `;const r=document.getElementById("get-current-location-btn");r&&r.addEventListener("click",()=>this.presenter.handleGetCurrentLocation())}}setPhotoPreview(e){if(this.photoPreviewUrl&&URL.revokeObjectURL(this.photoPreviewUrl),e){this.photoPreviewUrl=URL.createObjectURL(e);const t=document.getElementById("photo-preview");t&&(t.src=this.photoPreviewUrl)}else this.photoPreviewUrl=null}toggleCameraPreview(e){const t=document.getElementById("camera-section"),r=document.getElementById("photo-preview-section");t&&(t.style.display=e?"block":"none"),r&&(r.style.display=e?"none":"block")}showAlert(e,t,r=5e3){const a=document.getElementById("alert-container");a&&l.showAlert(e,t,a,r)}showLoading(e,t){const r=document.getElementById(e);return r?l.showButtonLoading(r,t):()=>{}}addEventListeners(){const e=document.getElementById("capture-btn");e&&e.addEventListener("click",()=>this.presenter.capturePhoto());const t=document.getElementById("switch-camera-btn");t&&t.addEventListener("click",()=>this.presenter.switchCamera());const r=document.getElementById("retake-btn");r&&r.addEventListener("click",()=>this.presenter.retakePhoto());const a=document.getElementById("get-current-location-btn");a&&a.addEventListener("click",()=>this.presenter.handleGetCurrentLocation());const n=document.getElementById("add-story-form");n&&n.addEventListener("submit",c=>{c.preventDefault();const d=document.getElementById("story-description"),u=d?d.value.trim():"";this.presenter.handleSubmit(u)});const o=document.getElementById("close-camera-btn");o&&o.addEventListener("click",()=>this.presenter.closeCamera());const s=document.getElementById("photo-upload");s&&s.addEventListener("change",c=>this.presenter.handleFileUpload(c.target.files[0]))}removeEventListeners(){this.presenter.cleanup(),this.photoPreviewUrl&&URL.revokeObjectURL(this.photoPreviewUrl)}resetForm(){const e=document.getElementById("add-story-form");e&&e.reset()}}class V{static async initForm(e){const t=document.getElementById(e.formId),r=document.getElementById(e.submitButtonId),a=document.getElementById(e.alertContainerId);t.addEventListener("submit",async n=>{n.preventDefault();let o=null;try{if(e.validate&&!e.validate())return;o=l.showButtonLoading(r,"Memproses...");const s=await e.onSubmit();s!=null&&s.successMessage&&l.showAlert(s.successMessage,"success",a),s!=null&&s.redirect&&setTimeout(async()=>{await y(s.redirect)},1500)}catch(s){l.showAlert(s.message,"error",a)}finally{o&&o()}})}}class ne{constructor(e){this.view=e}async login(e){try{const t=await p.login(e);return ee({userId:t.loginResult.userId,name:t.loginResult.name,token:t.loginResult.token}),K(),{success:!0,message:"Login berhasil! Mengalihkan ke beranda...",redirect:"/"}}catch(t){return{success:!1,message:t.message||"Login gagal. Silakan coba lagi."}}}validateForm(e,t){return!e||!t?{valid:!1,message:"Email dan password harus diisi"}:{valid:!0}}}class oe extends m{constructor(e){super(e),this.setTitle("Masuk"),this.presenter=new ne(this)}async render(){this.clearContainer();const e=this.createPageContainer("login-page");e.innerHTML=`
      <div class="form-container">
        <h2 class="form-title">Masuk ke Dicoding Story</h2>
        <div id="alert-container"></div>
        
        <form id="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-input" 
              placeholder="Masukkan email Anda" 
              required
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              class="form-input" 
              placeholder="Masukkan password Anda" 
              required
              autocomplete="current-password"
              minlength="8"
            >
          </div>
          
          <button type="submit" id="login-button" class="btn btn-primary btn-block">
            Masuk
          </button>
        </form>
        
        <p class="auth-alternative">
          Belum memiliki akun? 
          <a href="#/register" class="auth-link">Daftar sekarang</a>
        </p>
      </div>
    `,this.container.appendChild(e),this.addEventListeners()}addEventListeners(){V.initForm({formId:"login-form",submitButtonId:"login-button",alertContainerId:"alert-container",validate:()=>{const e=document.getElementById("email").value.trim(),t=document.getElementById("password").value,r=this.presenter.validateForm(e,t);return r.valid?!0:(l.showAlert(r.message,"error","alert-container"),!1)},onSubmit:async()=>{const e={email:document.getElementById("email").value.trim(),password:document.getElementById("password").value},t=await this.presenter.login(e);if(!t.success)throw new Error(t.message);return{successMessage:t.message,redirect:t.redirect}}})}}class se{constructor(e){this.view=e}async register(e){try{return{success:!0,message:"Pendaftaran berhasil! Mengalihkan ke halaman login...",redirect:"/login",data:await p.register(e)}}catch(t){return{success:!1,message:t.message||"Terjadi kesalahan saat mendaftar",data:null}}}validateForm(e){const{name:t,email:r,password:a,confirmPassword:n}=e;return!t||!r||!a||!n?{isValid:!1,message:"Semua kolom harus diisi"}:a.length<8?{isValid:!1,message:"Password harus minimal 8 karakter"}:a!==n?{isValid:!1,message:"Password tidak cocok"}:{isValid:!0,message:""}}}class ce extends m{constructor(e){super(e),this.setTitle("Daftar"),this.presenter=new se(this)}async render(){this.clearContainer();const e=this.createPageContainer("register-page");e.innerHTML=`
      <div class="form-container">
        <h2 class="form-title">Daftar Akun Baru</h2>
        <div id="alert-container"></div>
        
        <form id="register-form">
          <div class="form-group">
            <label for="name" class="form-label">Nama</label>
            <input 
              type="text" 
              id="name" 
              class="form-input" 
              placeholder="Masukkan nama Anda" 
              required
              autocomplete="name"
            >
          </div>
        
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-input" 
              placeholder="Masukkan email Anda" 
              required
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              class="form-input" 
              placeholder="Minimal 8 karakter" 
              required
              autocomplete="new-password"
              minlength="8"
            >
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Konfirmasi Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              class="form-input" 
              placeholder="Konfirmasi password Anda" 
              required
              autocomplete="new-password"
              minlength="8"
            >
          </div>
          
          <button type="submit" id="register-button" class="btn btn-primary btn-block">
            Daftar
          </button>
        </form>
        
        <p class="auth-alternative">
          Sudah memiliki akun? 
          <a href="#/login" class="auth-link">Masuk sekarang</a>
        </p>
      </div>
    `,this.container.appendChild(e),this.addEventListeners()}addEventListeners(){V.initForm({formId:"register-form",submitButtonId:"register-button",alertContainerId:"alert-container",validate:()=>{const e={name:document.getElementById("name").value.trim(),email:document.getElementById("email").value.trim(),password:document.getElementById("password").value,confirmPassword:document.getElementById("confirmPassword").value},t=this.presenter.validateForm(e);return t.isValid?!0:(l.showAlert(t.message,"error",document.getElementById("alert-container")),!1)},onSubmit:async()=>{const e={name:document.getElementById("name").value.trim(),email:document.getElementById("email").value.trim(),password:document.getElementById("password").value},t=await this.presenter.register(e);return t.success?{successMessage:t.message,redirect:t.redirect}:(l.showAlert(t.message,"error",document.getElementById("alert-container")),{})}})}}const x=(i,e)=>e.some(t=>i instanceof t);let U,z;function le(){return U||(U=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function de(){return z||(z=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const P=new WeakMap,M=new WeakMap,C=new WeakMap;function he(i){const e=new Promise((t,r)=>{const a=()=>{i.removeEventListener("success",n),i.removeEventListener("error",o)},n=()=>{t(v(i.result)),a()},o=()=>{r(i.error),a()};i.addEventListener("success",n),i.addEventListener("error",o)});return C.set(e,i),e}function ue(i){if(P.has(i))return;const e=new Promise((t,r)=>{const a=()=>{i.removeEventListener("complete",n),i.removeEventListener("error",o),i.removeEventListener("abort",o)},n=()=>{t(),a()},o=()=>{r(i.error||new DOMException("AbortError","AbortError")),a()};i.addEventListener("complete",n),i.addEventListener("error",o),i.addEventListener("abort",o)});P.set(i,e)}let A={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return P.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return v(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function q(i){A=i(A)}function pe(i){return de().includes(i)?function(...e){return i.apply(T(this),e),v(this.request)}:function(...e){return v(i.apply(T(this),e))}}function me(i){return typeof i=="function"?pe(i):(i instanceof IDBTransaction&&ue(i),x(i,le())?new Proxy(i,A):i)}function v(i){if(i instanceof IDBRequest)return he(i);if(M.has(i))return M.get(i);const e=me(i);return e!==i&&(M.set(i,e),C.set(e,i)),e}const T=i=>C.get(i);function ge(i,e,{blocked:t,upgrade:r,blocking:a,terminated:n}={}){const o=indexedDB.open(i,e),s=v(o);return r&&o.addEventListener("upgradeneeded",c=>{r(v(o.result),c.oldVersion,c.newVersion,v(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),s.then(c=>{n&&c.addEventListener("close",()=>n()),a&&c.addEventListener("versionchange",d=>a(d.oldVersion,d.newVersion,d))}).catch(()=>{}),s}const fe=["get","getKey","getAll","getAllKeys","count"],be=["put","add","delete","clear"],I=new Map;function F(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(I.get(e))return I.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,a=be.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(a||fe.includes(t)))return;const n=async function(o,...s){const c=this.transaction(o,a?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(s.shift())),(await Promise.all([d[t](...s),a&&c.done]))[0]};return I.set(e,n),n}q(i=>({...i,get:(e,t,r)=>F(e,t)||i.get(e,t,r),has:(e,t)=>!!F(e,t)||i.has(e,t)}));const ve=["continue","continuePrimaryKey","advance"],G={},D=new WeakMap,_=new WeakMap,ye={get(i,e){if(!ve.includes(e))return i[e];let t=G[e];return t||(t=G[e]=function(...r){D.set(this,_.get(this)[e](...r))}),t}};async function*we(...i){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...i)),!e)return;e=e;const t=new Proxy(e,ye);for(_.set(t,e),C.set(t,T(e));e;)yield t,e=await(D.get(t)||e.continue()),D.delete(t)}function O(i,e){return e===Symbol.asyncIterator&&x(i,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&x(i,[IDBIndex,IDBObjectStore])}q(i=>({...i,get(e,t,r){return O(e,t)?we:i.get(e,t,r)},has(e,t){return O(e,t)||i.has(e,t)}}));const ke="dicoding-story-db",Ee=2,b="saved-stories",B=ge(ke,Ee,{upgrade:(i,e)=>{i.objectStoreNames.contains(b)||i.createObjectStore(b,{keyPath:"id"})}}),Se=async i=>{if(!i.id)throw new Error("ID cerita tidak valid");const t=(await B).transaction(b,"readwrite");return await t.objectStore(b).put(i),t.complete},Le=async i=>(await B).get(b,i),Ce=async()=>(await B).getAll(b),J=async i=>{const t=(await B).transaction(b,"readwrite");return await t.objectStore(b).delete(i),t.complete};class Be{constructor({view:e,storyId:t}){this.view=e,this.storyId=t,this.story=null}async init(){this.view.showLoading();try{const e=await p.getStoryDetail(this.storyId);if(this.story=e.story,this.story)this.view.renderStory(this.story),this.story.lat&&this.story.lon&&this.view.renderMap(this.story.lat,this.story.lon,this.story.name,this.story.description),this.checkIfStorySaved();else throw new Error("Data cerita tidak ditemukan")}catch(e){this.view.showError(`Gagal memuat cerita: ${e.message}`)}}async saveStory(){if(!this.story)return;const e={id:this.story.id,name:this.story.name,description:this.story.description,photoUrl:this.story.photoUrl,createdAt:this.story.createdAt,lat:this.story.lat,lon:this.story.lon};try{await Se(e),this.view.showAlert("Cerita berhasil disimpan","success"),await this.checkIfStorySaved()}catch(t){console.error("Gagal menyimpan Cerita:",t),this.view.showAlert("Gagal menyimpan cerita","error")}}async removeStory(){try{await J(this.story.id),this.view.showAlert("Cerita berhasil dihapus dari bookmark","success"),await this.checkIfStorySaved()}catch(e){console.error("Gagal menghapus Cerita:",e),this.view.showAlert("Gagal menghapus cerita dari bookmark","error")}}async checkIfStorySaved(){try{const e=await Le(this.story.id);this.updateSaveButtonState(!!e)}catch(e){console.error("Gagal memeriksa status cerita:",e),this.view.showAlert("Gagal memuat data penyimpanan lokal","error"),this.updateSaveButtonState(!1)}}updateSaveButtonState(e){const t=document.getElementById("save-story");t&&(t.innerHTML=e?'<i class="fa-solid fa-bookmark"></i> Hapus Cerita ':'<i class="fa-solid fa-bookmark"></i> Simpan Cerita',t.classList.toggle("saved",e))}handleShareWhatsApp(){var r;const e=encodeURIComponent(window.location.href),t=((r=this.story)==null?void 0:r.name)||"Pengguna";window.open(`https://api.whatsapp.com/send?text=Lihat cerita dari ${t} di Dicoding Story: ${e}`,"_blank")}handleShareFacebook(){const e=encodeURIComponent(window.location.href);window.open(`https://www.facebook.com/sharer/sharer.php?u=${e}`,"_blank")}async handleCopyUrl(e){try{await navigator.clipboard.writeText(window.location.href),this.view.showCopySuccess(e)}catch(t){console.error("Gagal menyalin:",t),this.view.showCopyError()}}}class Me extends m{constructor(e){super(e),this.storyId=e.params.id,this.story=null,this.presenter=new Be({view:this,storyId:this.storyId})}showAlert(e,t){l.showAlert(e,t,this.container,3e3)}async render(){if(!E()){y("/login");return}this.clearContainer(),this.showLoading(),await this.presenter.init()}renderStory(e){if(this.story=e,!this.story||!this.story.name){this.showError("Data cerita tidak valid");return}this.setTitle(`Cerita dari ${this.story.name}`),this.clearContainer();const t=this.createPageContainer("detail-page"),r=this.createStoryDetail();t.appendChild(r),this.container.appendChild(t);const a=r.querySelector(".back-link");a&&a.addEventListener("click",n=>{n.preventDefault(),y("/")}),this.addEventListeners(),this.addStyles()}renderMap(e,t,r,a){h.initMap("story-map-container",{center:[e,t],zoom:15,showLayerControl:!0}),h.addMarker(e,t,{title:r,description:l.truncateText(a,100)})}createStoryDetail(){if(!this.story)return document.createElement("div");const e=document.createElement("article");e.className="story-detail";const t=l.formatDate(this.story.createdAt),r=this.story.lat&&this.story.lon;return e.innerHTML=`
      <div class="story-header">
        <a href="#/" class="back-link">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </a>
        <h2 class="story-title">Cerita dari ${this.story.name}</h2>
                <button id="save-story" class="btn-futuristic btn-save-story">
                    <i class="fa-solid fa-bookmark"></i> Simpan Cerita
                </button>
      </div>
      
      <div class="story-meta">
        <span class="story-date">
          <i class="fa-regular fa-calendar"></i> ${t}
        </span>
        ${r?`
          <span class="story-location">
            <i class="fa-solid fa-location-dot"></i> Memiliki Lokasi
          </span>
        `:""}
      </div>
      
      <div class="story-content">
        <img src="${this.story.photoUrl}" alt="Foto cerita dari ${this.story.name}" class="story-image">
        
        <p class="story-description">${this.story.description}</p>
      </div>
      
      ${r?`
        <div class="story-map-section">
          <div class="section-header-futuristic">
            <h3 class="section-title-futuristic">Lokasi</h3>
            <div class="section-line"></div>
          </div>
          
          <div class="location-futuristic-card">
            <div class="location-futuristic-header">
              <div class="location-icon-container">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <h4 class="location-futuristic-title">Koordinat Titik Lokasi</h4>
            </div>
            
            <div class="location-coordinates-container">
              <div class="coordinate-item">
                <div class="coordinate-label">Latitude</div>
                <div class="coordinate-value">${this.story.lat.toFixed(6)}</div>
              </div>
              <div class="coordinate-item">
                <div class="coordinate-label">Longitude</div>
                <div class="coordinate-value">${this.story.lon.toFixed(6)}</div>
              </div>
            </div>
            
            <div class="location-info-visual">
              <div class="pulse-effect"></div>
              <i class="fa-solid fa-satellite-dish"></i>
              <span class="signal-text">Sinyal GPS Terdeteksi</span>
            </div>
          </div>
          
          <div id="story-map-container" class="map-container-futuristic"></div>
        </div>
      `:""}
      
      <div class="story-share-section">
            <div class="section-header-futuristic">
                <h3 class="section-title-futuristic">Bagikan</h3>
                <div class="section-line"></div>
            </div>
            <div class="share-buttons-futuristic">
                <button id="share-whatsapp" class="btn-futuristic btn-share">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
                <button id="share-facebook" class="btn-futuristic btn-share">
                    <i class="fa-brands fa-facebook"></i> Facebook
                </button>
                <button id="share-copy" class="btn-futuristic btn-share">
                    <i class="fa-solid fa-copy"></i> Salin Tautan
                </button>

            </div>
        </div>
    `,e}addStyles(){if(!document.getElementById("futuristic-detail-styles")){const e=document.createElement("style");e.id="futuristic-detail-styles",e.textContent=`
          .section-header-futuristic {
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            position: relative;
          }
          
          .section-title-futuristic {
            font-size: 2.2rem;
            font-weight: 600;
            color: #2563eb;
            margin-right: 1.5rem;
            position: relative;
            z-index: 1;
          }
          
          .section-line {
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, #2563eb, rgba(37, 99, 235, 0.1));
            position: relative;
          }
          
          .section-line::after {
            content: '';
            position: absolute;
            right: 0;
            top: -3px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #2563eb;
          }
          
          .location-futuristic-card {
            background: linear-gradient(135deg, #ffffff, #f1f5f9);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05),
                        0 8px 10px -6px rgba(0, 0, 0, 0.01);
            position: relative;
            overflow: hidden;
          }
          
          .location-futuristic-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
            z-index: 0;
          }
          
          .location-futuristic-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
            z-index: 1;
            position: relative;
          }
          
          .location-icon-container {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
          }
          
          .location-icon-container i {
            font-size: 1.8rem;
            color: white;
          }
          
          .location-futuristic-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
          }
          
          .location-coordinates-container {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            z-index: 1;
            position: relative;
          }
          
          .coordinate-item {
            flex: 1;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            padding: 1.2rem;
            border: 1px solid rgba(37, 99, 235, 0.1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
            backdrop-filter: blur(5px);
          }
          
          .coordinate-label {
            font-size: 1.4rem;
            color: #64748b;
            margin-bottom: 0.8rem;
          }
          
          .coordinate-value {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1e293b;
            font-family: 'Consolas', monospace;
            text-shadow: 0 0 2px rgba(37, 99, 235, 0.1);
          }
          
          .location-info-visual {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: rgba(243, 244, 246, 0.7);
            border-radius: 8px;
            margin-top: 1rem;
            position: relative;
            z-index: 1;
          }
          
          .pulse-effect {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.2);
            position: relative;
            margin-right: 1.5rem;
          }
          
          .pulse-effect::before,
          .pulse-effect::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.4);
            animation: pulse 2s infinite;
            z-index: -1;
          }
          
          .pulse-effect::after {
            animation-delay: 0.5s;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.7;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
          
          .signal-text {
            color: #0f766e;
            font-size: 1.4rem;
            font-weight: 500;
            margin-left: 0.8rem;
          }
          
          .location-info-visual i {
            color: #0f766e;
            font-size: 1.6rem;
          }
          
          .map-container-futuristic {
            height: 350px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(37, 99, 235, 0.1);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05),
                        0 4px 6px -2px rgba(0, 0, 0, 0.01);
            position: relative;
          }
          
          .map-container-futuristic::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-radius: 12px;
            background: linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa, #93c5fd) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
            pointer-events: none;
            z-index: 10;
          }
          
          .share-buttons-futuristic {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          
          .btn-futuristic {
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .btn-share {
            background: linear-gradient(135deg, #f1f5f9, #ffffff);
            color: #1e293b;
            border: 1px solid rgba(37, 99, 235, 0.1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          
          .btn-share:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #ffffff, #f8fafc);
          }
          
          .btn-share:active {
            transform: translateY(0);
          }

          .btn-save-story {
            background-color: #4CAF50; /* Green */
            color: white;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 1em;
            transition: background-color 0.3s;
          }

          .btn-save-story.saved {
            background-color: #f44336; 
            color: white;
          }

          .btn-save-story:hover {
            background-color:rgb(69, 21, 227); 
          }
          
          @media (max-width: 768px) {
            .location-coordinates-container {
              flex-direction: column;
              gap: 1rem;
            }
          }
        `,document.head.appendChild(e)}}addEventListeners(){super.addEventListeners();const e=document.getElementById("save-story");e&&e.addEventListener("click",()=>{e.classList.contains("saved")?this.presenter.removeStory():this.presenter.saveStory()}),[{id:"share-whatsapp",url:(r,a)=>`https://api.whatsapp.com/send?text=Lihat cerita dari ${a} di Dicoding Story: ${r}`},{id:"share-facebook",url:r=>`https://www.facebook.com/sharer/sharer.php?u=${r}`},{id:"share-copy",action:"copy"}].forEach(({id:r,url:a,action:n})=>{const o=document.getElementById(r);o&&o.addEventListener("click",()=>{var d;const s=encodeURIComponent(window.location.href),c=((d=this.story)==null?void 0:d.name)||"Pengguna";if(n==="copy")this.handleCopyUrl(o);else{const u=typeof a=="function"?a(s,c):a;window.open(u,"_blank")}})})}showCopySuccess(e){const t=e.innerHTML;e.innerHTML='<i class="fa-solid fa-check"></i> Disalin!',setTimeout(()=>{e.innerHTML=t},2e3)}showCopyError(){l.showAlert("Gagal menyalin tautan","error")}}class Ie{constructor(e){this.view=e,this.apiService=p,this.stories=[],this.page=1,this.size=12,this.hasMoreStories=!0}async loadInitialStories(){try{this.view.showLoading();const e=await this.apiService.getAllStories({page:this.page,size:this.size,location:1});this.stories=e.listStory||[],this.hasMoreStories=this.stories.length===this.size,this.view.displayStories(this.stories),this.stories.length===0&&this.view.showNoContent("Belum ada cerita yang tersedia."),this.hasMoreStories&&this.view.showLoadMoreButton()}catch(e){this.view.showError(`Gagal memuat cerita: ${e.message}`)}}async loadMoreStories(){try{this.page+=1;const t=(await this.apiService.getAllStories({page:this.page,size:this.size,location:1})).listStory||[];return this.stories=[...this.stories,...t],this.hasMoreStories=t.length===this.size,this.view.displayStories(this.stories),this.hasMoreStories||this.view.hideLoadMoreButton(),!0}catch(e){return this.view.showErrorMessage(`Gagal memuat cerita: ${e.message}`),!1}}handleSearch(e){const t=this.stories.filter(r=>r.name.toLowerCase().includes(e)||r.description.toLowerCase().includes(e)).map(r=>r.id);this.view.filterStoriesByIds(t)}handleSort(e){let t=[...this.stories];e==="newest"?t.sort((r,a)=>new Date(a.createdAt)-new Date(r.createdAt)):t.sort((r,a)=>new Date(r.createdAt)-new Date(a.createdAt)),this.view.displayStories(t)}}class xe extends m{constructor(e){super(e),this.setTitle("Jelajahi Cerita"),this.presenter=new Ie(this)}async render(){this.clearContainer();const e=this.createPageContainer("explore-page"),t=this.createPageHeader("Jelajahi Semua Cerita","Temukan cerita menarik dari komunitas Dicoding");e.appendChild(t);const r=this.createFilterSection();e.appendChild(r);const a=document.createElement("div");a.id="stories-container",a.className="stories-container",e.appendChild(a);const n=document.createElement("div");n.id="load-more-container",n.className="load-more-container",n.style.display="none",e.appendChild(n),this.container.appendChild(e),this.addEventListeners(),await this.presenter.loadInitialStories()}createFilterSection(){const e=document.createElement("div");e.className="filter-section",e.innerHTML=`
    <div class="search-container">
      <input 
        type="text" 
        id="search-input" 
        class="search-input" 
        placeholder="Cari cerita..."
        aria-label="Cari cerita"
      >
      <button id="search-button" class="search-button" aria-label="Tombol cari">
        <i class="fa-solid fa-search"></i>
      </button>
    </div>
    
    <div class="filter-options">
      <select id="sort-select" class="filter-select" aria-label="Urutkan cerita">
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>
    `;const t=e.querySelector("#sort-select");return t.style.appearance="none",t.style.width="100%",t.style.padding="10px 16px",t.style.fontSize="14px",t.style.border="1px solid #e0e0e0",t.style.borderRadius="8px",t.style.backgroundColor="#fff",t.style.backgroundImage=`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23888" d="M6 9L1 4h10z"/></svg>')`,t.style.backgroundRepeat="no-repeat",t.style.backgroundPosition="right 12px center",t.style.backgroundSize="10px",t.style.color="#333",t.style.cursor="pointer",t.style.outline="none",t.style.transition="all 0.3s ease",e}createLoadMoreButton(){const e=document.createElement("button");return e.id="load-more-button",e.className="btn btn-secondary",e.textContent="Muat Lebih Banyak",e}showLoading(){const e=document.getElementById("stories-container");e&&(e.innerHTML=`
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
          <p>Memuat data...</p>
        </div>
      `)}displayStories(e){const t=document.getElementById("stories-container");t&&l.renderStoryGrid(e,t)}showLoadMoreButton(){const e=document.getElementById("load-more-container");e&&(e.innerHTML="",e.appendChild(this.createLoadMoreButton()),e.style.display="flex")}hideLoadMoreButton(){const e=document.getElementById("load-more-container");e&&(e.style.display="none")}showErrorMessage(e){l.showAlert(e,"error",document.getElementById("explore-page"))}filterStoriesByIds(e){const t=document.getElementById("stories-container");t&&t.querySelectorAll(".card").forEach(a=>{const n=a.getAttribute("data-story-id");e.includes(n)?a.style.display="":a.style.display="none"})}addEventListeners(){document.addEventListener("click",a=>{if(a.target&&a.target.id==="load-more-button"){const n=a.target,o=l.showButtonLoading(n,"Memuat...");this.presenter.loadMoreStories().finally(()=>{o()})}});const e=document.getElementById("search-input"),t=document.getElementById("search-button");if(e&&t){const a=()=>{const n=e.value.toLowerCase().trim();this.presenter.handleSearch(n)};t.addEventListener("click",a),e.addEventListener("keyup",n=>{n.key==="Enter"&&a()})}const r=document.getElementById("sort-select");r&&r.addEventListener("change",()=>{const a=r.value;this.presenter.handleSort(a)})}}class Pe{constructor(e){this.view=e,this.stories=[]}async loadStories(){try{if(!p||typeof p.getAllStories!="function")throw console.error("API Service tidak tersedia atau getAllStories bukan fungsi",p),new Error("API Service tidak tersedia");const e=await p.getAllStories({size:10,location:1});return this.stories=e.listStory||[],this.view.displayStories(this.stories),this.stories}catch(e){throw console.error("Error loading stories:",e),e}}}class R extends m{constructor(e){super(e),this.setTitle("Beranda"),this.presenter=new Pe(this)}showLoading(){this.loadingElement=document.createElement("div"),this.loadingElement.className="loading-indicator",this.loadingElement.textContent="Memuat...",this.container.appendChild(this.loadingElement)}hideLoading(){this.loadingElement&&this.loadingElement.remove()}async render(){this.clearContainer(),this.showLoading();const e=this.createPageContainer("home-page"),t=this.createHeroSection();e.appendChild(t);const r=this.createStoriesSection();e.appendChild(r),this.container.appendChild(e);try{await this.presenter.loadStories(),this.addEventListeners(),this.hideLoading()}catch(a){this.hideLoading(),this.showError(`Gagal memuat cerita: ${a.message}`)}}displayStories(e){const t=document.querySelector(".stories-section");if(t)if(e.length>0){const r=document.createElement("div");r.className="stories-container",t.appendChild(r),l.renderStoryGrid(e,r)}else{const r=document.createElement("div");r.className="no-content",r.innerHTML="<p>Belum ada cerita yang dibagikan.</p>",t.appendChild(r)}}createHeroSection(){const e=document.createElement("section");return e.className="hero-section",e.innerHTML=`
      <div class="hero-content">
        <h2 class="hero-title">Selamat Datang di Dicoding Story</h2>
        <p class="hero-description">
          Platform berbagi cerita untuk menyelesaikan submission Belajar Pengembangan Web Intermediate
        </p>
        <div class="hero-buttons">
          <a href="#/add" class="btn btn-primary">Bagikan Cerita</a>
          <a href="#/explore" class="btn btn-secondary">Jelajahi Cerita</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="./src/public/hero-image.png" alt="Ilustrasi Berbagi Cerita" class="hero-illustration">
      </div>
    `,e}createStoriesSection(){const e=document.createElement("section");e.className="stories-section";const t=document.createElement("div");return t.className="section-header",t.innerHTML=`
      <h2 class="section-title">Cerita Terbaru</h2>
      <a href="#/explore" class="section-link">Lihat Semua</a>
    `,e.appendChild(t),e}addEventListeners(){if(!E()){const e=document.querySelector(".hero-buttons .btn-primary");e&&e.addEventListener("click",t=>{t.preventDefault(),y("/login")})}}}class Ae{constructor(e){this.view=e,this.stories=[]}async loadStories(){try{const e=await p.getAllStories({size:100,location:1});this.stories=this.processStories(e.listStory||[]),this.view.showStories(this.stories)}catch(e){this.view.showError(`Gagal memuat cerita: ${e.message}`)}}processStories(e){return e.filter(t=>t.lat!==null&&t.lon!==null&&!isNaN(t.lat)&&!isNaN(t.lon)).map(t=>({...t,lat:parseFloat(t.lat),lon:parseFloat(t.lon)}))}filterStories(e,t){let r=[...this.stories];return e&&(r=r.filter(a=>{const n=a.name.toLowerCase(),o=a.description.toLowerCase();return n.includes(e)||o.includes(e)})),t==="recent"&&(r=r.sort((a,n)=>new Date(n.createdAt)-new Date(a.createdAt)).slice(0,10)),r}}class Te extends m{constructor(e){super(e),this.setTitle("Map Cerita"),this.presenter=new Ae(this)}async render(){this.clearContainer(),this.showLoading();const e=this.createPageContainer("map-page");this.container.appendChild(e),await this.presenter.loadStories()}showStories(e){this.clearContainer();const t=this.createPageContainer("map-page"),r=this.createPageHeader("Map Cerita","Lihat lokasi cerita dari pengguna Dicoding Story"),a=this.createMapContent();t.append(r,a),this.container.appendChild(t),this.initializeMap(e),this.addEventListeners()}showError(e){this.clearContainer(),super.showError(e)}createMapContent(){const e=document.createElement("section");return e.className="map-content",e.innerHTML=`
      <div class="map-controls">
        <div class="map-search">
          <input 
            type="text" 
            id="map-search-input" 
            class="search-input" 
            placeholder="Cari cerita pada peta..."
            aria-label="Cari cerita pada peta"
          >
        </div>
        <div class="map-filters">
          <select id="map-filter-select" class="filter-select" aria-label="Filter cerita pada peta">
            <option value="all">Semua Cerita</option>
            <option value="recent">Cerita Terbaru</option>
          </select>
        </div>
      </div>
      
      <div id="full-map-container" class="map-container map-full"></div>
      
      <div class="story-preview" id="story-preview">
        <p class="story-preview-hint">Klik pada marker untuk melihat detail cerita</p>
      </div>
    `,e}initializeMap(e){if(h.initMap("full-map-container",{center:[-2.548926,118.0148634],zoom:5,showLayerControl:!0}),e.length>0)this.addStoryMarkers(e);else{const t=document.getElementById("story-preview");t.innerHTML=`
        <div class="no-content">
          <p>Belum ada cerita dengan lokasi</p>
        </div>
      `}this.addEventListeners()}addStoryMarkers(e){h.clearMarkers(),console.log("Stories to add markers:",e),e.forEach(r=>{r.lat&&r.lon&&h.addMarker(r.lat,r.lon,{title:r.name,description:l.truncateText(r.description,100)}).on("click",()=>{this.showStoryPreview(r)})});const t=L.featureGroup(h.markers);h.markers.length>0&&h.map.fitBounds(t.getBounds(),{padding:[30,30]})}showStoryPreview(e){const t=document.getElementById("story-preview");t.innerHTML=`
      <div class="story-preview-card">
        <div class="preview-header">
          <h3 class="preview-title">${e.name}</h3>
          <span class="preview-date">${l.formatDate(e.createdAt)}</span>
        </div>
        
        <div class="preview-content">
          <img src="${e.photoUrl}" alt="Foto cerita dari ${e.name}" class="preview-image">
          <p class="preview-description">${e.description}</p>
        </div>
        
        <a href="#/detail/${e.id}" class="btn btn-primary btn-sm preview-button">
          Lihat Detail
        </a>
      </div>
    `}addEventListeners(){const e=document.getElementById("map-search-input"),t=document.getElementById("map-filter-select");e==null||e.addEventListener("input",r=>{const a=this.presenter.filterStories(r.target.value.toLowerCase().trim(),t.value);this.addStoryMarkers(a)}),t==null||t.addEventListener("change",r=>{const a=this.presenter.filterStories(e.value.toLowerCase().trim(),r.target.value);this.addStoryMarkers(a)})}}class De extends m{constructor(e){super(e),this.setTitle("Halaman Tidak Ditemukan")}async render(){this.clearContainer();const e=this.createPageContainer("not-found-page");e.innerHTML=`
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
          <img src="./src/public/not-found.webp" alt="Ilustrasi Halaman Tidak Ditemukan" class="not-found-illustration">
        </div>
      </div>
    `,this.container.appendChild(e)}}function Y(i){const e=i.split("/");return{resource:e[1]||null,id:e[2]||null}}function $e(i){let e="";return i.resource&&(e=e.concat(`/${i.resource}`)),i.id&&(e=e.concat("/:id")),e||"/"}function Q(){return location.hash.replace("#","")||"/"}function He(){const i=Q(),e=Y(i);return $e(e)}function Ne(){const i=Q();return Y(i)}class Ue extends m{constructor(e){super(e),this.setTitle("Cerita Tersimpan")}async render(){this.clearContainer(),this.showLoading();try{const e=await Ce();this.renderStories(e)}catch(e){this.showError(`Gagal memuat cerita tersimpan: ${e.message}`)}this.addEventListeners()}renderStories(e){this.clearContainer();const t=this.createPageContainer("saved-stories-page"),r=document.createElement("div");r.className="saved-stories-container",e.length===0?r.innerHTML="<p class='no-saved-stories'>Belum ada cerita yang disimpan.</p>":e.forEach(a=>{const n=this.createStoryElement(a);r.appendChild(n)}),t.appendChild(r),this.container.appendChild(t),this.addStyles()}createStoryElement(e){const t=document.createElement("article");return t.className="saved-story-item",t.innerHTML=`
            <img src="${e.photoUrl}" alt="Foto cerita dari ${e.name}" class="saved-story-image">
            <div class="saved-story-info">
                <h2 class="saved-story-title">${e.name}</h2>
                <p class="saved-story-description">${l.truncateText(e.description,100)}</p>
                <div class="saved-story-actions">
                    <button class="btn-primary btn-view-detail" data-id="${e.id}">Lihat Detail</button>
                    <button class="btn-danger btn-delete-story" data-id="${e.id}">Hapus</button>
                </div>
            </div>
        `,t}addEventListeners(){document.querySelectorAll(".btn-view-detail").forEach(r=>{r.addEventListener("click",()=>{const a=r.dataset.id;y(`/detail/${a}`)})}),document.querySelectorAll(".btn-delete-story").forEach(r=>{r.addEventListener("click",async()=>{const a=r.dataset.id;try{await J(a),this.showAlert("Cerita berhasil dihapus.","success"),await this.render()}catch{this.showAlert("Gagal menghapus cerita.","error")}})})}addStyles(){if(!document.getElementById("saved-stories-styles")){const e=document.createElement("style");e.id="saved-stories-styles",e.textContent=`
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
            `,document.head.appendChild(e)}}showLoading(){super.showLoading()}hideLoading(){super.hideLoading()}showError(e){super.showError(e)}showAlert(e,t){l.showAlert(e,t)}}const j={"/":{component:R},"/home":{component:R},"/add":{component:ae},"/login":{component:oe},"/register":{component:ce},"/detail/:id":{component:Me},"/explore":{component:xe},"/saved":{component:Ue},"/map":{component:Te}};function y(i){window.history.pushState(null,null,i.startsWith("/")?`#${i}`:`#/${i}`),window.dispatchEvent(new Event("hashchange"))}function ze(){const i=He(),e=Ne();if(i==="/detail/:id"&&e.id)return{component:j[i].component,params:{id:e.id}};const t=j[i];return t?{component:t.component,params:{}}:{component:De,params:{}}}const Fe={async init(){this.initComponents(),this.registerServiceWorker(),this.handleRouteChange(),window.addEventListener("hashchange",()=>{this.handleRouteChange(),k.stopCamera()})},initComponents(){l.initMobileMenu(),K()},async handleRouteChange(){const i=document.getElementById("content");if(!i){console.error("Content element not found");return}i.innerHTML="";const e=document.createElement("div");e.className="loading-indicator",e.innerHTML=`
      <div class="loading-spinner"></div>
      <p>Memuat halaman...</p>
    `,i.appendChild(e);try{const t=ze();if(!t){i.innerHTML="<p>Halaman tidak ditemukan</p>";return}await new t.component({container:i,params:t.params}).render(),window.scrollTo(0,0)}catch(t){console.error("Error rendering page:",t),i.innerHTML=`
        <div class="error-container">
          <h3>Error</h3>
          <p>${t.message||"Terjadi kesalahan saat memuat halaman"}</p>
          <button onclick="window.location.reload()" class="btn btn-primary">Muat Ulang</button>
        </div>
      `}},async registerServiceWorker(){if("serviceWorker"in navigator)try{const i=await navigator.serviceWorker.register("/service-worker.js");console.log("Service Worker registered with scope:",i.scope)}catch(i){console.error("Service Worker registration failed:",i)}}};document.addEventListener("DOMContentLoaded",()=>{Fe.init()});
