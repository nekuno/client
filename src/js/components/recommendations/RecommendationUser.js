import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Image from '../ui/Image';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import ProfileStore from '../../stores/ProfileStore';
import ComparedStatsStore from '../../stores/ComparedStatsStore';
import GalleryPhotoStore from '../../stores/GalleryPhotoStore';
import QuestionStore from '../../stores/QuestionStore';
import InterestStore from '../../stores/InterestStore';
import OtherProfileData from '../profile/OtherProfileData';
import OtherProfileDataList from '../profile/OtherProfileDataList';
import OtherQuestionList from '../questions/OtherQuestionList';
import CardContentList from '../interests/CardContentList';
import selectn from 'selectn';

function getState(props) {
    const userId = parseInt(props.userId);
    const otherUserId = parseInt(props.recommendation.id);
    const profileWithMetadata = ProfileStore.getWithMetadata(otherUserId);
    const stats = ComparedStatsStore.get(userId, otherUserId);
    const photos = GalleryPhotoStore.get(otherUserId);
    const noPhotos = GalleryPhotoStore.noPhotos(otherUserId);
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
        stats,
        photos,
        noPhotos,
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

function initPhotosSwiper(id) {
    // Init slider
    return nekunoApp.swiper('#photos-swiper-container-' + id, {
        effect          : 'coverflow',
        slidesPerView   : 'auto',
        coverflow       : {
            rotate      : 30,
            stretch     : 0,
            depth       : 100,
            modifier    : 1,
            slideShadows: false
        },
        centeredSlides  : true,
        paginationHide: false,
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });
}

@translate('RecommendationUser')
@connectToStores([], getState)
export default class RecommendationUser extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        accessibleKey : PropTypes.number.isRequired,
        userId        : PropTypes.number.isRequired,
        ownPicture    : PropTypes.string,
        currentTab    : PropTypes.string,
        onTabClick    : PropTypes.func
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleMessage = this.handleMessage.bind(this);
        this.onQuestionsLinkClick = this.onQuestionsLinkClick.bind(this);
        this.onInterestsLinkClick = this.onInterestsLinkClick.bind(this);
        this.onBackLinkClick = this.onBackLinkClick.bind(this);

        this.state = {
            photosLoaded: null
        };
    }

    componentDidUpdate() {
        if (this.props.photos.length > 0 && !this.state.photosLoaded) {
            initPhotosSwiper(this.props.recommendation.id);
            this.setState({photosLoaded: true})
        }
    }

    handleMessage() {
        this.context.history.pushState(null, `/conversations/${this.props.recommendation.id}`);
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

    render() {
        const {recommendation, accessibleKey, profileWithMetadata, stats, photos, questions, otherQuestions, questionsPagination,
            isLoadingComparedQuestions, interests, interestsPagination, isLoadingComparedInterests, userId, ownPicture, currentTab, strings} = this.props;
        const defaultSrc = 'img/no-img/big.jpg';
        let imgSrc = recommendation.photo ? recommendation.photo.thumbnail.big : defaultSrc;
        let ownImgSrc = ownPicture ? ownPicture : defaultSrc;

        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + accessibleKey}>
                    <div className="user-images">
                        <div className="user-images-wrapper">
                            <div className="swiper-custom">
                                <div id={"photos-swiper-container-" + recommendation.id} className="swiper-container">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide" key={0}>
                                            <Image src={imgSrc} defaultSrc={defaultSrc}/>
                                        </div>
                                        {photos && photos.length > 0 ? photos.map((photo, index) =>
                                            <div className="swiper-slide" key={index + 1}>
                                                <Image src={photo.thumbnail.big} defaultSrc={defaultSrc}/>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="swiper-button-prev"></div>
                                <div className="swiper-button-next"></div>
                            </div>
                        </div>
                    </div>
                    <Link to={`/profile/${recommendation.id}`} className="username-title">
                        {recommendation.username}
                    </Link>
                    <div className="send-message-button icon-wrapper icon-wrapper-with-text" onClick={this.handleMessage}>
                        <span className="icon-message"></span>
                        <span className="text">{strings.message}</span>
                    </div>
                    <div className="user-description">
                        <span className="icon-marker"></span> {selectn('location.locality', recommendation.profile) || selectn('location.address', recommendation.profile)} -
                        <span className="age"> {strings.age}: {recommendation.age}</span>
                    </div>
                    <div className="other-profile-wrapper bold">
                        <OtherProfileData matching={recommendation.matching}
                                          similarity={recommendation.similarity} stats={stats} ownImage={ownImgSrc}
                                          currentImage={imgSrc}
                                          interestsUrl={`/users/${recommendation.id}/other-interests`}
                                          questionsUrl={`/users/${recommendation.id}/other-questions`}
                        />
                    </div>
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
                        <div className={"other-questions-container paginated paginated-" +  + recommendation.id}>
                            <OtherQuestionList otherQuestions={otherQuestions} questions={questions}
                                               userId={recommendation.id} ownPicture={ownImgSrc}
                                               otherPicture={imgSrc}/>
                            {isLoadingComparedQuestions ? <div className="loading-gif" style={questionsPagination.nextLink ? {} : {display: 'none'}}></div> : null}
                        </div>
                        : currentTab == 'interests' ?
                        <div className={"other-interests-container paginated paginated-" +  + recommendation.id}>
                            <CardContentList contents={interests} userId={userId} otherUserId={recommendation.id}/>
                            <br />
                            {isLoadingComparedInterests ? <div className="loading-gif" style={interestsPagination.nextLink ? {} : {display: 'none'}}></div> : null}
                        </div>
                        :
                        <div>
                            <OtherProfileDataList profile={recommendation.profile}
                                                  profileWithMetadata={profileWithMetadata}/>
                        </div>
                    }
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

RecommendationUser.defaultProps = {
    strings: {
        age    : 'Age',
        message: 'Message',
        questions: 'Questions',
        interests: 'Interests',
    }
};