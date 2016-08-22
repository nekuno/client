import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../constants/Constants';
import selectn from 'selectn';
import Image from './ui/Image';

function parseId(user) {
    return user.id;
}

export default class User extends Component {
    static propTypes = {
        user   : PropTypes.object.isRequired,
        profile: PropTypes.object,
        other  : PropTypes.bool,
        onClick: PropTypes.func
    };

    render() {
        const {user, profile, other, onClick} = this.props;
        let imgSrc = user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;
        const galleryLink = other ? `/users/${parseId(user)}/other-gallery` : 'gallery';
        return (
            <div className="User" onClick={onClick}>
                <div className="content-block user-block">
                    <div className="user-image">
                        <Link to={galleryLink}>
                            <Image src={imgSrc}/>
                        </Link>
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
