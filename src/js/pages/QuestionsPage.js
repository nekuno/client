import React, { PropTypes, Component } from 'react';
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

function requestData(props) {
    const userId = parseId(props.user);
    if (Object.keys(props.pagination).length === 0) {
        QuestionActionCreators.requestQuestions(userId);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.user);
    const pagination = QuestionStore.getPagination(currentUserId) || {};
    const questions = QuestionStore.get(currentUserId) || {};
    return {
        pagination,
        questions
    };
}

@AuthenticatedComponent
@translate('QuestionsPage')
@connectToStores([UserStore, QuestionStore, StatsStore], getState)
export default class QuestionsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        pagination: PropTypes.object.isRequired,
        questions : PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);
    }

    componentWillMount() {
        requestData(this.props);
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    onBottomScroll() {
        const pagination = this.props.pagination;
        const nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        if (nextLink) {
            const userId = parseId(this.props.user);
            return QuestionActionCreators.requestNextQuestions(userId, nextLink);
        }

        return Promise.resolve();
    }

    getBanner() {
        const {user, pagination, questions} = this.props;
        return <QuestionsBanner user={user} questionsTotal={pagination.total || Object.keys(questions).length || 0}/>
    }

    getFirstItems() {
        return [
            this.getBanner.bind(this)()
        ]
    }

    render() {
        const {user, questions, strings} = this.props;
        const ownPicture = user && user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
        const defaultPicture = 'img/no-img/small.jpg';
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.about},
                    {'url': '/gallery', 'text': strings.photos},
                    {'url': '/questions', 'text': strings.questions},
                    {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={2} arrowUpLeft={'60%'}/>
                <div className="view view-main" id="questions-view-main">
                    <div className="page questions-page">
                        <div id="page-content" className="questions-content">
                            <QuestionList firstItems={this.getFirstItems.bind(this)()} questions={questions} userSlug={user.slug || ''} ownPicture={ownPicture} defaultPicture={defaultPicture} onTimerEnd={this.onTimerEnd} onBottomScroll={this.onBottomScroll.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

};

QuestionsPage.defaultProps = {
    strings: {
        myProfile: 'My profile',
        about    : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests'
    }
};