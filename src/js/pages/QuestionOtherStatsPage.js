import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ButtonFloating from '../components/ui/ButtonFloating';
import QuestionStats from '../components/questions/QuestionStats';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import QuestionStore from '../stores/QuestionStore';

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

    return {
        question,
        userAnswer
    };
}

@AuthenticatedComponent
@translate('QuestionOtherStatsPage')
@connectToStores([QuestionStore], getState)
export default class QuestionOtherStatsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user            : PropTypes.object.isRequired,
        // Injected by React Router:
        params          : PropTypes.shape({
            from: PropTypes.string
        }),
        // Injected by @connectToStores:
        question        : PropTypes.object,
        userAnswer      : PropTypes.object
    };

    constructor(props) {

        super(props);

        this.handleContinueClick = this.handleContinueClick.bind(this);
    }

    handleContinueClick() {
        const {params, user} = this.props;
        QuestionActionCreators.removePreviousQuestion(parseId(user));
        RouterActionCreators.replaceRoute(`/answer-other-question/${params.slug}/next`);
    }

    render() {
        const {user, question, userAnswer, strings} = this.props;
        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={strings.statistics} rightText={strings.next} onRightLinkClickHandler={this.handleContinueClick}/>
                <div className="view view-main">
                    <div className="page question-stats-page">
                        <div id="page-content" className="question-stats-content">
                            {userAnswer && question ?
                                <QuestionStats question={question} userAnswer={userAnswer} userId={parseId(user)}/>
                                :
                                ''
                            }
                        </div>
                        <br />
                        <br />
                    </div>
                </div>
                <ButtonFloating icon={'arrow-right'} onClickHandler={this.handleContinueClick}/>
            </div>
        );
    }
}

QuestionOtherStatsPage.defaultProps = {
    strings: {
        statistics: 'Statistics',
        next      : 'Continue'
    }
};