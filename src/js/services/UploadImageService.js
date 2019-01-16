import Framework7Service from "./Framework7Service";
import GalleryPhotoActionCreators from "../actions/GalleryPhotoActionCreators";

class UploadImageService {

    uploadPhoto(e, userId) {
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if (typeof files[0] !== 'undefined') {
            if (!this.isValidMimetype(files[0].type)) {
                Framework7Service.nekunoApp().alert('Invalid image');
                return;
            }
            this.savePhoto(userId, files[0]);
        }
    }

    savePhoto(userId, file) {
        const MAX_WIDTH = 2048;
        const MAX_HEIGHT = 2048;

        let reader = new FileReader();
        reader.onload = function(fileLoadedEvent) {
            let canvas = document.createElement('canvas');
            let img = new Image();

            img.onload = function () {
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const mimeType = fileLoadedEvent.target.result
                    .substr(5, 20)
                    .replace(/;base64,.*/, "");

                let base64 = canvas.toDataURL(mimeType);
                if(!base64.search(mimeType) >= 0) {
                    // image/png is always supported
                    base64 = canvas.toDataURL("image/png");
                }

                GalleryPhotoActionCreators.postPhoto(userId, {
                    base64: base64.replace(/^data:image\/(.+);base64,/, "")
                });
            };
            img.src = fileLoadedEvent.target.result;

        };
        reader.readAsDataURL(file);
    }

    isValidMimetype = function (mimeType) {
        switch (mimeType) {
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
                return true;
        }

        return false;
    };
}

export default new UploadImageService();

