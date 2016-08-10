import React, { PropTypes, Component } from 'react';
import { INVITATIONS_URL } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import Button from '../components/ui/Button';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as InvitationActionCreator from '../actions/InvitationActionCreator';
import InvitationStore from '../stores/InvitationStore';
import moment from 'moment';

function requestData() {
    InvitationActionCreator.requestInvitations();
}

/**
 * Retrieves state from stores for current props.
 */
function getState() {
    const invitations = InvitationStore.invitations;
    const noInvitations = InvitationStore.noInvitations;
    const loadingInvitations = InvitationStore.loadingInvitations;

    return {
        invitations: invitations,
        noInvitations: noInvitations,
        loadingInvitations: loadingInvitations
    };
}

@AuthenticatedComponent
@translate('InvitationsPage')
@connectToStores([InvitationStore], getState)
export default class InvitationsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user              : PropTypes.object.isRequired,
        // Injected by @translate:
        strings           : PropTypes.object,
        // Injected by @connectToStores:
        invitations       : PropTypes.array.isRequired,
        noInvitations     : PropTypes.bool,
        loadingInvitations: PropTypes.bool
    };

    constructor(props) {

        super(props);
    }

    componentWillMount() {
        requestData();
    }

    onShare(invitation) {
        const {strings} = this.props;
        const url = INVITATIONS_URL.replace('{token}', invitation.invitation.token);
        if (window.cordova) {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                //message: 'share this', // not supported on some apps (Facebook, Instagram)
                subject: invitation.invitation.slogan || strings.defaultInvitationTitle, // fi. for email
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
        const {invitations, noInvitations, loadingInvitations, strings} = this.props;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftMenuIcon={true} centerText={strings.invitations}/>
                <div className="page invitations-page">
                    <div id="page-content" className="invitations-content">
                        {!loadingInvitations && !noInvitations ? <div className="title">{strings.title}</div> : null}
                        {loadingInvitations ? <EmptyMessage text={strings.loadingInvitations} loadingGif={true}/>
                            : noInvitations ? <EmptyMessage text={strings.noInvitations}/>
                                : invitations.map((invitation, index) =>
                                    <div key={index} className="invitation">
                                        <div className="sub-title">{invitation.invitation.slogan ? invitation.invitation.slogan : strings.defaultInvitationTitle}</div>
                                        <div className="invitation-expires-at">{strings.expiresAt + ': '}{moment(invitation.invitation.expiresAt).format('dddd, D MMMM YYYY')}</div>
                                        <div className="send-invitation-button">
                                            <Button onClick={this.onShare.bind(this, invitation)}>{strings.sendInvitation}</Button>
                                        </div>
                                    </div>
                        )}
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}

InvitationsPage.defaultProps = {
    strings: {
        invitations           : 'Invitations',
        title                 : 'Send an invitation',
        defaultInvitationTitle: 'One use invitation',
        sendInvitation        : 'Send invitation',
        loadingInvitations    : 'Loading invitations',
        noInvitations         : 'You have no invitations available',
        expiresAt             : 'Expires at',
        shareError            : 'An error occurred sending the invitation.'
    }
};