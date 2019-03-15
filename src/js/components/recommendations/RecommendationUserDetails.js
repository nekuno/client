import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import * as InterestsActionCreators from '../../actions/InterestsActionCreators';
import ProfileStore from '../../stores/ProfileStore';
import QuestionStore from '../../stores/QuestionStore';
import InterestStore from '../../stores/InterestStore';
import OtherProfileDataList from '../profile/OtherProfileDataList';
import OtherQuestionList from '../questions/OtherQuestionList';
import CardContentList from '../interests/CardContentList';
import TextRadios from '../ui/TextRadios';
import EmptyMessage from '../ui/EmptyMessage/EmptyMessage';

function getState(props) {
    const userId = parseInt(props.userId);
    const otherUserId = parseInt(props.recommendation.id);
    const profileWithMetadata = ProfileStore.getWithMetadata(otherUserId);
    const questions = QuestionStore.get(userId);
    const otherQuestions = QuestionStore.get(otherUserId) || {};
    const questionsPagination = QuestionStore.getPagination(otherUserId) || {};
    const isLoadingComparedQuestions = QuestionStore.isLoadingComparedQuestions();
    const interestsPagination = InterestStore.getPagination(otherUserId) || {};
    const interests = InterestStore.get(otherUserId) || [];
    const noInterests = InterestStore.noInterests(otherUserId) || false;
    const isLoadingComparedInterests = InterestStore.isLoadingComparedInterests(otherUserId) || false;

    return {
        profileWithMetadata,
        questions,
        otherQuestions,
        questionsPagination,
        isLoadingComparedQuestions,
        interestsPagination,
        interests,
        noInterests,
        isLoadingComparedInterests
    };
}

@translate('RecommendationUserDetails')
@connectToStores([QuestionStore, InterestStore], getState)
export default class RecommendationUserDetails extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        userId        : PropTypes.number.isRequired,
        ownPicture    : PropTypes.string,
        currentTab    : PropTypes.string,
        onTabClick    : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.onQuestionsLinkClick = this.onQuestionsLinkClick.bind(this);
        this.onInterestsLinkClick = this.onInterestsLinkClick.bind(this);
        this.onBackLinkClick = this.onBackLinkClick.bind(this);
        this.onFilterCommonClick = this.onFilterCommonClick.bind(this);
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);

        this.state = {
            type         : '',
            commonContent: 1,
        };
    }

    onQuestionsLinkClick() {
        this.props.onTabClick('questions');
    }

    onInterestsLinkClick() {
        this.props.onTabClick('interests');
    }

    onBackLinkClick() {
        this.props.onTabClick(null);
    }

    onFilterCommonClick(key) {
        const {recommendation, userId} = this.props;
        const {type} = this.state;
        InterestsActionCreators.resetInterests(recommendation.id);
        InterestsActionCreators.requestComparedInterests(userId, recommendation.id, type, key);
        this.setState({
            commonContent: key
        });
    }

    onFilterTypeClick(type) {
        this.setState({
            type: type
        });
    }

    render() {
        const {
            recommendation, profileWithMetadata, questions, otherQuestions, questionsPagination, isLoadingComparedQuestions,
            interests, interestsPagination, isLoadingComparedInterests, userId, ownPicture, currentTab, noInterests, strings
        } = this.props;
        const defaultSrc = 'img/no-img/big.jpg';
        let imgSrc = recommendation.photo ? recommendation.photo.thumbnail.big : defaultSrc;
        let ownImgSrc = ownPicture ? ownPicture : defaultSrc;

        return (
            <div>
                {currentTab == 'questions' ?
                    <div className="other-user-links single" onClick={this.onBackLinkClick}>
                        <div className="other-user-link-back">
                            <span className="icon-left-arrow"></span>
                        </div>
                        <div className="other-user-link-text">{strings.questions}</div>
                    </div>
                    : currentTab == 'interests' ?
                    <div className="other-user-links single" onClick={this.onBackLinkClick}>
                        <div className="other-user-link-back">
                            <span className="icon-left-arrow"></span>
                        </div>
                        <div className="other-user-link-text">{strings.interests}</div>
                    </div>
                    :
                    <div className="other-user-links">
                        <div className="other-user-questions-link"
                             onClick={this.onQuestionsLinkClick}>{strings.questions}</div>
                        <div className="other-user-interests-link"
                             onClick={this.onInterestsLinkClick}>{strings.interests}</div>
                    </div>
                }
                {currentTab == 'questions' ?
                    <div className={"other-questions-container paginated paginated-" + +recommendation.id}>
                        <div className="other-questions-stats-title title">{questionsPagination.total || 0} {strings.coincidences}</div>
                        <OtherQuestionList otherQuestions={otherQuestions} questions={questions}
                                           userId={recommendation.id} ownPicture={ownImgSrc}
                                           otherPicture={imgSrc}/>
                        {isLoadingComparedQuestions ? <div className="loading-gif" style={questionsPagination.nextLink ? {} : {display: 'none'}}></div> : null}
                    </div>
                    : currentTab == 'interests' ?
                    <div className={"other-interests-container paginated paginated-" + +recommendation.id}>
                        <div className="title">{isLoadingComparedInterests ?
                            <span className="icon-spinner rotation-animation"></span> : this.state.commonContent ? strings.similarInterestsCount.replace('%count%', interestsPagination.total || 0) : strings.interestsCount.replace('%count%', interestsPagination.total || 0)}</div>
                        <div className="common-content-switch">
                            <TextRadios labels={[{key: 0, text: strings.all}, {key: 1, text: strings.common}]} value={this.state.commonContent} onClickHandler={this.onFilterCommonClick}/>
                        </div>
                        {noInterests ?
                            <EmptyMessage text={strings.noInterests}/>
                            :
                            <CardContentList contents={interests} userId={userId} otherUserId={recommendation.id}/>
                        }
                        <br />
                        {isLoadingComparedInterests ? <div className="loading-gif" style={interestsPagination.nextLink ? {} : {display: 'none'}}></div> : null}
                    </div>
                    :
                    <div>
                        <OtherProfileDataList profileWithMetadata={profileWithMetadata}/>
                    </div>
                }
            </div>
        );
    }
}

RecommendationUserDetails.defaultProps = {
    strings: {
        questions            : 'Questions',
        coincidences         : 'Coincidences',
        interests            : 'Interests',
        noInterests          : 'There are no interests',
        common               : 'In common',
        all                  : 'All',
        interestsCount       : '%count% Interests',
        similarInterestsCount: '%count% Similar interests',
    }
};