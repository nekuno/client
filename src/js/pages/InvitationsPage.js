import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
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

function invitationHasToBeShown(invitation) {
    return (!invitation.invitation.expiresAt || invitation.invitation.expiresAt - Math.floor(Date.now() / 1000) > 0)
            && invitation.invitation.available > 0
            || invitation.invitation.consumedUserId && invitation.invitation.consumedUsername
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

    componentDidMount() {
        nekunoApp.closePanel();
    }

    componentDidUpdate() {
        nekunoApp.closePanel();
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
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.invitations}/>
                <div className="view view-main" onScroll={this.handleScroll}>
                    <div className="page invitations-page">
                        <div id="page-content" className="invitations-content">
                            {!loadingInvitations && !noInvitations ? <div className="title">{strings.title.replace('%invitationNumber%', invitations.filter(invitation => invitationHasToBeShown(invitation)).length)}</div> : null}
                            {loadingInvitations ? <EmptyMessage text={strings.loadingInvitations} loadingGif={true}/>
                                : noInvitations ? <EmptyMessage text={strings.noInvitations}/>
                                    : invitations.map((invitation, index) =>
                                        invitationHasToBeShown(invitation) ?
                                            <div key={index} className="invitation">
                                                <div className="invitation-token">{invitation.invitation.token}</div>
                                                {invitation.invitation.expiresAt ? <div className="invitation-expires-at">{strings.expiresAt + ': '}{moment.unix(invitation.invitation.expiresAt).format('dddd, D MMMM YYYY')}</div> : null}
                                                {invitation.invitation.available ?
                                                    <div className="send-invitation-button">
                                                        <Button
                                                            onClick={this.onShare.bind(this, invitation)}>{strings.sendInvitation}</Button>
                                                    </div>
                                                    :
                                                    invitation.invitation.consumedUserId && invitation.invitation.consumedUsername ?
                                                        <div className="invitation-consumed">
                                                            {strings.consumedBy}: <Link to={`profile/${invitation.invitation.consumedUserId}`}>{invitation.invitation.consumedUsername}</Link>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                            : null
                            )}
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}

InvitationsPage.defaultProps = {
    strings: {
        invitations           : 'Invitations',
        title                 : 'You have %invitationNumber% invitations',
        defaultInvitationTitle: 'One use invitation',
        sendInvitation        : 'Send invitation',
        loadingInvitations    : 'Loading invitations',
        noInvitations         : 'You have no invitations available',
        expiresAt             : 'Expires at',
        consumedBy            : 'Consumed by',
        shareError            : 'An error occurred sending the invitation.'
    }
};