import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar/';
import LoadingSpinnerCSS from '../components/ui/LoadingSpinnerCSS'
import OtherQuestionList from '../components/questions/OtherQuestionList';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';
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
    const {params, user, otherUser, isLoadingComparedStats, isLoadingComparedQuestions, requestNotAnsweredUrl, requestSameAnswersUrl, requestDifferentAnswersUrl,} = props;
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']);

    const userId = parseId(user);
    const otherUserId = parseId(otherUser);
    if (userId && otherUserId && !isLoadingComparedStats) {
        UserActionCreators.requestComparedStats(userId, otherUserId);
    }

    if (userId && otherUserId && !isLoadingComparedQuestions) {
        QuestionActionCreators.requestComparedQuestions(otherUserId, requestNotAnsweredUrl);
        QuestionActionCreators.requestDifferentAnswerQuestions(otherUserId, requestDifferentAnswersUrl);
        QuestionActionCreators.requestSameAnswerQuestions(otherUserId, requestSameAnswersUrl);
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
    const otherSameAnswerQuestions = otherUser ? QuestionStore.getOtherSameAnswer(otherUserId) : {};
    const otherDifferentAnswerQuestions = otherUser ? QuestionStore.getOtherDifferentAnswer(otherUserId) : {};
    const otherNotAnsweredCount = otherUser ? QuestionStore.getOtherNotAnsweredCount(otherUserId) : 0;
    const otherSameAnswerCount = otherUser ? QuestionStore.getOtherSameAnswerCount(otherUserId) : 0;
    const otherDifferentAnswerCount = otherUser ? QuestionStore.getOtherDifferentAnswerCount(otherUserId) : 0;
    const comparedStats = otherUserId ? ComparedStatsStore.get(currentUserId, otherUserId) : null;
    const isRequestedQuestion = otherUserId ? QuestionStore.isRequestedQuestion(otherUserId) : true;
    const isLoadingComparedStats = otherUserId ? ComparedStatsStore.isLoadingComparedStats() : true;

    const isLoadingComparedQuestions = otherUserId ? QuestionStore.isLoadingComparedQuestions() : true;
    const isLoadingSameAnswer = otherUserId ? QuestionStore.isLoadingSameAnswer() : true;
    const isLoadingDifferentAnswer = otherUserId ? QuestionStore.isLoadingDifferentAnswer() : true;

    const hasReceivedNotAnsweredPagination = QuestionStore.hasReceivedComparedQuestionsPaginationOnce(otherUserId);
    const hasReceivedSameAnswerPagination = QuestionStore.hasReceivedSameAnswerPaginationOnce(otherUserId);
    const hasReceivedDifferentAnswerPagination = QuestionStore.hasReceivedDifferentAnswerPaginationOnce(otherUserId);

    const hasNextComparedQuestion = QuestionStore.hasQuestion();

    const requestSameAnswersUrl = otherUserId ? QuestionStore.getSameAnswersPaginationUrl(otherUserId, []) : null;
    const requestDifferentAnswersUrl = otherUserId ? QuestionStore.getDifferentAnswersPaginationUrl(otherUserId, []) : null;
    const requestNotAnsweredUrl = otherUserId ? QuestionStore.getComparedQuestionsPaginationUrl(otherUserId, []) : null;

    return {
        otherQuestionsTotal,
        questions,
        otherQuestions,
        otherUser,
        comparedStats,
        isRequestedQuestion,
        isLoadingComparedStats,

        isLoadingComparedQuestions,
        isLoadingSameAnswer,
        isLoadingDifferentAnswer,

        hasReceivedNotAnsweredPagination,
        hasReceivedSameAnswerPagination,
        hasReceivedDifferentAnswerPagination,

        hasNextComparedQuestion,
        otherNotAnsweredQuestions,
        otherSameAnswerQuestions,
        otherDifferentAnswerQuestions,
        otherNotAnsweredCount,
        otherSameAnswerCount,
        otherDifferentAnswerCount,
        requestNotAnsweredUrl,
        requestSameAnswersUrl,
        requestDifferentAnswersUrl,
    };
}

