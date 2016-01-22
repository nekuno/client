import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import QuestionList from '../components/questions/QuestionList';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import QuestionsByUserIdStore from '../stores/QuestionsByUserIdStore';

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

    QuestionActionCreators.requestQuestions(currentUserId);


}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.user);
    const {userLoggedIn, user} = props;
    const currentUser = UserStore.get(currentUserId);
    const questions = QuestionStore.get(currentUserId);
    const pagination = QuestionStore.getPagination(currentUserId);
    return {
        currentUser,
        pagination,
        questions,
        userLoggedIn,
        user
    };
}

@connectToStores([UserStore, QuestionStore, QuestionsByUserIdStore], getState)
export default AuthenticatedComponent(class QuestionsPage extends Component {
    static propTypes = {
        // Injected by @connectToStores:
        questions: PropTypes.object,
        pagination: PropTypes.object,

        // Injected by AuthenticatedComponent
        user: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    render() {
        if (!this.props.questions || !this.props.user) {
            return null;
        }

        const ownPicture = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}/media/cache/user_avatar_60x60/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const defaultPicture = `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <LeftMenuTopNavbar centerText={'Mi Perfil'}/>
                <div data-page="index" className="page questions-page">
                    <div id="page-content" className="questions-content">
                        <div className="answer-questions-link-container">
                            <Link to="/answer-question/next">
                                <div className="answer-questions-link-title">
                                    ¿Quieres que hilemos más fino?
                                </div>
                                <div className="answer-questions-link-text">
                                    Responde más preguntas del test
                                </div>
                                <div className="answer-questions-link-stats">
                                    645 de 1234 preguntas completadas
                                </div>
                            </Link>
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <QuestionList questions={this.props.questions} userId={this.props.user.qnoow_id} ownPicture={ownPicture} defaultPicture={defaultPicture} />
                        <div className="loading-gif" style={this.props.pagination.nextLink ? {} : {display: 'none'}}></div>
                        <br />
                        <br />
                        <br />
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

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            QuestionActionCreators.requestNextQuestions(parseId(this.props.user), nextLink);
        }
    }
});