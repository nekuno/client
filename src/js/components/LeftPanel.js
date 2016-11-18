import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { Link } from 'react-router';
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
        nekunoApp.closePanel();
        this.context.history.pushState(null, '/discover');
    }

    handleGoClickProfile() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, `/profile`);
    }

    handleGoClickConversations() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, '/conversations');
    }

    handleGoClickSocialNetworks() {
        nekunoApp.closePanel();
        this.setState({
            settingsActive: null
        });
        this.context.history.pushState(null, '/social-networks');
    }

    handleGoClickInterests() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, '/interests');
    }

    handleClickSettings() {
        this.setState({
            settingsActive: !this.state.settingsActive
        });
    }

    handleGoClickInvitations() {
        nekunoApp.closePanel();
        this.setState({
            settingsActive: null
        });
        this.context.history.pushState(null, '/invitations');
    }

    handleGoClickGroups() {
        nekunoApp.closePanel();
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
                        <Link to="/interests" onClick={this.handleGoClickInterests}>
                            <div className="number">
                                {interests}
                            </div>
                            <div className="label">
                                {strings.interests}
                            </div>
                        </Link>
                    </div>
                    { userLoggedIn && !settingsActive ?
                        <div className="content-block menu">
                            <Link to={'/discover'} onClick={this.handleGoClickThreads}>
                                {strings.threads}
                            </Link>
                            <Link to={'/profile'} onClick={this.handleGoClickProfile}>
                                {strings.myProfile}
                            </Link>
                            <Link to="/conversations" onClick={this.handleGoClickConversations}>
                                {strings.conversations}
                                {unreadCount ? <span className="unread-messages-count">
                                    <span className="unread-messages-count-text">{unreadCount}</span>
                                </span> : ''}
                            </Link>
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
                                <Link to="/social-networks" onClick={this.handleGoClickSocialNetworks}>
                                    {strings.socialNetworks}
                                </Link>
                                {/*<Link to="/invitations" onClick={this.handleGoClickInvitations} onlyActiveOnIndex={false}>*/}
                                    {/*{strings.invitations}*/}
                                {/*</Link>*/}
                                <Link to="/" onClick={this.logout}>
                                    {strings.logout}
                                </Link>
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