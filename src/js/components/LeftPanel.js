import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';
import User from '../components/User';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import StatsStore from '../stores/StatsStore';
import LoginActionCreators from '../actions/LoginActionCreators';
import Framework7Service from '../services/Framework7Service';
import ChatThreadStore from '../stores/ChatThreadStore';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';

function getState(props) {

    const stats = StatsStore.stats;
    const interests = selectn('numberOfContentLikes', stats) || 0;
    const unreadCount = ChatThreadStore.getUnreadCount() || 0;
    const profile = ProfileStore.get(props.user.slug);

    return {
        interests,
        unreadCount,
        profile
    };
}

@AuthenticatedComponent
@translate('LeftPanel')
@connectToStores([UserStore, StatsStore, ChatThreadStore], getState)
export default class LeftPanel extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object,
        userLoggedIn: PropTypes.bool,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        interests   : PropTypes.number,
        unreadCount : PropTypes.number
    };

    constructor(props) {
        super(props);

        this.handleGoClickThreads = this.handleGoClickThreads.bind(this);
        this.handleGoClickProfile = this.handleGoClickProfile.bind(this);
        this.handleGoClickConversations = this.handleGoClickConversations.bind(this);
        this.handleGoClickSocialNetworks = this.handleGoClickSocialNetworks.bind(this);
        this.handleGoClickInterests = this.handleGoClickInterests.bind(this);
        this.handleClickMore = this.handleClickMore.bind(this);
        this.handleClickSettings = this.handleClickSettings.bind(this);
        this.handleGoClickInvitations = this.handleGoClickInvitations.bind(this);
        this.handleGoClickGroups = this.handleGoClickGroups.bind(this);
        this.pushRoute = this.pushRoute.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            moreActive: null
        };
    }

    componentDidMount() {
        Framework7Service.$$()('.panel-left').on('closed', () => {
            this.setState({
                moreActive: false
            });
        });
    }

    handleGoClickThreads() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute('/discover');
        });
    }

    handleGoClickProfile() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute(`/p/${this.props.user.slug}`);
        });
    }

    handleGoClickConversations() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute('/conversations');
        });
    }

    handleGoClickSocialNetworks() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute('/social-networks');
        });
    }

    handleGoClickInterests() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute('/interests');
        });
    }

    handleClickMore() {
        this.setState({
            moreActive: !this.state.moreActive
        });
    }

    handleClickSettings() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute('/settings');
        });
    }

    handleGoClickInvitations() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute('/invitations');
        });
    }

    handleGoClickGroups() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            this.pushRoute('/badges');
        });
    }

    pushRoute(route) {
        setTimeout(() => { this.context.router.push(route) }, 0);
    }

    logout() {
        Framework7Service.nekunoApp().closePanel();
        Framework7Service.$$()('.panel-left').once('closed', () => {
            setTimeout(() => LoginActionCreators.logoutUser(), 0);
        });
    }

    render() {
        const {userLoggedIn, strings, interests, unreadCount} = this.props;
        const {moreActive} = this.state;
        return (
            <div className="LeftPanel">
                <div className="panel-overlay"></div>
                <div className="panel panel-left panel-reveal">
                    <div className="content-block top-menu">
                        <a className="close-panel">
                            <span className="icon-left-arrow"/>
                        </a>
                    </div>
                    { userLoggedIn ? <User {...this.props} onClick={this.handleGoClickProfile}/> : '' }
                    { userLoggedIn && !moreActive ?
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
                        : null
                    }
                    { userLoggedIn && !moreActive ?
                        <div className="content-block menu">
                            <a href="javascript:void(0)" onClick={this.handleGoClickThreads}>
                                <span className="icon-search"></span>&nbsp;&nbsp;{strings.threads}
                            </a>
                            {/*<a href="javascript:void(0)" onClick={this.handleGoClickProfile}>
                             {strings.myProfile}
                             </a>*/}
                            <a href="javascript:void(0)" onClick={this.handleGoClickConversations}>
                                <span className="icon-commenting"></span>&nbsp;&nbsp;{strings.conversations}
                                {unreadCount ? <span className="unread-messages-count">
                                    <span className="unread-messages-count-text">{unreadCount}</span>
                                </span> : ''}
                            </a>
                            <a href="javascript:void(0)" onClick={this.handleGoClickGroups}>
                                <span className="icon-puzzle-piece"></span>&nbsp;&nbsp;{strings.groups}
                            </a>
                            <a href="javascript:void(0)" onClick={this.handleClickMore}>
                                <span className="icon-fa-plus"></span>&nbsp;&nbsp;{strings.more}
                            </a>
                        </div>
                        : moreActive ?
                            <div className="content-block menu">
                                <a href="javascript:void(0)" onClick={this.handleClickMore} style={{fontWeight: 'bold'}}>
                                    <span className="icon-left-arrow"></span>&nbsp;&nbsp;{strings.less}
                                </a>
                                <a href="javascript:void(0)" onClick={this.handleGoClickProfile}>
                                    <span className="icon-person"></span>&nbsp;&nbsp;{strings.myProfile}
                                </a>
                                <a href="javascript:void(0)" onClick={this.handleGoClickSocialNetworks}>
                                    <span className="icon-plug"></span>&nbsp;&nbsp;{strings.socialNetworks}
                                </a>
                                <a href="javascript:void(0)" onClick={this.handleClickSettings}>
                                    <span className="icon-preferences"></span>&nbsp;&nbsp;{strings.settings}
                                </a>
                                {/*<Link to="/invitations" onClick={this.handleGoClickInvitations} onlyActiveOnIndex={false}>*/}
                                {/*{strings.invitations}*/}
                                {/*</Link>*/}
                                <a href="javascript:void(0)" onClick={this.logout}>
                                    <span className="icon-sign-out"></span>&nbsp;&nbsp;{strings.logout}
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
        groups        : 'Badges',
        myProfile     : 'Profile',
        conversations : 'Messages',
        socialNetworks: 'My social networks',
        more          : 'More',
        less          : 'Less',
        settings      : 'Settings',
        invitations   : 'Invitations',
        logout        : 'Logout'
    }
};