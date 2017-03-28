import React, { PropTypes, Component } from 'react';
import { ScrollContainer } from 'react-router-scroll';
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

function parseId(user) {
    return user.id;
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
@connectToStores([UserStore, QuestionStore], getState)
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

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            QuestionActionCreators.requestNextQuestions(parseId(this.props.user), nextLink);
        }
    }

    render() {
        const {user, pagination, questions, strings} = this.props;
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
                ]} activeLinkIndex={2} arrowUpLeft={'60%'} />
                <ScrollContainer scrollKey="own-questions">
                    <div className="view view-main" onScroll={this.handleScroll}>
                        <div className="page questions-page">
                            <div id="page-content" className="questions-content">
                                <QuestionsBanner user={user} questionsTotal={pagination.total || Object.keys(questions).length || 0}/>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <QuestionList questions={questions} userSlug={user.slug || ''} ownPicture={ownPicture} defaultPicture={defaultPicture} onTimerEnd={this.onTimerEnd}/>
                                <div className="loading-gif" style={pagination.nextLink ? {} : {display: 'none'}}></div>
                                <br />
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>
                </ScrollContainer>
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