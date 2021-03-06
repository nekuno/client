import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ButtonFloating from '../components/ui/ButtonFloating';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';

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
    if (user.slug) {
        const profile = ProfileStore.get(user.slug);
        if (!profile) {
            UserActionCreators.requestOwnProfile(user.slug);
        }
    }
}

//TODO: Remove
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
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickAnswerQuestions = this.handleClickAnswerQuestions.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }
    
    handleClickAnswerQuestions() {
        let path = '/answer-question/next';
        if (!LoginStore.isComplete() || !ProfileStore.isComplete(this.props.user.slug)) {
            path = '/answer-user-fields';
        }

        RouterActionCreators.replaceRoute(path);
    }

    render() {

        let user = this.props.user;
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/small.jpg';
        const strings = this.props.strings;

        return (
            <div className="views">
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
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
                <ButtonFloating onClickHandler={this.handleClickAnswerQuestions} icon="arrow-right"/>
            </div>
        );
    }

}

RegisterQuestionLandingPage.defaultProps = {
    strings: {
        title  : 'We want to know you a little better',
        excerpt: 'Make the test answering for you and what you would like to answer another user to be compatible with you',
        next   : 'DO TEST'
    }
};