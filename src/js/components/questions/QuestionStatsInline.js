import React, { PropTypes, Component } from 'react';
import { QUESTION_STATS_COLORS } from '../../constants/Constants';
import QuestionStatsGraphs from './QuestionStatsGraphs';
import translate from '../../i18n/Translate';

@translate('QuestionStatsInline')
export default class QuestionStatsInline extends Component {
    static propTypes = {
        question  : PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    render() {

        let question = this.props.question;
        let userAnswer = this.props.userAnswer;
        let answers = question.answers;

        if (!question || !answers) {
            return null;
        }

        const {strings} = this.props;

        return (
            <div className="question-stats">
                <div className="question-stats-graph-title">
                    {strings.statistics}
                </div>
                <QuestionStatsGraphs question={question} userAnswer={userAnswer}/>
                <div className="answers-colors">
                    <hr/>
                    {answers.map((answer, index) =>
                        <div key={index} className="answer-color">
                            <span className="icon-circle " style={{'color': QUESTION_STATS_COLORS[index]}}></span>
                            <div className="answer" style={{'fontWeight': answer.answerId === userAnswer.answerId ? 'bold' : 'normal'}}>{answer.text}</div>

                        </div>
                    )}
                </div>
            </div>
        );
    }
}

QuestionStatsInline.defaultProps = {
    strings: {
        statistics: 'Statistics answers community'
    }
};
