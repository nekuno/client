import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import UsernameField from '../components/fieldsQuestions/userFields/UsernameField';
import EmailField from '../components/fieldsQuestions/userFields/EmailField';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import RegisterStore from '../stores/RegisterStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';
import LoginStore from '../stores/LoginStore';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    if (!ProfileStore.get(parseId(props.user))) {
        UserActionCreators.requestOwnProfile(parseId(props.user));
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const userId = parseId(props.user);
    const isUsernameValid = RegisterStore.validUsername();
    const profile = ProfileStore.get(userId);
    const errors = LoginStore.error;
    const registerQuestionsLength = QuestionStore.registerQuestionsLength();
    const answersLength = QuestionStore.answersLength(userId);
    const initialUserQuestionsCount = LoginStore.getInitialRequiredUserQuestionsCount();
    const userQuestionsCount = LoginStore.getRequiredUserQuestionsCount();
    const userQuestionsComplete = LoginStore.isComplete();
    const usernameAnswered = LoginStore.isUsernameAnswered();
    const nextUserField = LoginStore.getNextRequiredUserField();
    const initialProfileQuestionsCount = ProfileStore.getInitialRequiredProfileQuestionsCount();
    const profileQuestionsLeftCount = ProfileStore.getRequiredProfileQuestionsLeftCount(userId);
    const profileQuestionsComplete = ProfileStore.isComplete(userId);
    const profileQuestionsCount = initialProfileQuestionsCount - profileQuestionsLeftCount;
    const totalQuestions = initialUserQuestionsCount + initialProfileQuestionsCount + registerQuestionsLength;
    const questionNumber = userQuestionsCount + profileQuestionsCount + answersLength + 1;

    return {
        profile,
        isUsernameValid,
        errors,
        userQuestionsComplete,
        usernameAnswered,
        nextUserField,
        profileQuestionsComplete,
        totalQuestions,
        questionNumber
    };
}

@AuthenticatedComponent
@translate('AnswerUserFieldPage')
@connectToStores([RegisterStore, LoginStore, ProfileStore, QuestionStore], getState)
export default class AnswerUserFieldPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params                  : PropTypes.shape({
            questionId: PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user                    : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                 : PropTypes.object,
        // Injected by @connectToStores:
        isUsernameValid         : PropTypes.bool,
        errors                  : PropTypes.string,
        userQuestionsComplete   : PropTypes.bool,
        usernameAnswered        : PropTypes.bool,
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
        if (!nextProps.isUsernameValid) {
            nekunoApp.alert(nextProps.strings.usernameInvalid);
        }
        else if (nextProps.errors) {
            nekunoApp.alert(nextProps.errors);
        }
        else if (nextProps.usernameAnswered && nextProps.userQuestionsComplete) {
            let path = 'answer-question/next';
            if (!nextProps.profileQuestionsComplete) {
                path = 'answer-profile-fields';
            }
            window.setTimeout(() =>  { this.context.router.push(path) }, 0);
        }
    }

    handleClickSave(fieldName, data) {
        let user = {};
        user[fieldName] = data;
        UserActionCreators.editUser(user);
    }
    
    render() {

        const {user, profile, strings, isUsernameValid, nextUserField, totalQuestions, questionNumber} = this.props;
        const navBarTitle = typeof profile != 'undefined' ?
            strings.question + ' ' + questionNumber + '/' + totalQuestions
            : '';
        let fieldToRender = null;
        const nextUserFiledName = nextUserField ? nextUserField.name : null;
        switch (nextUserFiledName) {
            case 'username':
            {/* Don't pass user.username because we don't want userX to be displayed */}
                fieldToRender = <UsernameField username={''} isUsernameValid={isUsernameValid} onSaveHandler={this.handleClickSave} />;
                break;

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
        loadingMessage : 'Loading questions',
        usernameInvalid: 'Username is invalid or already in use'
    }
};