@AuthenticatedComponent
@translate('OtherQuestionsPage')
@connectToStores([UserStore, QuestionStore, ComparedStatsStore], getState)
export default class OtherQuestionsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params                              : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }),
        // Injected by @AuthenticatedComponent
        user                                : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                             : PropTypes.object,
        // Injected by @connectToStores:
        otherQuestionsTotal                 : PropTypes.number.isRequired,
        questions                           : PropTypes.object,
        otherQuestions                      : PropTypes.object.isRequired,
        otherNotAnsweredQuestions           : PropTypes.object.isRequired,
        otherNotAnsweredCount               : PropTypes.number,
        otherSameAnswerQuestions            : PropTypes.object.isRequired,
        otherSameAnswerCount                : PropTypes.number,
        otherDifferentAnswerQuestions       : PropTypes.object.isRequired,
        otherDifferentAnswerCount           : PropTypes.number,
        otherUser                           : PropTypes.object,
        comparedStats                       : PropTypes.object,
        isRequestedQuestion                 : PropTypes.bool,
        isLoadingComparedQuestions          : PropTypes.bool,
        isLoadingSameAnswer                 : PropTypes.bool,
        isLoadingDifferentAnswer            : PropTypes.bool,
        isLoadingComparedStats              : PropTypes.bool,
        hasReceivedNotAnsweredPagination    : PropTypes.bool,
        hasReceivedSameAnswerPagination     : PropTypes.bool,
        hasReceivedDifferentAnswerPagination: PropTypes.bool,
        hasNextComparedQuestion             : PropTypes.bool,
        requestNotAnsweredUrl               : PropTypes.string,
        requestSameAnswersUrl               : PropTypes.string,
        requestDifferentAnswersUrl          : PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.requestPagination = this.requestPagination.bind(this);
        this.requestSameAnswerQuestions = this.requestSameAnswerQuestions.bind(this);
        this.requestDifferentAnswerQuestions = this.requestDifferentAnswerQuestions.bind(this);
        this.requestNotAnsweredQuestions = this.requestNotAnsweredQuestions.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        const {user, otherUser, comparedStats, isLoadingComparedStats, isRequestedQuestion, otherSameAnswerCount, otherDifferentAnswerCount, otherNotAnsweredCount, hasReceivedSameAnswerPagination, hasReceivedDifferentAnswerPagination, hasReceivedNotAnsweredPagination} = this.props;
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

        if (otherDifferentAnswerCount === 0 && !hasReceivedDifferentAnswerPagination) {
            this.requestDifferentAnswerQuestions();
        }
        if (otherSameAnswerCount === 0 && !hasReceivedSameAnswerPagination) {
            this.requestSameAnswerQuestions();
        }
        if (otherNotAnsweredCount === 0 && !hasReceivedNotAnsweredPagination) {
            this.requestNotAnsweredQuestions();
        }
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    onBottomScroll(state) {
        const {isLoadingComparedQuestions, requestComparedQuestionsUrl} = this.props;
        if (isLoadingComparedQuestions || !requestComparedQuestionsUrl) {
            return Promise.resolve();
        }

        return this.requestPagination(state);
    }

    //TODO: Here for now, better inside OtherQuestionList
    requestPagination(state) {
        switch (state) {
            case 'agree':
                return this.requestSameAnswerQuestions();
            case 'disagree':
                return this.requestDifferentAnswerQuestions();
            case 'explore':
                return this.requestNotAnsweredQuestions();
        }
    }

    requestSameAnswerQuestions() {
        const {otherUser, requestSameAnswersUrl, isLoadingSameAnswer} = this.props;
        const otherUserId = parseId(otherUser);
        if (isLoadingSameAnswer || !requestSameAnswersUrl) {
            return;
        }

        return QuestionActionCreators.requestSameAnswerQuestions(otherUserId, requestSameAnswersUrl);
    }

    requestDifferentAnswerQuestions() {
        const {otherUser, requestDifferentAnswersUrl, isLoadingDifferentAnswer} = this.props;
        const otherUserId = parseId(otherUser);
        if (isLoadingDifferentAnswer || !requestDifferentAnswersUrl) {
            return;
        }
        return QuestionActionCreators.requestDifferentAnswerQuestions(otherUserId, requestDifferentAnswersUrl);
    }

    requestNotAnsweredQuestions() {
        const {otherUser, requestNotAnsweredUrl, isLoadingComparedQuestions} = this.props;
        const otherUserId = parseId(otherUser);
        if (isLoadingComparedQuestions || !requestNotAnsweredUrl) {
            return;
        }
        return QuestionActionCreators.requestComparedQuestions(otherUserId, requestNotAnsweredUrl);
    }

    getQuestionsHeader() {
        const {user, otherUser, comparedStats, isLoadingComparedQuestions, strings, otherSameAnswerCount, otherDifferentAnswerCount} = this.props;
        const ownPicture = parsePicture(user);
        const otherPicture = parsePicture(otherUser);
        const totalComparedStats = isLoadingComparedQuestions || !comparedStats ? <LoadingSpinnerCSS small={true}/> : comparedStats.commonAnswers || 0;
        const computedQuestionsTotal = isLoadingComparedQuestions ? <LoadingSpinnerCSS small={true}/> : (otherSameAnswerCount + otherDifferentAnswerCount) || 0;

        return <div className="other-questions-header-container">
            <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherPicture}/>
            <div className="other-questions-stats-title title">{totalComparedStats} {strings.coincidences} {computedQuestionsTotal}</div>
        </div>
    }

    getFirstItems() {
        return [
            /* <div key="banner">{this.getBanner.bind(this)()}</div>, */
            <div key="questions-header">{this.getQuestionsHeader.bind(this)()}</div>
        ]
    }

    render() {
        const {otherUser, user, questions, otherQuestions, otherNotAnsweredQuestions, otherSameAnswerQuestions, otherDifferentAnswerQuestions, otherNotAnsweredCount, otherSameAnswerCount, otherDifferentAnswerCount, isLoadingComparedQuestions, strings, params} = this.props;
        const ownPicture = parsePicture(user);
        const otherPicture = parsePicture(otherUser);
        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={otherUser ? otherUser.username : ''} user={user}/>
                {otherUser ?
                    <ToolBar links={[
                        {'url': `/p/${params.slug}`, 'text': strings.about, 'icon': 'account'},
                        {'url': `/users/${params.slug}/other-questions`, 'text': strings.questions, 'icon': 'comment-question'},
                        {'url': `/users/${params.slug}/other-interests`, 'text': strings.interests, 'icon': 'thumbs-up-down'}
                    ]} activeLinkIndex={1} arrowUpLeft={'48%'}/>
                    : null}
                <div className="view view-main" id="questions-view-main">
                    <div className="page other-questions-page">
                        {user && otherUser && questions ?
                            <div id="page-content" className="other-questions-content with-tab-bar">
                                <OtherQuestionList firstItems={this.getFirstItems.bind(this)()} otherQuestions={otherQuestions} questions={questions} otherUserSlug={otherUser.slug || ''} ownPicture={ownPicture} otherPicture={otherPicture}
                                                   onTimerEnd={this.onTimerEnd} isLoadingComparedQuestions={isLoadingComparedQuestions} onBottomScroll={this.onBottomScroll.bind(this)}
                                                   otherNotAnsweredQuestions={otherNotAnsweredQuestions} otherSameAnswerQuestions={otherSameAnswerQuestions} otherDifferentAnswerQuestions={otherDifferentAnswerQuestions}
                                                   otherNotAnsweredCount={otherNotAnsweredCount} otherSameAnswerCount={otherSameAnswerCount} otherDifferentAnswerCount={otherDifferentAnswerCount}
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