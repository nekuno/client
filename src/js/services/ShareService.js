class ShareService {

    share(subject, url, successCallback, errorCallback, copiedMessage) {
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
            // TODO: Uncomment to copy url if execCommand is available instead of sharing with FB
        /*} else if (typeof document.execCommand == "function") {
            this.copyToClipboard(url);
            nekunoApp.alert(copiedMessage);
            successCallback();*/
        } else {
            FB.ui({
                method: 'share',
                href: url,
            }, function (response) {
                successCallback();
            });
        }
    }

    copyToClipboard = function(text) {
        let aux = document.createElement("input");
        aux.setAttribute("value", text);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }
}

export default new ShareService();