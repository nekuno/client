import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import User from '../components/User';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import StatsStore from '../stores/StatsStore';
import LoginActionCreators from '../actions/LoginActionCreators';
import ChatThreadStore from '../stores/ChatThreadStore';
import ProfileStore from '../stores/ProfileStore';

function getState(props) {

    const stats = StatsStore.stats;
    const interests = selectn('numberOfContentLikes', stats) || 0;
    const unreadCount = ChatThreadStore.getUnreadCount() || 0;
    const profile = ProfileStore.get(props.user.id);

    return {
        interests,
        unreadCount,
        profile
    };
}

@AuthenticatedComponent
@translate('LeftPanel')
@connectToStores([StatsStore, ChatThreadStore], getState)
export default class LeftPanel extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object,
        userLoggedIn: PropTypes.bool.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        interests   : PropTypes.number.isRequired,
        unreadCount: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.handleGoClickThreads = this.handleGoClickThreads.bind(this);
        this.handleGoClickProfile = this.handleGoClickProfile.bind(this);
        this.handleGoClickConversations = this.handleGoClickConversations.bind(this);
        this.handleGoClickSocialNetworks = this.handleGoClickSocialNetworks.bind(this);
        this.handleGoClickInvitations = this.handleGoClickInvitations.bind(this);
        this.handleGoClickGroups = this.handleGoClickGroups.bind(this);
        this.handleClickSettings = this.handleClickSettings.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            settingsActive: null
        };
    }

    handleGoClickThreads() {
        this.context.history.pushState(null, '/discover');
    }

    handleGoClickProfile() {
        this.context.history.pushState(null, `/profile`);
    }

    handleGoClickConversations() {
        this.context.history.pushState(null, '/conversations');
    }

    handleGoClickSocialNetworks() {
        this.setState({
            settingsActive: null
        });
        this.context.history.pushState(null, '/social-networks');
    }

    handleGoClickInterests() {
        this.context.history.pushState(null, '/interests');
    }

    handleClickSettings() {
        this.setState({
            settingsActive: !this.state.settingsActive
        });
    }

    handleGoClickInvitations() {
        this.setState({
            settingsActive: null
        });
        this.context.history.pushState(null, '/invitations');
    }

    handleGoClickGroups() {
        this.context.history.pushState(null, '/groups');
    }

    logout(e) {
        e.preventDefault();
        nekunoApp.closePanel();
        this.setState({
            settingsActive: null
        });
        LoginActionCreators.logoutUser();
    }

    render() {
        const {user, userLoggedIn, strings, interests, unreadCount} = this.props;
        const {settingsActive} = this.state;
        return (
            <div className="LeftPanel">
                <div className="panel-overlay"></div>
                <div className="panel panel-left panel-reveal">
                    <div className="content-block top-menu">
                        <a className="close-panel">
                            <span className="icon-left-arrow"/>
                            {unreadCount ?
                                <span className="icon-circle"></span> : ''
                            }
                        </a>
                    </div>
                    { userLoggedIn ? <User {...this.props} onClick={this.handleGoClickProfile} /> : '' }
                    <div className="user-interests">
                        <a href="javascript:void(0)" onClick={this.handleGoClickInterests}>
                            <div className="number">
                                {interests}
                            </div>
                            <div className="label">
                                {strings.interests}
                            </div>
                        </a>
                    </div>
                    { userLoggedIn && !settingsActive ?
                        <div className="content-block menu">
                            <a href="javascript:void(0)" onClick={this.handleGoClickThreads}>
                                {strings.threads}
                            </a>
                            <a href="javascript:void(0)" onClick={this.handleGoClickProfile}>
                                {strings.myProfile}
                            </a>
                            <a href="javascript:void(0)" onClick={this.handleGoClickConversations}>
                                {strings.conversations}
                                {unreadCount ? <span className="unread-messages-count">
                                    <span className="unread-messages-count-text">{unreadCount}</span>
                                </span> : ''}
                            </a>
                            {/*<Link to="/groups" onClick={this.handleGoClickGroups}>*/}
                                {/*{strings.groups}*/}
                            {/*</Link>*/}
                            <a onClick={this.handleClickSettings}>
                                {strings.settings}
                            </a>
                        </div>
                        : settingsActive ?
                            <div className="content-block menu">
                                <a onClick={this.handleClickSettings} style={{fontWeight: 'bold'}}>
                                    <span className="icon-left-arrow"></span>&nbsp;&nbsp;{strings.settings}
                                </a>
                                <a href="javascript:void(0)" onClick={this.handleGoClickSocialNetworks}>
                                    {strings.socialNetworks}
                                </a>
                                {/*<Link to="/invitations" onClick={this.handleGoClickInvitations} onlyActiveOnIndex={false}>*/}
                                    {/*{strings.invitations}*/}
                                {/*</Link>*/}
                                <a href="javascript:void(0)" onClick={this.logout}>
                                    {strings.logout}
                                </a>
                            </div>
                            : '' }
                </div>
            </div>
        );
    }

}

LeftPanel.defaultProps = {
    strings: {
        interests     : 'Interests',
        threads       : 'Discover',
        groups        : 'Groups',
        myProfile     : 'Profile',
        conversations : 'Messages',
        socialNetworks: 'My social networks',
        settings      : 'Settings',
        invitations   : 'Invitations',
        logout        : 'Logout'
    }
};