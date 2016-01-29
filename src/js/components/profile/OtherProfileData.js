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
        const commonAnswers = stats? stats.commonAnswers : '?';
        const commonContent = stats? stats.commonContent : '?';

        return (
            <div className="other-profile-data">
                <div className="other-profile-left">
                    <ProfilesAvatarConnection ownPicture={ownImage} otherPicture={currentImage} />
                    <div className = "other-profile-stats">
                        <div className = "other-profile-stats">{commonAnswers} Coincidencias</div>
                        <div className = "other-profile-stats">{commonContent} Intereses similares</div>
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