import React, { PropTypes, Component } from 'react';
import ProgressBar from '../ui/ProgressBar';
import ProfilesAvatarConnection from '../ui/ProfilesAvatarConnection';
import { IMAGES_ROOT } from '../../constants/Constants';

export default class OtherProfileData extends Component {
    static propTypes = {
        matching: PropTypes.number,
        similarity: PropTypes.number,
        stats: PropTypes.object,
        ownImage: PropTypes.string,
        currentImage: PropTypes.string
    };

    render() {
        const { matching, similarity, stats, ownImage, currentImage } = this.props;
        let imgSrc = currentImage ? `${IMAGES_ROOT}/media/cache/user_avatar_180x180/user/images/${currentImage}` : `${IMAGES_ROOT}/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="other-profile-data">
                <div className="other-profile-left">
                    <ProfilesAvatarConnection ownPicture={ownImage} otherPicture={imgSrc} />
                    <div className = "other-profile-stats">
                        <div className = "other-profile-stats">20 Coincidencias</div>
                        <div className = "other-profile-stats">5 Intereses similares</div>
                    </div>
                </div>
                <div className = "other-profile-right">
                    <span> {matching ? 100*matching.toFixed(2) : 0}% compatibilidad</span>
                    <ProgressBar percentage = {matching ? 100*matching.toFixed(2) : 0} />
                    <span> {similarity ? 100*similarity.toFixed(2) : 0}% similaridad</span>
                    <ProgressBar percentage = {similarity ? 100*similarity.toFixed(2) : 0} />
                </div>

            </div>
        );
    }
}