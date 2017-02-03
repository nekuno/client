import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import Image from './ui/Image';

export default class User extends Component {

    static propTypes = {
        user   : PropTypes.object.isRequired,
        profile: PropTypes.object,
        onClick: PropTypes.func
    };

    render() {
        const {user, profile, onClick} = this.props;
        let imgSrc = user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';
        return (
            <div className="User" onClick={onClick}>
                <div className="content-block user-block">
                    <div className="user-image">
                        <a href="javascript:void(0)">
                            <Image src={imgSrc}/>
                        </a>
                    </div>
                    <div className="user-data">
                        <div className="user-username title">
                            {user.username}
                        </div>
                        <div className="user-location">
                            <span className="icon-marker"/> {selectn('location.locality', profile) || selectn('location.address', profile) || ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
