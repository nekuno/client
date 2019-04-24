import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ButtonFloating from '../components/ui/ButtonFloating';
import QuestionStats from '../components/questions/QuestionStats';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import '../../scss/pages/question-stats-page.scss';
import TopNavBar from "../components/TopNavBar/TopNavBar";


function parseId(user) {
    return user.id;
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.user);
    const question = QuestionStore.getQuestion();
    const userAnswer = question ? QuestionStore.getUserAnswer(currentUserId, question.questionId) : null;
    const isJustRegistered = QuestionStore.isJustRegistered(currentUserId);
    const isJustCompleted = QuestionStore.isJustCompleted();

    return {
        question,
        userAnswer,
        isJustRegistered,
        isJustCompleted
    };
}

//TODO: Remove
@AuthenticatedComponent
@translate('QuestionStatsPage')
@connectToStores([UserStore, QuestionStore], getState)
export default class QuestionStatsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user            : PropTypes.object.isRequired,
        // Injected by @connectToStores:
        question        : PropTypes.object,
        userAnswer      : PropTypes.object,
        isJustRegistered: PropTypes.bool,
        isJustCompleted : PropTypes.bool,
    };

    constructor(props) {

        super(props);

        this.handleContinueClick = this.handleContinueClick.bind(this);
    }

    handleContinueClick() {
        QuestionActionCreators.removePreviousQuestion(parseId(this.props.user));
        RouterActionCreators.replaceRoute(`/answer-question/next`);
    }

    render() {
        const {user, question, userAnswer, strings} = this.props;
        return (
            <div className="question-stats-page">
                <TopNavBar
                    background={'FFFFFF'}
                    iconLeft={'arrow-left'}
                    textCenter={strings.topNavBarText}
                    textSize={'small'}
                />
                <div id="page-content" className="question-stats-page-wrapper">
                    {userAnswer && question ?
                        <QuestionStats question={question} userAnswer={userAnswer} user={user}/>
                        :
                        ''
                    }
                </div>
                <div className="skip-nav-bar" onClick={this.handleContinueClick}>
                    <div className="text">{strings.nextQuestion} <span className="icon icon-arrow-right"/></div>
                </div>
            </div>
        );
    }
}

QuestionStatsPage.defaultProps = {
    strings: {
        topNavBarText: 'Personality test',
        statistics   : 'Statistics',
        next         : 'Continue',
        nextQuestion : 'Next question',
    }
};