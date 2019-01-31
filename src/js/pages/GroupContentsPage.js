import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { API_URLS, INVITATIONS_URL } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
import EmptyMessage from '../components/ui/EmptyMessage/EmptyMessage';
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
    const contents = GroupStore.getContents(props.params.groupId);

    return {
        group,
        contents
    };
}

@AuthenticatedComponent
@translate('GroupMembersPage')
@connectToStores([GroupStore], getState)
export default class GroupContentsPage extends Component {
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
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        const {group, contents, strings, user} = this.props;
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.group}/>
                {group && contents ?
                    <ToolBar links={[
                        {'url': '/groups/'+group.id, 'text': 'Grupo'},
                        {'url': '/groups/'+group.id+'/members', 'text': 'Miembros'},
                        {'url': '/groups/'+group.id+'/contents', 'text': 'Intereses'}
                    ]} activeLinkIndex={1} arrowUpLeft={'85%'}/>
                    : null}
                <div className="view view-main">
                    {group && contents ?
                        <div>
                            <div className="page group-page">
                                <div id="page-content">
                                    Datos de los contenidos consoleados.
                                    {console.log(contents)}
                                </div>
                                <CardContentList contents={contents} userId={user.id}/>
                            </div>
                        </div>
                        : ''}
                </div>
            </div>
        );
    }
}

GroupContentsPage.defaultProps = {
    strings: {
        group: 'Group'
    }
};