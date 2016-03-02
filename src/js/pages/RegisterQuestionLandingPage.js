import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import FullWidthButton from '../components/ui/FullWidthButton';
import TopRightLink from '../components/ui/TopRightLink';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';

import * as QuestionActionCreators from '../actions/QuestionActionCreators';

function parseUserId(user) {
    return user.qnoow_id;
}



/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const { user, params } = props;
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : null;
    const currentUserId = parseUserId(user);
    QuestionActionCreators.requestQuestion(currentUserId, questionId);
}

export default AuthenticatedComponent(class RegisterQuestionLandingPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            questionId: PropTypes.string
        }),

        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
    };


    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    render() {

        const imgSrc = this.props.user.picture;
        return (
            <div className="view view-main">
                /*<TopRightLink text="Omitir" onClickHandler={this.skipRegisterQuestions()} />*/
                <h1> Queremos conocerte un poco mejor </h1>
                <h3> Realiza el test respondiendo por ti y lo que te gustaría que respondiera otro usuario para ser compatible contigo </h3>
                <div className="user-image">
                    <img src={imgSrc} />
                </div>
                <Link to="/answer-question-next">
                    <FullWidthButton> HACER TEST </FullWidthButton>
                </Link>

            </div>
        );
    }

})