import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import selectn from 'selectn';
import Image from './ui/Image';

export default class User extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    };

    render() {
        const {user, profile} = this.props;
        let imgSrc = user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="User">
                <div className="content-block user-block">
                    <div className="user-image">
                        <Image src={imgSrc}/>
                    </div>
                    <div className="user-data">
                        <div className="user-username title">
                            {user.username}
                        </div>
                        <div className="user-location">
                            <span className="icon-marker"></span> {selectn('location.locality', profile) || selectn('location.address', profile) || ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
