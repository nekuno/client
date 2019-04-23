import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';
import TopNavBar from "../components/TopNavBar/TopNavBar";
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import tutorial from '../components/tutorial/Tutorial';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import Joyride from 'react-joyride';
import '../../scss/pages/answer/answer-next-question.scss';
import RegisterQuestionsFinishedPopup from "../components/questions/RegisterQuestionsFinishedPopup";


function parseId(user) {
    return user.id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const {user, params} = props;
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : null;
    const currentUserId = parseId(user);
    QuestionActionCreators.requestQuestion(currentUserId, questionId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user, params} = props;
    const currentUserId = parseId(user);
    const currentUser = UserStore.get(currentUserId);
    const question = QuestionStore.getQuestion();
    const questionId = parseInt(params.questionId);
    const from = params.from;
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const noMoreQuestions = QuestionStore.noMoreQuestions();
    const isLoadingOwnQuestions = QuestionStore.isLoadingOwnQuestions();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();

    return {
        currentUser,
        question,
        from,
        userAnswer,
        user,
        errors,
        noMoreQuestions,
        isLoadingOwnQuestions,
        goToQuestionStats
    };
}

@AuthenticatedComponent
@translate('AnswerQuestionPage')
@tutorial()
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswerQuestionPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params                 : PropTypes.shape({
            questionId: PropTypes.string,
            from      : PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user                   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object,
        // Injected by @tutorial:
        steps                  : PropTypes.array,
        startTutorial          : PropTypes.func,
        endTutorialHandler     : PropTypes.func,
        tutorialLocale         : PropTypes.object,
        joyrideRunning         : PropTypes.bool,
        // Injected by @connectToStores:
        question               : PropTypes.object,
        userAnswer             : PropTypes.object,
        errors                 : PropTypes.string,
        isLoadingOwnQuestions  : PropTypes.bool,
        noMoreQuestions        : PropTypes.bool,
        goToQuestionStats      : PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.skipQuestionHandler = this.skipQuestionHandler.bind(this);
        this.forceStartTutorial = this.forceStartTutorial.bind(this);
    }

    componentDidMount() {
        const questionId = this.props.params.questionId;
        if(!this.props.question || this.props.question.questionId !== questionId) {
            window.setTimeout(() => requestData(this.props), 0);
        }
    }

    componentDidUpdate() {
        const {goToQuestionStats, question, from} = this.props;
        if (goToQuestionStats) {
            setTimeout(() => {
                RouterActionCreators.replaceRoute(`/question-stats/${from}`);
            }, 0);
        }
    }

    componentWillUnmount() {
        this.joyride.reset();
    }

    skipQuestionHandler() {
        const {user, question, params} = this.props;
        let userId = parseId(user);
        let questionId = question.questionId;
        QuestionActionCreators.skipQuestion(userId, questionId);
        if (user.slug === params.from) {
            window.setTimeout(RouterActionCreators.replaceRoute(`/questions`), 0);
        } else {
            window.setTimeout(RouterActionCreators.replaceRoute(`/users/${params.from}/other-questions`), 0);
        }
    }

    forceStartTutorial() {
        this.joyride.reset(true);
    }

    render() {
        const {user, strings, errors, noMoreQuestions, isLoadingOwnQuestions, userAnswer, question, steps, tutorialLocale, endTutorialHandler, joyrideRunning} = this.props;
        const userId = parseId(user);
        const ownPicture = user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
        const isRegisterQuestion = selectn('isRegisterQuestion', question);

        return (
            <div className="answer-next-question-page">
                <TopNavBar
                    background={'FFFFFF'}
                    iconLeft={'arrow-left'}
                    textCenter={strings.topNavBarText}
                    textSize={'small'}
                    //onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                />
                {/*{isJustRegistered ?*/}
                {/*<TopNavBar centerText={navBarTitle}/>*/}
                {/*:*/}
                {/*<TopNavBar leftIcon={'left-arrow'} centerText={navBarTitle} rightText={isRegisterQuestion ? '' : strings.skip} onRightLinkClickHandler={isRegisterQuestion ? null : this.skipQuestionHandler}/>*/}
                {/*}*/}
                <div className="answer-next-question-page-wrapper">
                    <Joyride ref={c => this.joyride = c} steps={steps} locale={tutorialLocale} callback={endTutorialHandler} type="continuous" run={joyrideRunning} autoStart={true}/>
                    <div className="">
                        <div id="page-content" className="answer-question-content">
                            <AnswerQuestion question={question} userAnswer={userAnswer} userId={userId} errors={errors} noMoreQuestions={noMoreQuestions} ownPicture={ownPicture} startTutorial={this.forceStartTutorial} isLoadingOwnQuestions={isLoadingOwnQuestions}/>
                        </div>
                    </div>
                    <RegisterQuestionsFinishedPopup onContinue={this.onContinue} onClose={this.onClosePopup} contentRef={this.props.popupContentRef}/>
                </div>
                <div className="skip-nav-bar" onClick={this.skipQuestionHandler}>
                    <div className="text">Omitir <span className="icon icon-arrow-right"/></div>
                </div>
            </div>
        );
    }
}

AnswerQuestionPage.defaultProps = {
    strings: {
        topNavBarText          : 'Personality test',
        question               : 'Question',
        skip                   : 'Skip',
        tutorialFirstStepTitle : 'Your answer',
        tutorialFirstStep      : 'This is your answer to the above question.',
        tutorialSecondStepTitle: 'Others answers',
        tutorialSecondStep     : 'Here you choose what other person should answer to be compatible with you; you can choose more than one answer.',
        tutorialThirdStepTitle : 'Importance',
        tutorialThirdStep      : 'This will be the question`s importance when making compatibility calculations.'
    },
    steps: [
        {
            titleRef: 'tutorialFirstStepTitle',
            textRef: 'tutorialFirstStep',
            selector: '#joyride-1-your-answer',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialSecondStepTitle',
            textRef: 'tutorialSecondStep',
            selector: '#joyride-2-others-answers',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialThirdStepTitle',
            textRef: 'tutorialThirdStep',
            selector: '#joyride-3-answer-importance',
            position: 'top',
        }
    ]
};