import React, { PropTypes, Component } from 'react';
import { SHARE_PROFILE_URL } from '../../constants/Constants';
import Button from '../../components/ui/Button';
import translate from '../../i18n/Translate';

@translate('ShareProfileBanner')
export default class ShareProfileBanner extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    onShare() {
        const {user, strings} = this.props;
        const url = SHARE_PROFILE_URL.replace('{id}', user.id);
        if (window.cordova) {
            var options = {
                subject: strings.compatibilityCheckWith.replace('%username%', user.username), // fi. for email
                url: url
            };
            window.plugins.socialsharing.shareWithOptions(options, this.onShareSuccess, this.onShareError);
        } else {
            window.prompt(strings.copyToClipboard, url);
            this.onShareSuccess();
        }
    }

    onShareSuccess() {}

    onShareError() {
        nekunoApp.alert(this.props.strings.shareError)
    }

    render() {

        const {strings, user} = this.props;

        return (
            <div className="share-profile-container">
                <div className="title share-profile-title">{strings.title}</div>
                <div className="share-profile-text">{strings.text}</div>
                <div className="share-profile-button">
                    <Button onClick={this.onShare.bind(this, user)}>{strings.shareLink}</Button>
                </div>
            </div>
        );
    }
}

ShareProfileBanner.defaultProps = {
    strings: {
        title                 : 'Who are you most compatible with?',
        text                  : 'Share the url of your profile to know it!',
        shareLink             : 'Share the link',
        compatibilityCheckWith: 'Check your compatibility with %username%',
        copyToClipboard       : 'Copy to clipboard: Ctrl+C, Enter',
        shareError            : 'An error occurred sending the link.'
    }
};