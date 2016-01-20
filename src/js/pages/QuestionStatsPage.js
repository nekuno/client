import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import QuestionStats from '../components/questions/QuestionStats';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import QuestionsByUserIdStore from '../stores/QuestionsByUserIdStore';

function parseUserId(user) {
    return user.qnoow_id;
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const { user } = props;
    const currentUserId = parseUserId(user);
    const currentUser = UserStore.get(currentUserId);
    const question = QuestionStore.getQuestion();
    const userAnswer = QuestionStore.getUserAnswer(currentUserId, question.questionId);

    return {
        currentUser,
        question,
        userAnswer,
        user
    };
}

@connectToStores([UserStore, QuestionStore, QuestionsByUserIdStore], getState)
export default AuthenticatedComponent(class QuestionStatsPage extends Component {
    static propTypes = {

        // Injected by @connectToStores:
        question: PropTypes.object,
        userAnswer: PropTypes.object,

        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleContinueClick = this.handleContinueClick.bind(this);
    }

    render() {
        const user = this.props.user;
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Estadísticas'} rightText={'Continuar'} onRightLinkClickHandler={this.handleContinueClick} />
                <div data-page="index" className="page question-stats-page">
                    <div id="page-content" className="question-stats-content">
                        {this.props.userAnswer && this.props.question ?
                            <QuestionStats question={this.props.question} userAnswer={this.props.userAnswer} userId={user.qnoow_id}/>
                            :
                            <h1>Loading...</h1>
                        }
                    </div>
                </div>
            </div>
        );
    }

    handleContinueClick() {
        this.context.history.pushState(null, `/answer-question/next`);
    }
});