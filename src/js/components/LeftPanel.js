import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from 'react-pure-render/function';
import selectn from 'selectn';

export default class LeftPanel extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { user } = this.props;

        return (
            <div className='LeftPanel'>
                <div className="panel-overlay"></div>
                <div className="panel panel-left panel-reveal">
                    <div className="content-block top-menu">
                        <a className="close-panel" href="#"><span className="icon-notifications"></span><span className="notifications-alert"></span></a>
                    </div>
                    <div className="content-block">
                        <div className="profile-image">
                            <img src={`https://dev.nekuno.com/media/cache/resolve/profile_picture/user/images/${user.picture }`} />
                        </div>
                        <div className="user-data">
                            <div className="user-username">
                                {user.username}
                            </div>
                            <div className="user-location">
                                <span className="icon-marker"></span> {selectn('location.address', user)}
                            </div>
                            <div className="user-interests">
                                {user.interests}
                            </div>
                        </div>
                        <div className="content-block">
                            <div className="menu">
                                <Link to={`/login2/${user.qnoow_id}`}>
                                    Hilos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
