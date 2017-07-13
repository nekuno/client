import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { INVITATIONS_URL } from '../../constants/Constants';
import Button from '../ui/Button';
import Image from '../ui/Image';
import ShareService from '../../services/ShareService';
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
        ShareService.share(
            strings.invitationTitle,
            url,
            this.onShareSuccess,
            this.onShareError,
            strings.copiedToClipboard
        );
    }

    onShareSuccess() {}

    onShareError() {
        nekunoApp.alert(this.props.strings.shareError)
    }


    render() {
        let {group, strings} = this.props;
        const defaultSrc = 'img/default-content-image.jpg';
        const image = group.photo ? group.photo.thumbnail.medium :
            group.invitation.invitation_image_url ? group.invitation.invitation_image_url
                : defaultSrc;
        return (
            <div className="group">
                <div className="invitation-image-wrapper" onClick={this.goToDiscover}>
                    <div className="invitation-image-centered-wrapper">
                        <div className="invitation-image">
                            <Image src={image} defaultSrc={defaultSrc}/>
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
        users            : 'Users',
        sendInvitation   : 'Send invitation',
        invitationTitle  : 'Badge invitation',
        shareError       : 'An error occurred sending the invitation.',
        copiedToClipboard: 'Copied to clipboard',
    }
};