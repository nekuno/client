import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import BirthdayField from '../components/fieldsQuestions/profileFields/BirthdayField';
import LocationField from '../components/fieldsQuestions/profileFields/LocationField';
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
    const profile = ProfileStore.get(userId);
    const errors = ProfileStore.getErrors();
    const registerQuestionsLength = QuestionStore.registerQuestionsLength();
    const answersLength = QuestionStore.answersLength(userId);
    const initialUserQuestionsCount = LoginStore.getInitialRequiredUserQuestionsCount();
    const userQuestionsCount = LoginStore.getRequiredUserQuestionsCount();
    const nextProfileField = ProfileStore.getNextRequiredProfileField(userId);
    const initialProfileQuestionsCount = ProfileStore.getInitialRequiredProfileQuestionsCount();
    const profileQuestionsLeftCount = ProfileStore.getRequiredProfileQuestionsLeftCount(userId);
    const profileQuestionsComplete = ProfileStore.isComplete(userId);
    const profileQuestionsCount = initialProfileQuestionsCount - profileQuestionsLeftCount;
    const totalQuestions = initialUserQuestionsCount + initialProfileQuestionsCount + registerQuestionsLength;
    const questionNumber = userQuestionsCount + profileQuestionsCount + answersLength + 1;

    return {
        profile,
        errors,
        nextProfileField,
        profileQuestionsComplete,
        totalQuestions,
        questionNumber
    };
}

@AuthenticatedComponent
@translate('AnswerProfileFieldPage')
@connectToStores([RegisterStore, LoginStore, ProfileStore, QuestionStore], getState)
export default class AnswerProfileFieldPage extends Component {

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
        errors                  : PropTypes.string,
        nextProfileField        : PropTypes.object,
        profileQuestionsComplete: PropTypes.bool,
        totalQuestions          : PropTypes.number,
        questionNumber          : PropTypes.number
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
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
            nekunoApp.alert(nextProps.errors);
        }
        if (nextProps.profileQuestionsComplete) {
            console.log('should go to questions')
            this.context.history.pushState(null, 'answer-question/next');
        }
    }

    handleClickSave(fieldName, data) {
        let profile = Object.assign({}, ProfileStore.get(parseId(this.props.user)));
        profile[fieldName] = data;
        UserActionCreators.editProfile(profile);
    }
    
    render() {

        const {profile, strings, nextProfileField, totalQuestions, questionNumber} = this.props;
        console.log(profile)
        const navBarTitle = typeof profile != 'undefined' ?
            strings.question + ' ' + questionNumber + '/' + totalQuestions
            : '';
        let fieldToRender = null;
        const nextProfileFiledName = nextProfileField ? nextProfileField.type : null;
        switch (nextProfileFiledName) {
            case 'birthday':
                fieldToRender = <BirthdayField birthday={profile && profile.birthday ? profile.birthday : ''} onSaveHandler={this.handleClickSave} />;
                break;

            case 'location':
                fieldToRender = <LocationField location={profile && profile.location ? profile.location : ''} onSaveHandler={this.handleClickSave} />;
                break;
            
            default:
        }

        return (
            <div className="view view-main">
                <TopNavBar centerText={navBarTitle}/>
                <div className="page answer-question-page">
                    <div id="page-content" className="answer-question-content">
                        {typeof profile != 'undefined' ? fieldToRender : <EmptyMessage text={strings.loadingMessage} loadingGif={true} />}
                    </div>
                </div>
            </div>
        );
    }
}

AnswerProfileFieldPage.defaultProps = {
    strings: {
        question      : 'Question',
        loadingMessage: 'Loading questions'
    }
};