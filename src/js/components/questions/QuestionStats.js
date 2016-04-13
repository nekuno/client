import React, { PropTypes, Component } from 'react';
import { QUESTION_STATS_COLORS } from '../../constants/Constants';
import QuestionStatsGraphs from './QuestionStatsGraphs';

export default class QuestionStats extends Component {
    static propTypes = {
        question  : PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired,
        userId    : PropTypes.number.isRequired
    };

    render() {

        let question = this.props.question;
        let userAnswer = this.props.userAnswer;
        let answers = question.answers;
        let userId = this.props.userId;

        if (!question || !answers) {
            return null;
        }

        return (
            <div className="question-stats">
                <div className="title question-title">
                    {question.text}
                </div>
                <div className="your-answer">
                    <div className="your-answer-title">
                        Tu respuesta
                    </div>
                    <div className="your-answer-text sub-title">
                        {answers.map((answer, index) => userAnswer.answerId === answer.answerId ? answer.text : '')}
                    </div>
                </div>
                <div className="question-stats-graph-title">
                    Estadísticas repuestas comunidad
                </div>
                <QuestionStatsGraphs question={question} userAnswer={userAnswer}/>
                <div className="answers-colors">
                    <hr align="left"/>
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
