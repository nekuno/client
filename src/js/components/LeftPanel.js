import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { Link } from 'react-router';
import User from '../components/User';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import StatsStore from '../stores/StatsStore';
import LoginActionCreators from '../actions/LoginActionCreators';

function getState(props) {

    const stats = StatsStore.get(props.user.id);
    const interests = selectn('numberOfContentLikes', stats) || 0;

    return {
        interests
    };
}

@AuthenticatedComponent
@translate('LeftPanel')
@connectToStores([StatsStore], getState)
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
        interests   : PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.handleGoClickThreads = this.handleGoClickThreads.bind(this);
        this.handleGoClickProfile = this.handleGoClickProfile.bind(this);
        this.handleGoClickConversations = this.handleGoClickConversations.bind(this);
        this.handleGoClickSocialNetworks = this.handleGoClickSocialNetworks.bind(this);
        this.logout = this.logout.bind(this);
    }

    handleGoClickThreads() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, '/threads');
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
        this.context.history.pushState(null, '/social-networks');
    }

    logout(e) {
        e.preventDefault();
        nekunoApp.closePanel();
        LoginActionCreators.logoutUser();
    }

    render() {
        const {user, userLoggedIn, strings, interests} = this.props;
        return (
            <div className="LeftPanel">
                <div className="panel-overlay"></div>
                <div className="panel panel-left panel-reveal">
                    <div className="content-block top-menu">
                        <a className="close-panel">
                            <span className="icon-notifications"/>
                            <span className="notifications-alert"/>
                        </a>
                    </div>
                    { userLoggedIn ? <User {...this.props} /> : '' }
                    <div className="user-interests">
                        <div className="number">
                            {interests}
                        </div>
                        <div className="label">
                            {strings.interests}
                        </div>
                    </div>
                    { userLoggedIn ?
                        <div className="content-block menu">
                            <Link to={'/threads'} onClick={this.handleGoClickThreads}>
                                {strings.threads}
                            </Link>
                            <Link to={'/profile'} onClick={this.handleGoClickProfile}>
                                {strings.myProfile}
                            </Link>
                            <Link to="/conversations" onClick={this.handleGoClickConversations}>
                                {strings.conversations}
                            </Link>
                            <Link to="/social-networks" onClick={this.handleGoClickSocialNetworks}>
                                {strings.socialNetworks}
                            </Link>
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
        threads       : 'Threads',
        myProfile     : 'Profile',
        conversations : 'Messages',
        socialNetworks: 'My social networks',
        logout        : 'Logout'
    }
};