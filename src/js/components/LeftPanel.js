import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { Link } from 'react-router';
import User from '../components/User';
import connectToStores from '../utils/connectToStores';
import LoginStore from '../stores/LoginStore';
import StatsStore from '../stores/StatsStore';
import LoginActionCreators from '../actions/LoginActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData() {
    const user = LoginStore.user;
    const currentUserId = parseId(user);
    UserActionCreators.requestStats(currentUserId);
}

function getState() {

    const user = LoginStore.user;
    const isLoggedIn = LoginStore.isLoggedIn();
    const stats = StatsStore.get(user.id);
    const interests = selectn('numberOfContentLikes', stats) || 0;

    return {
        user,
        interests,
        isLoggedIn
    };
}

@connectToStores([LoginStore, StatsStore], getState)
export default class LeftPanel extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        user      : PropTypes.object,
        isLoggedIn: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.handleGoClickProfile = this.handleGoClickProfile.bind(this);
        this.handleGoClickThreads = this.handleGoClickThreads.bind(this);
        this.handleGoClickChatThreads = this.handleGoClickChatThreads.bind(this);
        this.handleGoClickSocialNetworks = this.handleGoClickSocialNetworks.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        requestData();
    }

    render() {
        const { user, interests, isLoggedIn } = this.props;
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
                    { isLoggedIn ? <User {...this.props} /> : '' }
                    <div className="user-interests">
                        <div className="number">
                            {interests}
                        </div>
                        <div className="label">
                            Intereses
                        </div>
                    </div>
                    { isLoggedIn ?
                        <div className="content-block menu">
                            <Link to={`/threads/${user.qnoow_id}`} onClick={this.handleGoClickThreads}>
                                Hilos
                            </Link>
                            <Link to={`/profile/${user.qnoow_id}`} onClick={this.handleGoClickProfile}>
                                Mi perfil
                            </Link>
                            <Link to="/conversations" onClick={this.handleGoClickChatThreads}>
                                Mensajes
                            </Link>
                            <Link to="/social-networks" onClick={this.handleGoClickSocialNetworks}>
                                Mis redes sociales
                            </Link>
                            <Link to="/" onClick={this.logout}>
                                Salir
                            </Link>
                        </div>
                        : '' }
                </div>
            </div>
        );
    }

    handleGoClickProfile() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, `/profile/${this.props.user.qnoow_id}`);
    }

    handleGoClickThreads() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, `/threads/${this.props.user.qnoow_id}`);
    }

    handleGoClickSocialNetworks() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, "/social-networks");
    }

    handleGoClickChatThreads() {
        nekunoApp.closePanel();
        this.context.history.pushState(null, "/conversations");
    }

    logout(e) {
        e.preventDefault();
        nekunoApp.closePanel();
        LoginActionCreators.logoutUser();
    }
}
