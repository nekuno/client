import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ProgressBar from '../ui/ProgressBar'
import { IMAGES_ROOT } from '../../constants/Constants';
import shouldPureComponentUpdate from 'react-pure-render/function';
import selectn from 'selectn';

export default class OtherProfileData extends Component {
    static propTypes = {
        matching: PropTypes.number,
        stats: PropTypes.object,
        ownImage: PropTypes.string,
        currentImage: PropTypes.string
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { matching, stats, ownImage, currentImage } = this.props;
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
                    <span> {matching}% compatibilidad</span>
                    <ProgressBar percentage = {matching ? matching : 0} />
                    <span> 50% similaridad</span>
                    <ProgressBar percentage = {50} />
                </div>

            </div>
        );
    }
}