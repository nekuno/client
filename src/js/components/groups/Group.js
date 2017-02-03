import React, { PropTypes, Component } from 'react';
import { INVITATIONS_URL } from '../../constants/Constants';
import Button from '../ui/Button';
import Image from '../ui/Image';
import translate from '../../i18n/Translate';

@translate('Group')
export default class Group extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        group : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.goToChat = this.goToChat.bind(this);
        this.goToDiscover = this.goToDiscover.bind(this);
    }

    goToChat() {
        nekunoApp.alert('Go to group chat page with id ' + this.props.group.id);
    }

    goToDiscover() {
        const {group} = this.props;
        this.context.router.push(`badges/${group.id}/discover`);
    }

    onShare(group) {
        const {strings} = this.props;
        const url = INVITATIONS_URL.replace('{token}', group.invitation.invitation_token);
        if (window.cordova) {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                //message: 'share this', // not supported on some apps (Facebook, Instagram)
                subject: strings.invitationTitle, // fi. for email
                url: url
                //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
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
        let {group, strings} = this.props;
        const defaultSrc = 'img/default-content-image.jpg';
        return (
            <div className="group">
                <div className="invitation-image-wrapper" onClick={this.goToDiscover}>
                    <div className="invitation-image-centered-wrapper">
                        <div className="invitation-image">
                            <Image src={group.invitation.invitation_image_url ? group.invitation.invitation_image_url : defaultSrc} defaultSrc={defaultSrc}/>
                        </div>
                    </div>
                </div>
                <div className="group-info-box">
                    <div className="title group-title" onClick={this.goToDiscover}>
                        <a>
                            {group.name}
                        </a>
                    </div>
                    <div className="group-users-count" onClick={this.goToDiscover}>
                        {group.usersCount} {strings.users}
                    </div>
                    {/*<Button onClick={this.onShare.bind(this, group)}>{strings.sendInvitation}</Button>*/}
                </div>
            </div>
        );
    }
}

Group.defaultProps = {
    strings: {
        users          : 'Users',
        sendInvitation : 'Send invitation',
        invitationTitle: 'Badge invitation',
        shareError     : 'An error occurred sending the invitation.',
        copyToClipboard: 'Copy to clipboard: Ctrl+C, Enter'
    }
};