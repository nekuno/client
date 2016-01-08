import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import QuestionList from '../components/questions/QuestionList';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';

function parseId(user) {
    return user.qnoow_id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    //user === logged user
    const { params, user, userLoggedIn } = props;
    //current === user whose profile is being viewed
    const currentUserId = parseId(user);

    UserActionCreators.requestQuestions(currentUserId);

}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.params);
    const {userLoggedIn, user} = props;
    //to use when changing route
    const currentUser = UserStore.get(currentUserId);
    const questions = QuestionStore.get(currentUserId);
    const answers = QuestionStore.getAnswers();
    const userAnswers = QuestionStore.getUserAnswers();

    return {
        currentUser,
        questions,
        answers,
        userAnswers,
        userLoggedIn,
        user
    };
}

@connectToStores([UserStore, QuestionStore], getState)
export default AuthenticatedComponent(class QuestionsPage extends Component {
    static propTypes = {
        // Injected by @connectToStores:
        questions: PropTypes.object.isRequired,
        answers: PropTypes.object.isRequired,
        userAnswers: PropTypes.object.isRequired,

        // Injected by AuthenticatedComponent
        user: PropTypes.object
    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        if (!this.props.questions) {
            return null;
        }

        const ownPicture = this.props.user && this.props.user.picture ? this.props.user.picture : `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const defaultPicture = `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Mi Perfil'}/>
                <div data-page="index" className="page questions-page">
                    <div id="page-content" className="questions-content">
                        <QuestionList questions={this.props.questions} userAnswers={this.props.userAnswers} answers={this.props.answers} userId={this.props.user.qnoow_id} ownPicture={ownPicture} defaultPicture={defaultPicture} />
                    </div>
                </div>
                <ToolBar links={[
                {'url': `/profile/${selectn('qnoow_id', this.props.user)}`, 'text': 'Sobre mí'},
                {'url': '/questions', 'text': 'Respuestas'},
                {'url': '/interests', 'text': 'Intereses'}
                ]} activeLinkIndex={1}/>
            </div>
        );
    }
});