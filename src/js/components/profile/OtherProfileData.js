import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ProgressBar from '../ui/ProgressBar';
import ProfilesAvatarConnection from '../ui/ProfilesAvatarConnection';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import WorkersStore from '../../stores/WorkersStore';

function getState(props) {
    const isSomethingWorking = WorkersStore.isSomethingWorking();

    return {
        isSomethingWorking
    };
}

@translate('OtherProfileData')
@connectToStores([WorkersStore], getState)
export default class OtherProfileData extends Component {
    static propTypes = {
        matching          : PropTypes.number,
        similarity        : PropTypes.number,
        stats             : PropTypes.object,
        ownImage          : PropTypes.string,
        currentImage      : PropTypes.string,
        interestsUrl      : PropTypes.string.isRequired,
        questionsUrl      : PropTypes.string.isRequired,
        isSomethingWorking: PropTypes.bool.isRequired,
        // Injected by @translate:
        strings           : PropTypes.object
    };

    render() {
        const {matching, similarity, stats, ownImage, currentImage, interestsUrl, questionsUrl, isSomethingWorking, strings} = this.props;
        const commonAnswers = stats ? stats.commonAnswers : <span className="icon-spinner rotation-animation"></span>;
        const commonContent = stats ? stats.commonContent : <span className="icon-spinner rotation-animation"></span>;

        return (
            <div className="other-profile-data">
                <div className="other-profile-left">
                    <ProfilesAvatarConnection ownPicture={ownImage} otherPicture={currentImage}/>
                    <div className="other-profile-stats">
                        <div className="other-profile-stats">
                            <Link to={questionsUrl}>{commonAnswers} {strings.coincidences}</Link>
                        </div>
                        <div className="other-profile-stats">
                            <Link to={interestsUrl}>{commonContent} {strings.similarInterests}</Link>
                        </div>
                    </div>
                </div>
                {isSomethingWorking && !matching ?
                    <div className="other-profile-right">
                        <div className="calculating-matching">
                            {strings.calculatingMatching}
                            <div className={'icon-spinner rotation-animation'}></div>
                        </div>
                    </div>
                    :
                    <div className="other-profile-right">
                        <span> {matching ? Math.round(100*matching) : 0}% {strings.compatibility}</span>
                        <ProgressBar percentage={matching ? Math.round(100*matching) : 0}/>
                        <span> {similarity ? Math.round(100*similarity) : 0}% {strings.similarity}</span>
                        <ProgressBar percentage={similarity ? Math.round(100*similarity) : 0}/>
                    </div>
                }
            </div>
        );
    }
}

OtherProfileData.defaultProps = {
    strings: {
        coincidences       : 'Coincidences',
        similarInterests   : 'Similar interests',
        compatibility      : 'compatibility',
        similarity         : 'similarity',
        calculatingMatching: 'Calculating matching...'
    }
};