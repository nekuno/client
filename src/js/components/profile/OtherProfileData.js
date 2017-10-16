import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import ProgressBar from '../ui/ProgressBar';
import ProfilesAvatarConnection from '../ui/ProfilesAvatarConnection';
import Image from '../ui/Image';
import {} from '../../constants/Constants';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import * as UserActionCreators from '../../actions/UserActionCreators';
import WorkersStore from '../../stores/WorkersStore';
import GroupStore from '../../stores/GroupStore';

function requestData(props) {
    const {userId, otherUserId} = props;
    UserActionCreators.requestMatching(userId, otherUserId);
    UserActionCreators.requestSimilarity(userId, otherUserId);
    UserActionCreators.requestComparedStats(userId, otherUserId);
}

function getState(props) {
    const isSomethingWorking = WorkersStore.isSomethingWorking();
    const groups = GroupStore.groups;

    return {
        isSomethingWorking,
        groups
    };
}

@translate('OtherProfileData')
@connectToStores([WorkersStore, GroupStore], getState)
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
        groups            : PropTypes.object,
        userId            : PropTypes.number.isRequired,
        otherUserId       : PropTypes.number.isRequired,
        // Injected by @translate:
        strings           : PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isSomethingWorking && !this.props.isSomethingWorking) {
            setTimeout(() => { requestData(this.props) }, 0);
        }
    }

    goToGroupPage(id) {
        this.context.router.push(`/badges/${id}/discover`);
    }

    render() {
        const {matching, similarity, stats, groups, ownImage, currentImage, interestsUrl, questionsUrl, isSomethingWorking, strings} = this.props;
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
                {stats && stats.groupsBelonged && stats.groupsBelonged.length > 0 ?
                    <div className="common-groups">
                        <div className="common-groups-title">{strings.commonGroups}</div>
                        {stats.groupsBelonged.map((groupBelonged, index) => {
                            const groupIndex = groups ? Object.keys(groups).find(id => id == groupBelonged.id) : null;

                            return groupIndex && groups[groupIndex] && groups[groupIndex].invitation ?
                                <div className="small-icon-wrapper" key={index} onClick={this.goToGroupPage.bind(this, groupBelonged.id)}>
                                    <Image src={groups[groupIndex].invitation.invitation_image_url} defaultSrc={'img/default-content-image-squared-small.jpg'} width="28" height="28"/>
                                </div>
                                : null;
                        })}
                    </div>
                    : null
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
        calculatingMatching: 'Calculating matching...',
        commonGroups       : 'Common badges'
    }
};