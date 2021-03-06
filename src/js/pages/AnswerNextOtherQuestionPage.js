import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import tutorial from '../components/tutorial/Tutorial';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import Joyride from 'react-joyride';
import Framework7Service from '../services/Framework7Service';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const {user, params} = props;
    const currentUserId = parseId(user);
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']).then(
        () => {
            const otherUser = UserStore.getBySlug(params.slug);
            const otherUserId = parseId(otherUser);
            QuestionActionCreators.requestNextOtherQuestion(currentUserId, otherUserId);
        },
        (status) => { console.log(status.error) }
    );
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user, params} = props;
    const slug = params.slug;
    const currentUserId = parseId(user);
    const question = QuestionStore.getQuestion();
    const questionId = question ? parseInt(question.questionId) : null;
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const noMoreQuestions = QuestionStore.noMoreQuestions();
    const isLoadingOwnQuestions = QuestionStore.isLoadingOwnQuestions();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();
    const otherUser = UserStore.getBySlug(params.slug);

    return {
        question,
        slug,
        userAnswer,
        user,
        errors,
        noMoreQuestions,
        isLoadingOwnQuestions,
        goToQuestionStats,
        otherUser
    };
}

@AuthenticatedComponent
@translate('AnswerNextOtherQuestionPage')
@tutorial()
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswerNextOtherQuestionPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params                 : PropTypes.shape({
            slug: PropTypes.string,
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
        goToQuestionStats      : PropTypes.bool,
        otherUser              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.forceStartTutorial = this.forceStartTutorial.bind(this);
    }

    componentDidMount() {
        window.setTimeout(() => requestData(this.props), 0);
    }

    componentDidUpdate() {
        const {goToQuestionStats, noMoreQuestions, question, user, otherUser, params, strings} = this.props;
        if (goToQuestionStats) {
            setTimeout(() => {
                UserActionCreators.requestComparedStats(parseId(user), parseId(otherUser));
                RouterActionCreators.replaceRoute(`/question-other-stats/${params.slug}`);
            }, 0);
        }
        if (noMoreQuestions) {
            Framework7Service.nekunoApp().alert(strings.noMoreQuestions);
            RouterActionCreators.replaceRoute(`/users/${params.slug}/other-questions`);
        }
    }

    componentWillUnmount() {
        this.joyride.reset();
    }

    forceStartTutorial() {
        this.joyride.reset(true);
    }

    render() {
        const {user, strings, errors, noMoreQuestions, isLoadingOwnQuestions, userAnswer, question, steps, tutorialLocale, endTutorialHandler, joyrideRunning} = this.props;
        const userId = parseId(user);
        const ownPicture = user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';

        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={strings.question}/>
                <div className="view view-main">
                    <Joyride ref={c => this.joyride = c} steps={steps} locale={tutorialLocale} callback={endTutorialHandler} type="continuous" run={joyrideRunning} autoStart={true}/>
                    <div className="page answer-question-page">
                        <div id="page-content" className="answer-question-content">
                            <AnswerQuestion question={question} userAnswer={userAnswer} userId={userId} errors={errors} noMoreQuestions={noMoreQuestions} ownPicture={ownPicture} startTutorial={this.forceStartTutorial} isLoadingOwnQuestions={isLoadingOwnQuestions}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AnswerNextOtherQuestionPage.defaultProps = {
    strings: {
        question       : 'Question',
        noMoreQuestions: 'No more questions from this user',
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