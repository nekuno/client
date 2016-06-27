import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../constants/Constants';
import FullWidthButton from '../components/ui/FullWidthButton';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';

function parseUserId(user) {
    return user.id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const {user, params} = props;
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : null;
    const currentUserId = parseUserId(user);
    QuestionActionCreators.requestQuestion(currentUserId, questionId);
}

@AuthenticatedComponent
@translate('RegisterQuestionLandingPage')
export default class RegisterQuestionLandingPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params : PropTypes.shape({
            questionId: PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {

        let imgSrc = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const strings = this.props.strings;

        return (
            <div className="view view-main">
                <div className="page register-question-landing-page">
                    <div id="page-content" className="register-question-landing">
                        <div className="title">{strings.title}</div>
                        <div className="excerpt">{strings.excerpt}</div>
                        <div id="register-question-landing-image"></div>
                        <div className="user-image-wrapper">
                            <div className="user-image">
                                <img src={imgSrc}/>
                            </div>
                        </div>
                        <div className="register-question-landing-button">
                            <Link to="/answer-question/next">
                                <FullWidthButton>{strings.next}</FullWidthButton>
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

RegisterQuestionLandingPage.defaultProps = {
    strings: {
        title  : 'We want to know you a little better',
        excerpt: 'Make the test answering for you and what you would like to answer another user to be compatible with you',
        next   : 'DO TEST'
    }
};