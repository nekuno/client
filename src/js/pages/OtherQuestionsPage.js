import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import LoadingSpinnerCSS from '../components/ui/LoadingSpinnerCSS'
import OtherQuestionList from '../components/questions/OtherQuestionList';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';
import OtherQuestionsBanner from '../components/questions/OtherQuestionsBanner';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import ComparedStatsStore from '../stores/ComparedStatsStore';

function parseId(user) {
    return user ? user.id : null;
}

function parsePicture(user) {
    return user && user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const {params, user, otherUser, isLoadingComparedStats, isLoadingComparedQuestions, requestComparedQuestionsUrl} = props;
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']);

    const userId = parseId(user);
    const otherUserId = parseId(otherUser);
    if (userId && otherUserId && !isLoadingComparedStats) {
        UserActionCreators.requestComparedStats(userId, otherUserId);
    }
    if (userId && otherUserId && !isLoadingComparedQuestions) {
        QuestionActionCreators.requestComparedQuestions(otherUserId, requestComparedQuestionsUrl);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const otherUserSlug = props.params.slug;
    const otherUser = UserStore.getBySlug(otherUserSlug);
    const otherUserId = otherUser ? parseId(otherUser) : null;
    const currentUserId = parseId(props.user);
    const otherQuestionsTotal = QuestionStore.otherAnswersLength(otherUserId);
    const questions = QuestionStore.get(currentUserId) || {};
    const otherQuestions = otherUser ? QuestionStore.getCompared(otherUserId) || {} : {};
    const otherNotAnsweredQuestions = otherUser ? QuestionStore.getOtherNotAnsweredQuestions(otherUserId) || {} : {};
    const comparedStats = otherUserId ? ComparedStatsStore.get(currentUserId, otherUserId) : null;
    const isRequestedQuestion = otherUserId ? QuestionStore.isRequestedQuestion(otherUserId) : true;
    const isLoadingComparedStats = otherUserId ? ComparedStatsStore.isLoadingComparedStats() : true;
    const isLoadingComparedQuestions = otherUserId ? QuestionStore.isLoadingComparedQuestions() : true;
    const hasNextComparedQuestion = QuestionStore.hasQuestion();
    const requestComparedQuestionsUrl = otherUserId ? QuestionStore.getRequestComparedQuestionsUrl(otherUserId, []) : null;

    return {
        otherQuestionsTotal,
        questions,
        otherQuestions,
        otherUser,
        comparedStats,
        isRequestedQuestion,
        isLoadingComparedStats,
        isLoadingComparedQuestions,
        hasNextComparedQuestion,
        requestComparedQuestionsUrl,
        otherNotAnsweredQuestions
    };
}

@AuthenticatedComponent
@translate('OtherQuestionsPage')
@connectToStores([UserStore, QuestionStore, ComparedStatsStore], getState)
export default class OtherQuestionsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params                     : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }),
        // Injected by @AuthenticatedComponent
        user                       : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                    : PropTypes.object,
        // Injected by @connectToStores:
        otherQuestionsTotal        : PropTypes.number.isRequired,
        questions                  : PropTypes.object,
        otherQuestions             : PropTypes.object.isRequired,
        otherNotAnsweredQuestions  : PropTypes.object.isRequired,
        otherUser                  : PropTypes.object,
        comparedStats              : PropTypes.object,
        isRequestedQuestion        : PropTypes.bool,
        isLoadingComparedQuestions : PropTypes.bool,
        isLoadingComparedStats     : PropTypes.bool,
        hasNextComparedQuestion    : PropTypes.bool,
        requestComparedQuestionsUrl: PropTypes.string,
    };

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        const {user, otherUser, comparedStats, isLoadingComparedStats, isRequestedQuestion} = this.props;
        const otherUserId = parseId(otherUser);
        const userId = parseId(user);

        const haveBothIds = userId && otherUserId;
        if (haveBothIds) {
            if (!comparedStats && !isLoadingComparedStats) {
                UserActionCreators.requestComparedStats(userId, otherUserId);
            }
            if (!isRequestedQuestion) {
                QuestionActionCreators.requestNextOtherQuestion(userId, otherUserId);
            }
        }
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    onBottomScroll() {
        const {otherUser, isLoadingComparedQuestions, requestComparedQuestionsUrl} = this.props;
        if (isLoadingComparedQuestions || !requestComparedQuestionsUrl) {
            return Promise.resolve();
        }
        const otherUserId = parseId(otherUser);
        return QuestionActionCreators.requestComparedQuestions(otherUserId, requestComparedQuestionsUrl);
    }

    getBanner() {
        const {otherUser, questionsTotal, questions} = this.props;
        const mustRenderBanner = !this.areAllQuestionsAnswered();
        return mustRenderBanner ? <OtherQuestionsBanner user={otherUser} questionsTotal={questionsTotal || Object.keys(questions).length || 0}/> : '';
    }

    areAllQuestionsAnswered() {
        return !this.props.hasNextComparedQuestion;
    }

    getQuestionsHeader() {
        const {user, otherUser, comparedStats, isLoadingComparedQuestions, strings, otherQuestionsTotal} = this.props;
        const ownPicture = parsePicture(user);
        const otherPicture = parsePicture(otherUser);
        const totalComparedStats = isLoadingComparedQuestions || !comparedStats ? <LoadingSpinnerCSS small={true}/> : comparedStats.commonAnswers || 0;
        const computedQuestionsTotal = isLoadingComparedQuestions ? <LoadingSpinnerCSS small={true}/> : otherQuestionsTotal || 0;

        return <div className="other-questions-header-container">
            <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherPicture}/>
            <div className="other-questions-stats-title title">{totalComparedStats} {strings.coincidences} {computedQuestionsTotal}</div>
        </div>
    }

    getFirstItems() {
        return [
            <div key="banner">{this.getBanner.bind(this)()}</div>,
            <div key="questions-header">{this.getQuestionsHeader.bind(this)()}</div>
        ]
    }

    render() {
        const {otherUser, user, questions, otherQuestions, otherNotAnsweredQuestions, isLoadingComparedQuestions, strings, params} = this.props;
        const ownPicture = parsePicture(user);
        const otherPicture = parsePicture(otherUser);
        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={otherUser ? otherUser.username : ''}/>
                {otherUser ?
                    <ToolBar links={[
                        {'url': `/p/${params.slug}`, 'text': strings.about},
                        {'url': `/users/${params.slug}/other-questions`, 'text': strings.questions},
                        {'url': `/users/${params.slug}/other-interests`, 'text': strings.interests}
                    ]} activeLinkIndex={1} arrowUpLeft={'48%'}/>
                    : null}
                <div className="view view-main" id="questions-view-main">
                    <div className="page other-questions-page">
                        {user && otherUser && questions ?
                            <div id="page-content" className="other-questions-content">
                                <OtherQuestionList firstItems={this.getFirstItems.bind(this)()} otherQuestions={otherQuestions} questions={questions} otherUserSlug={otherUser.slug || ''} ownPicture={ownPicture} otherPicture={otherPicture}
                                                   onTimerEnd={this.onTimerEnd} isLoadingComparedQuestions={isLoadingComparedQuestions} onBottomScroll={this.onBottomScroll.bind(this)}
                                                   otherNotAnsweredQuestions={otherNotAnsweredQuestions}
                                />
                                <br/>
                                <br/>
                                <br/>
                            </div>
                            : ''
                        }
                    </div>
                </div>
            </div>
        );
    }

}

OtherQuestionsPage.defaultProps = {
    strings: {
        coincidences: 'Coincidences of',
        about       : 'About',
        photos      : 'Photos',
        questions   : 'Answers',
        interests   : 'Interests'
    }
};