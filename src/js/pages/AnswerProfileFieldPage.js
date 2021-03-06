import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage/EmptyMessage';
import BirthdayField from '../components/fieldsQuestions/profileFields/BirthdayField';
import LocationField from '../components/fieldsQuestions/profileFields/LocationField';
import GenderField from '../components/fieldsQuestions/profileFields/GenderField';
import ObjectivesField from '../components/fieldsQuestions/profileFields/ObjectivesField';
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
        setTimeout(() => { UserActionCreators.requestOwnProfile(props.user.slug) }, 0);
    }
    if (!ProfileStore.getMetadata()) {
        setTimeout(() => { UserActionCreators.requestMetadata() }, 0);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const userId = parseId(props.user);
    const profile = ProfileStore.get(props.user.slug);
    const metadata = ProfileStore.getMetadata();
    const errors = ProfileStore.getErrors();
    const registerQuestionsLength = QuestionStore.registerQuestionsLength();
    const answersLength = QuestionStore.ownAnswersLength(userId);
    const initialUserQuestionsCount = LoginStore.getInitialRequiredUserQuestionsCount();
    const userQuestionsCount = LoginStore.getRequiredUserQuestionsCount();
    const nextProfileField = ProfileStore.getNextRequiredProfileField(props.user.slug);
    const initialProfileQuestionsCount = ProfileStore.getInitialRequiredProfileQuestionsCount();
    const profileQuestionsLeftCount = ProfileStore.getRequiredProfileQuestionsLeftCount(props.user.slug);
    const profileQuestionsComplete = ProfileStore.isComplete(props.user.slug);
    const profileQuestionsCount = initialProfileQuestionsCount - profileQuestionsLeftCount;
    const totalQuestions = initialUserQuestionsCount + initialProfileQuestionsCount + registerQuestionsLength;
    const questionNumber = userQuestionsCount + profileQuestionsCount + answersLength + 1;

    return {
        profile,
        metadata,
        errors,
        nextProfileField,
        profileQuestionsComplete,
        totalQuestions,
        questionNumber
    };
}

//TODO: Remove
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
        profile                 : PropTypes.object,
        metadata                : PropTypes.object,
        errors                  : PropTypes.string,
        nextProfileField        : PropTypes.object,
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
        this.handleClickGenderSave = this.handleClickGenderSave.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.errors) {
            Framework7Service.nekunoApp().alert(nextProps.errors);
        }
        if (nextProps.profileQuestionsComplete) {
            if (nextProps.questionNumber >= nextProps.totalQuestions) {
                window.setTimeout(() => {
                    this.context.router.push('discover');
                }, 0);
            } else {
                window.setTimeout(() => {
                    RouterActionCreators.replaceRoute('answer-question/next')
                }, 0);
            }
        }
    }

    handleClickSave(fieldName, data) {
        let profile = Object.assign({}, ProfileStore.get(this.props.user.slug));
        profile[fieldName] = data;
        UserActionCreators.editProfile(profile);
    }

    handleClickGenderSave(gender, descriptiveGender) {
        if (!gender) {
            Framework7Service.nekunoApp().alert(this.props.strings.genderEmpty);
            return null;
        }
        let profile = Object.assign({}, ProfileStore.get(this.props.user.slug));
        profile['gender'] = gender;
        profile['descriptiveGender'] = descriptiveGender;
        UserActionCreators.editProfile(profile);
    }
    
    render() {

        const {profile, metadata, strings, nextProfileField, totalQuestions, questionNumber} = this.props;
        const navBarTitle = typeof profile != 'undefined' && totalQuestions > questionNumber ?
            strings.question + ' ' + questionNumber + '/' + totalQuestions
            : '';
        let fieldToRender = null;
        const nextProfileFiledName = nextProfileField ? nextProfileField.name : null;
        switch (nextProfileFiledName) {
            case 'birthday':
                fieldToRender = <BirthdayField birthday={profile && profile.birthday ? profile.birthday : ''} onSaveHandler={this.handleClickSave} />;
                break;
            case 'location':
                fieldToRender = <LocationField location={profile && profile.location ? profile.location : ''} onSaveHandler={this.handleClickSave} />;
                break;
            case 'gender':
                fieldToRender = <GenderField gender={profile && profile.gender ? profile.gender : null} metadata={metadata} onSaveHandler={this.handleClickGenderSave} />;
                break;
            case 'objective':
                fieldToRender = <ObjectivesField objectives={profile && profile.objective ? profile.objective : []} metadata={metadata} onSaveHandler={this.handleClickSave}
                    isJustRegistered={totalQuestions > questionNumber}
                />;
                break;
            default:
        }

        const pageClass = nextProfileFiledName === 'objective' ? "page answer-question-page " + "objectives-page" : "page answer-question-page";

        return (
            <div className="views">
                {nextProfileFiledName === 'objective' ? null : <TopNavBar centerText={navBarTitle}/>}
                <div className="view view-main">
                    <div className={pageClass}>
                        <div id="page-content" className="answer-question-content">
                            {typeof profile != 'undefined' ? fieldToRender : <EmptyMessage text={strings.loadingMessage} loadingGif={true} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AnswerProfileFieldPage.defaultProps = {
    strings: {
        question      : 'Question',
        loadingMessage: 'Loading questions',
        genderEmpty   : 'Gender is not selected'
    }
};