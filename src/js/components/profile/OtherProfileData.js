import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ProgressBar from '../ui/ProgressBar'
import { IMAGES_ROOT } from '../../constants/Constants';
import shouldPureComponentUpdate from 'react-pure-render/function';
import selectn from 'selectn';

export default class OtherProfileData extends Component {
    static propTypes = {
        matching: PropTypes.number,
        similarity: PropTypes.number,
        stats: PropTypes.object,
        ownImage: PropTypes.string,
        currentImage: PropTypes.string
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { matching, similarity, stats, ownImage, currentImage } = this.props;
        let imgSrc = currentImage ? `${IMAGES_ROOT}/media/cache/user_avatar_180x180/user/images/${currentImage}` : `${IMAGES_ROOT}/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="otherProfileData">
                <div className="otherProfileLeft">
                    <div className = "otherProfileAvatars"></div>
                    <div className = "otherProfileStats">
                        <div className = "otherProfileStats">20 Coincidencias</div>
                        <div className = "otherProfileStats">5 Intereses similares</div>
                    </div>
                </div>
                <div className = "otherProfileRight">
                    <span> {matching ? 100*matching.toFixed(2) : 0}% compatibilidad</span>
                    <ProgressBar percentage = {matching ? 100*matching.toFixed(2) : 0} />
                    <span> {similarity ? 100*similarity.toFixed(2) : 0}% similaridad</span>
                    <ProgressBar percentage = {similarity ? 100*similarity.toFixed(2) : 0} />
                </div>

            </div>
        );
    }
}