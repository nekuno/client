import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
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
import QuestionsByUserIdStore from '../stores/QuestionsByUserIdStore';

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
@connectToStores([UserStore, QuestionStore, QuestionsByUserIdStore], getState)
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
        const ownPicture = user && user.photo ? user.photo.thumbnail.small : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const defaultPicture = `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <div className="page questions-page">
                    <div id="page-content" className="questions-content">
                        <QuestionsBanner user={user} questionsTotal={pagination.total || Object.keys(questions).length || 0}/>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <QuestionList questions={questions} userId={parseId(user)} ownPicture={ownPicture} defaultPicture={defaultPicture}/>
                        <div className="loading-gif" style={pagination.nextLink ? {} : {display: 'none'}}></div>
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
                <ToolBar links={[
                {'url': '/profile', 'text': strings.about},
                {'url': '/gallery', 'text': strings.photos},
                {'url': '/questions', 'text': strings.questions},
                {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={2} arrowUpLeft={'60%'} />
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