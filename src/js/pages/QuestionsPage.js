import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import QuestionList from '../components/questions/QuestionList';
import QuestionsBanner from '../components/questions/QuestionsBanner';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import StatsStore from '../stores/StatsStore';

function parseId(user) {
    return user.id;
}

function parsePicture(user) {
    return user && user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
}

function requestData(props) {
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.user);
    const questionsTotal = QuestionStore.ownAnswersLength(currentUserId);
    const questions = QuestionStore.get(currentUserId) || {};
    const requestQuestionsUrl = QuestionStore.getRequestQuestionsUrl(currentUserId);
    const isLoadingOwnQuestions = QuestionStore.isLoadingOwnQuestions();
    return {
        questionsTotal,
        questions,
        requestQuestionsUrl,
        isLoadingOwnQuestions
    };
}

@AuthenticatedComponent
@translate('QuestionsPage')
@connectToStores([UserStore, QuestionStore, StatsStore], getState)
export default class QuestionsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                 : PropTypes.object.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object,
        // Injected by @connectToStores:
        questionsTotal       : PropTypes.number.isRequired,
        questions            : PropTypes.object.isRequired,
        requestQuestionsUrl  : PropTypes.string.isRequired,
        isLoadingOwnQuestions: PropTypes.bool.isRequired,
    };

    componentWillMount() {
        requestData(this.props);
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    onBottomScroll() {
        const {user, requestQuestionsUrl, isLoadingOwnQuestions} = this.props;
        if (isLoadingOwnQuestions || !requestQuestionsUrl) {
            return Promise.resolve();
        }
        const userId = parseId(user);
        return QuestionActionCreators.requestQuestions(userId, requestQuestionsUrl);
    }

    getBanner() {
        const {user, questionsTotal} = this.props;
        return <QuestionsBanner user={user} questionsTotal={questionsTotal}/>
    }

    getFirstItems() {
        return [
            <div key="banner">{this.getBanner.bind(this)()}</div>
        ]
    }

    render() {
        const {user, questions, strings, isLoadingOwnQuestions} = this.props;
        const ownPicture = parsePicture(user);
        const defaultPicture = 'img/no-img/small.jpg';
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.about, 'icon': 'account'},
                    {'url': '/gallery', 'text': strings.photos, 'icon': 'camera-outline'},
                    {'url': '/questions', 'text': strings.questions, 'icon': 'comment-question-outline'},
                    {'url': '/interests', 'text': strings.interests, 'icon': 'thumbs-up-down'},
                ]} activeLinkIndex={2} arrowUpLeft={'60%'}/>
                <div className="view view-main" id="questions-view-main">
                    <div className="page questions-page">
                        <div id="page-content" className="questions-content with-tab-bar">
                            <QuestionList firstItems={this.getFirstItems.bind(this)()} questions={questions} userSlug={user.slug || ''} ownPicture={ownPicture}
                                          defaultPicture={defaultPicture} onTimerEnd={this.onTimerEnd} onBottomScroll={this.onBottomScroll.bind(this)} isLoadingOwnQuestions={isLoadingOwnQuestions}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

QuestionsPage.defaultProps = {
    strings: {
        myProfile: 'My profile',
        about    : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests'
    }
};