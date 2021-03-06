import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage/EmptyMessage';
import EmailField from '../components/fieldsQuestions/userFields/EmailField';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import RegisterStore from '../stores/RegisterStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';
import LoginStore from '../stores/LoginStore';
import Framework7Service from '../services/Framework7Service';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    if (!ProfileStore.get(props.user.slug)) {
        UserActionCreators.requestOwnProfile(props.user.slug);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const userId = parseId(props.user);
    const profile = ProfileStore.get(props.user.slug);
    const errors = LoginStore.error;
    const registerQuestionsLength = QuestionStore.registerQuestionsLength();
    const answersLength = QuestionStore.ownAnswersLength(userId);
    const initialUserQuestionsCount = LoginStore.getInitialRequiredUserQuestionsCount();
    const userQuestionsCount = LoginStore.getRequiredUserQuestionsCount();
    const userQuestionsComplete = LoginStore.isComplete();
    const nextUserField = LoginStore.getNextRequiredUserField();
    const initialProfileQuestionsCount = ProfileStore.getInitialRequiredProfileQuestionsCount();
    const profileQuestionsLeftCount = ProfileStore.getRequiredProfileQuestionsLeftCount(props.user.slug);
    const profileQuestionsComplete = ProfileStore.isComplete(props.user.slug);
    const profileQuestionsCount = initialProfileQuestionsCount - profileQuestionsLeftCount;
    const totalQuestions = initialUserQuestionsCount + initialProfileQuestionsCount + registerQuestionsLength;
    const questionNumber = userQuestionsCount + profileQuestionsCount + answersLength + 1;

    return {
        profile,
        errors,
        userQuestionsComplete,
        nextUserField,
        profileQuestionsComplete,
        totalQuestions,
        questionNumber
    };
}

//TODO: Remove
@AuthenticatedComponent
@translate('AnswerUserFieldPage')
@connectToStores([RegisterStore, LoginStore, ProfileStore, QuestionStore], getState)
export default class AnswerUserFieldPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                    : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                 : PropTypes.object,
        // Injected by @connectToStores:
        errors                  : PropTypes.string,
        userQuestionsComplete   : PropTypes.bool,
        nextUserField           : PropTypes.object,
        profileQuestionsComplete: PropTypes.bool,
        totalQuestions          : PropTypes.number,
        questionNumber          : PropTypes.number
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickSave = this.handleClickSave.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }
    
    componentWillUpdate(nextProps) {
        if (nextProps.errors) {
            Framework7Service.nekunoApp().alert(nextProps.errors);
        }
        else if (nextProps.userQuestionsComplete) {
            let path = '/answer-question/next';
            if (!nextProps.profileQuestionsComplete) {
                path = '/answer-profile-fields';
            }
            window.setTimeout(() =>  { RouterActionCreators.replaceRoute(path); }, 0);
        }
    }

    handleClickSave(fieldName, data) {
        let user = {};
        user[fieldName] = data;
        UserActionCreators.editUser(user);
    }
    
    render() {

        const {user, profile, strings, nextUserField, totalQuestions, questionNumber} = this.props;
        const navBarTitle = typeof profile != 'undefined' ?
            strings.question + ' ' + questionNumber + '/' + totalQuestions
            : '';
        let fieldToRender = null;
        const nextUserFieldName = nextUserField ? nextUserField.name : null;
        switch (nextUserFieldName) {
            case 'email':
                fieldToRender = <EmailField email={user.email} onSaveHandler={this.handleClickSave} />;
                break;

            default:
        }

        return (
            <div className="views">
                <TopNavBar centerText={navBarTitle}/>
                <div className="view view-main">
                    <div className="page answer-question-page">
                        <div id="page-content" className="answer-question-content">
                            {typeof profile != 'undefined' ? fieldToRender : <EmptyMessage text={strings.loadingMessage} loadingGif={true} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AnswerUserFieldPage.defaultProps = {
    strings: {
        question       : 'Question',
        loadingMessage : 'Loading questions'
    }
};