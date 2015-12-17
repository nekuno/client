import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from 'react-pure-render/function';
import selectn from 'selectn';

export default class User extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { user } = this.props;
        let imgSrc = user.picture ? `https://dev.nekuno.com/media/cache/resolve/profile_picture/user/images/${user.picture}` : 'https://dev.nekuno.com/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg';
        return (
            <div className="User">
                <div className="content-block user-block">
                    <div className="user-image">
                        <img src={imgSrc} />
                    </div>
                    <div className="user-data">
                        <div className="user-username">
                            {user.username}
                        </div>
                        <div className="user-location">
                            <span className="icon-marker"></span> {selectn('location.address', user) ? user.location.address : 'Madrid'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
