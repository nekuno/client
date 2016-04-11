import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../constants/Constants';
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

@AuthenticatedComponent
export default class RegisterQuestionLandingPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            questionId: PropTypes.string
        }),

        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired
    };


    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {

        let imgSrc = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="view view-main">
                <div className="page register-question-landing-page">
                    <div id="page-content" className="register-question-landing">
                        <div className="title"> Queremos conocerte un poco mejor</div>
                        <div className="excerpt"> Realiza el test respondiendo por ti y lo que te gustaría que respondiera otro usuario para ser
                            compatible contigo
                        </div>
                        <div id="register-question-landing-image"></div>
                        <div className="user-image-wrapper">
                            <div className="user-image">
                                <img src={imgSrc}/>
                            </div>
                        </div>
                        <div className="register-question-landing-button">
                            <Link to="/answer-question/next">
                                <FullWidthButton> HACER TEST </FullWidthButton>
                            </Link>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>
        );
    }

};