import React, { PropTypes, Component } from 'react';
import { API_URLS, INVITATIONS_URL } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
import EmptyMessage from '../components/ui/EmptyMessage';
import CardContentList from '../components/interests/CardContentList';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as APIUtils from '../utils/APIUtils';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as GroupActionCreators from '../actions/GroupActionCreators';
import GroupStore from '../stores/GroupStore';
import LoginStore from '../stores/LoginStore';

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
    const members = GroupStore.getMembers(props.params.groupId);

    return {
        group,
        members
    };
}

@AuthenticatedComponent
@translate('GroupMembersPage')
@connectToStores([GroupStore], getState)
export default class GroupMembersPage extends Component {
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
        group: PropTypes.object,
        members: PropTypes.array

    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        const {group, members, strings} = this.props;
        return (
            <div className="view view-main">
                <TopNavBar leftMenuIcon={true} centerText={strings.group}/>
                {group && members ?
                        <div>
                            <div className="page group-page">
                                <div id="page-content">
                                    Datos de los miembros consoleados.
                                    {console.log(members)}
                                </div>
                            </div>
                            <ToolBar links={[
                {'url': '/groups/'+group.id, 'text': 'Grupo'},
                {'url': '/groups/'+group.id+'/members', 'text': 'Miembros'},
                {'url': '/groups/'+group.id+'/contents', 'text': 'Intereses'}
                ]} activeLinkIndex={1} arrowUpLeft={'85%'}/>
                        </div>
                        : ''}
            </div>
        );
    }
};

GroupMembersPage.defaultProps = {
    strings: {
        group: 'Group'
    }
};