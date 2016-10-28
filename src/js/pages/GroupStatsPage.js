import React, { PropTypes, Component } from 'react';
import { API_URLS } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as APIUtils from '../utils/APIUtils';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as GroupActionCreators from '../actions/GroupActionCreators';
import StatsStore from '../stores/StatsStore';
import GroupStore from '../stores/GroupStore';

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    GroupActionCreators.requestGroup(props.params.groupId);
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

@AuthenticatedComponent
@translate('GroupStatsPage')
@connectToStores([StatsStore, GroupStore], getState)
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
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.leave = this.leave.bind(this);

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
                this.context.history.pushState(null, '/groups');
            }, (error) => {
                console.log(error);
                this.setState({leaving: false});
                nekunoApp.alert('Sorry! We couldn´t leave this group');
            });
        });
    }

    render() {
        const {group, strings} = this.props;
        const {leaving} = this.state;
        return (
            <div className="view view-main">
                <TopNavBar leftMenuIcon={true} centerText={strings.group}/>
                <div className="page group-page">
                    {leaving ? <EmptyMessage text={strings.leaving} loadingGif={true}/> :
                        group ?
                            <div id="page-content">
                                Datos del grupo aqui. Consoleado el group.
                                {console.log(group)}
                                <FullWidthButton onClick={this.leave}>{strings.leave}</FullWidthButton>
                            </div>
                            : ''}
                </div>
            </div>
        );
    }
};

GroupStatsPage.defaultProps = {
    strings: {
        group: 'Group',
        leave: 'Leave',
        confirm_leave: 'Confirm leave',
        leaving: 'Leaving group'
    }
};