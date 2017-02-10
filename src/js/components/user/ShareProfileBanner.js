import React, { PropTypes, Component } from 'react';
import { SHARED_USER_URL } from '../../constants/Constants';
import Button from '../ui/Button';
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
        const url = SHARED_USER_URL.replace('{slug}', user.slug);
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
            <div className="share-profile-container" onClick={this.onShare.bind(this, user)}>
                <div className="title share-profile-title">{strings.title}</div>
                <div className="share-profile-text">{strings.text}</div>
                <div className="share-profile-button">
                    <Button><span className="icon-share"></span> {strings.copyLink}</Button>
                </div>
            </div>
        );
    }
}

ShareProfileBanner.defaultProps = {
    strings: {
        title                 : 'Share now with your friends and followers!',
        text                  : 'Discover the most compatibles sharing your profile url',
        copyLink              : 'Copy profile url',
        compatibilityCheckWith: 'Check your compatibility with %username%',
        copyToClipboard       : 'Copy to clipboard: Ctrl+C, Enter',
        shareError            : 'An error occurred sending the link.'
    }
};