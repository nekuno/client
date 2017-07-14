import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { API_URLS, INVITATIONS_URL } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
import EmptyMessage from '../components/ui/EmptyMessage';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as GroupActionCreators from '../actions/GroupActionCreators';
import ShareService from '../services/ShareService';
import GroupStore from '../stores/GroupStore';

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const groupId = props.params.groupId;
    GroupActionCreators.requestGroup(groupId);
    GroupActionCreators.requestGroupContents(groupId);
    GroupActionCreators.requestGroupMembers(groupId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {

    const group = GroupStore.getGroup(props.params.groupId);

    return {
        group
    };
}

function buildInvitationUrl(props) {
    const group = props.group;
    return group ? INVITATIONS_URL.replace('{token}', group.invitation.invitation_token) : null;
}

@AuthenticatedComponent
@translate('GroupStatsPage')
@connectToStores([GroupStore], getState)
export default class GroupStatsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            groupId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user: PropTypes.object,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        group: PropTypes.object

    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.leave = this.leave.bind(this);
        this.share = this.share.bind(this);

        this.state = {
            leaving: false
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    leave() {
        nekunoApp.confirm(this.props.strings.confirm_leave, () => {
            this.setState({leaving: true});
            GroupActionCreators.leaveGroup(this.props.group.id).then(() => {
                this.setState({leaving: false});
                this.context.router.push('/groups');
            }, (error) => {
                console.log(error);
                this.setState({leaving: false});
                nekunoApp.alert(this.props.strings.leave_error);
            });
        });
    }

    share() {
        const invitationUrl = buildInvitationUrl(this.props);
        const invitationSubject = this.props.strings.shareSubject + this.props.group.name;
        ShareService.share(
            invitationSubject,
            invitationUrl,
            this.onShareSuccess,
            this.onShareError,
            this.props.strings.copiedToClipboard
        );
    }

    onShareSuccess() {
    }

    onShareError() {
        nekunoApp.alert(this.props.strings.shareError)
    }

    render() {
        const {group, strings, user} = this.props;
        const {leaving} = this.state;
        const invitation_url = buildInvitationUrl(this.props);
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.group}/>
                {group ?
                    <ToolBar links={[
                        {'url': '/groups/'+group.id, 'text': 'Grupo'},
                        {'url': '/groups/'+group.id+'/members', 'text': 'Miembros'},
                        {'url': '/groups/'+group.id+'/contents', 'text': 'Intereses'}
                    ]} activeLinkIndex={0} arrowUpLeft={'85%'}/>
                    : null}
                <div className="view view-main">
                    {leaving ? <EmptyMessage text={strings.leaving} loadingGif={true}/> :
                        group ?
                            <div>
                                <div className="page group-page">
                                    <div id="page-content">
                                        <br />
                                        Nombre: {group.name} <br />
                                        Usuarios: {group.usersCount} <br />
                                        <div onClick={this.share}
                                             className="invitation-share">{strings.share}: {invitation_url}</div>
                                        <FullWidthButton onClick={this.leave}>{strings.leave}</FullWidthButton>

                                    </div>
                                </div>
                            </div>
                            : ''}
                </div>
            </div>
        );
    }
}

GroupStatsPage.defaultProps = {
    strings: {
        group            : 'Group',
        share            : 'Sharing URL',
        shareSubject     : 'Join the Nekuno group ',
        leave            : 'Leave',
        confirm_leave    : 'Confirm leave',
        leaving          : 'Leaving group',
        leave_error      : 'Sorry! Please, try again to leave the group',
        copiedToClipboard: 'Copied to clipboard'
    }
};