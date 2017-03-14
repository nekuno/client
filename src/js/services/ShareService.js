class ShareService {

    share(subject, url, successCallback, errorCallback, copiedMessage) {
        if (typeof document.execCommand == "function") {
            this.copyToClipboard(url, copiedMessage);
        }
        if (window.cordova) {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                //message: 'share this', // not supported on some apps (Facebook, Instagram)
                subject: subject, // fi. for email
                url: url
                //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
            };
            window.plugins.socialsharing.shareWithOptions(options, successCallback, errorCallback);
        } else if (navigator.share !== undefined) {
            navigator.share({
                title: subject,
                url: url
            }).then(() => successCallback())
                .catch(error => errorCallback());
        } else {
            FB.ui({
                method: 'share',
                href: url,
            }, function (response) {
                successCallback();
            });
        }
    }

    copyToClipboard = function(text, copiedMessage) {
        let aux = document.createElement("input");
        aux.setAttribute("value", text);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        let messageTag = document.createElement("div");
        messageTag.className = "fixed-top-message";
        messageTag.innerHTML = copiedMessage;
        document.body.appendChild(messageTag);
        setTimeout(() => {
            messageTag.className += " visible";
            setTimeout(() => {
                messageTag.className = "fixed-top-message";
                setTimeout(() => {
                    document.body.removeChild(messageTag);
                }, 1000);
            }, 2000);
        }, 100);
    }
}

export default new ShareService();