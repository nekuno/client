import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
import QuestionStats from '../components/questions/QuestionStats';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
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
    const isJustRegistered = QuestionStore.isJustRegistered(currentUserId);

    return {
        question,
        userAnswer,
        isJustRegistered
    };
}

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
        isJustRegistered: PropTypes.bool
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.handleContinueClick = this.handleContinueClick.bind(this);
    }

    handleContinueClick() {
        QuestionActionCreators.removePreviousQuestion(parseId(this.props.user));
        this.context.history.pushState(null, `/answer-question/next`);
    }

    render() {
        const {user, question, userAnswer, isJustRegistered, strings} = this.props;
        return (
            <div className="view view-main">
                {isJustRegistered ?
                    <TopNavBar centerText={strings.statistics} rightText={strings.next} onRightLinkClickHandler={this.handleContinueClick}/>
                    :
                    <TopNavBar leftMenuIcon={true} centerText={strings.statistics} rightText={strings.next} onRightLinkClickHandler={this.handleContinueClick}/>
                }

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
                    <FullWidthButton onClick={this.handleContinueClick}>{strings.next}</FullWidthButton>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        );
    }
};

QuestionStatsPage.defaultProps = {
    strings: {
        statistics: 'Statistics',
        next      : 'Continue'
    }
};