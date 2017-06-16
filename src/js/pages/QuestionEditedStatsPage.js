import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
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
@translate('QuestionEditedStatsPage')
@connectToStores([QuestionStore], getState)
export default class QuestionEditedStatsPage extends Component {

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

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.handleContinueClick = this.handleContinueClick.bind(this);
    }

    handleContinueClick() {
        const {params, user} = this.props;
        QuestionActionCreators.removePreviousQuestion(parseId(user));
        RouterActionCreators.removePreviousRoute();
        if (user.slug === params.from) {
            this.context.router.replace(`/questions`);
        } else {
            this.context.router.replace(`/users/${params.from}/other-questions`);
        }
    }

    render() {
        const {user, question, userAnswer, strings} = this.props;
        return (
            <div className="views">
                <TopNavBar centerText={strings.statistics} rightText={strings.next} onRightLinkClickHandler={this.handleContinueClick}/>
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
                        <FullWidthButton onClick={this.handleContinueClick}>{strings.next}</FullWidthButton>
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
};

QuestionEditedStatsPage.defaultProps = {
    strings: {
        statistics: 'Statistics',
        next      : 'Continue'
    }
};