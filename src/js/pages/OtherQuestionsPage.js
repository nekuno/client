import React, { PropTypes, Component } from 'react';
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
    const {params} = props;
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']);
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
    const comparedStats = otherUserId ? ComparedStatsStore.get(currentUserId, otherUserId) : null;
    const isLoadingComparedQuestions = otherUserId ? QuestionStore.isLoadingComparedQuestions() : true;
    const hasNextComparedQuestion = QuestionStore.hasQuestion();
    const requestComparedQuestionsUrl = otherUserId ? QuestionStore.getRequestComparedQuestionsUrl(otherUserId, []) : null;

    return {
        otherQuestionsTotal,
        questions,
        otherQuestions,
        otherUser,
        comparedStats,
        isLoadingComparedQuestions,
        hasNextComparedQuestion,
        requestComparedQuestionsUrl
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
        otherUser                  : PropTypes.object,
        comparedStats              : PropTypes.object,
        isLoadingComparedQuestions : PropTypes.bool,
        hasNextComparedQuestion    : PropTypes.bool,
        requestComparedQuestionsUrl: PropTypes.string,
    };

    componentWillMount() {
        requestData(this.props);
    }

    componentDidUpdate(prevProps) {
        const {requestComparedQuestionsUrl, user, otherUser} = this.props;
        const otherUserId = parseId(otherUser);
        const userId = parseId(user);

        //Change to one action to multiple api calls (a queue) instead of timeout. Maybe merging with requestUser on requestData. See https://github.com/facebook/flux/issues/47#issuecomment-54716863
        setTimeout(() => {
            if (!prevProps.requestComparedQuestionsUrl && this.props.requestComparedQuestionsUrl) {
                QuestionActionCreators.requestComparedQuestions(userId, otherUserId, requestComparedQuestionsUrl);
            }

            if (!prevProps.otherUser && this.props.otherUser) {
                QuestionActionCreators.requestNextOtherQuestion(userId, otherUserId);
                UserActionCreators.requestComparedStats(userId, otherUserId);
            }
        }, 0);
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    onBottomScroll() {
        const {user, otherUser, isLoadingComparedQuestions, requestComparedQuestionsUrl} = this.props;
        if (isLoadingComparedQuestions || !requestComparedQuestionsUrl) {
            return Promise.resolve();
        }
        const userId = parseId(user);
        const otherUserId = parseId(otherUser);
        return QuestionActionCreators.requestComparedQuestions(userId, otherUserId, requestComparedQuestionsUrl);
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
            this.getBanner.bind(this)(),
            this.getQuestionsHeader.bind(this)()
        ]
    }

    render() {
        const {otherUser, user, questions, otherQuestions, isLoadingComparedQuestions, strings, params} = this.props;
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
                                                   onTimerEnd={this.onTimerEnd} isLoadingComparedQuestions={isLoadingComparedQuestions} onBottomScroll={this.onBottomScroll.bind(this)}/>
                                <br />
                                <br />
                                <br />
                            </div>
                            : ''
                        }
                    </div>
                </div>
            </div>
        );
    }

};

OtherQuestionsPage.defaultProps = {
    strings: {
        coincidences: 'Coincidences of',
        about       : 'About',
        photos      : 'Photos',
        questions   : 'Answers',
        interests   : 'Interests'
    }
};