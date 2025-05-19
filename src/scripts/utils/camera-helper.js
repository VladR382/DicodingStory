class CameraHelper {
    constructor() {
        this.videoElement = null;
        this.stream = null;
        this.facingMode = "environment";
        this.constraints = {
            video: {
                facingMode: this.facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false,
        };
    }

    async initCamera(videoElement) {
        try {
            this.videoElement = videoElement;

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API is not supported in your browser");
            }

            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.videoElement.srcObject = this.stream;

            await new Promise((resolve, reject) => {
                this.videoElement.onloadedmetadata = resolve;
                this.videoElement.onerror = reject;
            });

            await this.videoElement.play();
        } catch (error) {
            this.stopCamera();
            throw error;
        }
    }

    async switchCamera() {
        this.stopCamera();
        this.facingMode = this.facingMode === "environment" ? "user" : "environment";
        this.constraints.video.facingMode = this.facingMode;
        return this.initCamera(this.videoElement);
    }

    takePhoto(targetWidth = 530, quality = 0.7) {
        return new Promise((resolve) => {
            const video = this.videoElement;
            const aspectRatio = video.videoWidth / video.videoHeight;

            const width = Math.min(targetWidth, video.videoWidth);
            const height = width / aspectRatio;

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            context.drawImage(
                video,
                0, 0, video.videoWidth, video.videoHeight,
                0, 0, width, height
            );

            canvas.toBlob(
                (blob) => resolve({ blob, width, height }), 
                "image/jpeg",
                quality
            );
        });
    }

    stopCamera() {
        this.stream?.getTracks().forEach(track => {
            track.stop();
            this.stream.removeTrack(track);
        });

        if (this.videoElement) {
            this.videoElement.srcObject = null;
            if (this.videoElement.src) {
                window.URL.revokeObjectURL(this.videoElement.src);
            }
            this.videoElement.src = null;
        }

        this.stream = null;
    }
}

export default new CameraHelper();