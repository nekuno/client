import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import { QUESTION_STATS_COLORS } from '../../constants/Constants';
import QuestionStatsGraphs from './QuestionStatsGraphs';

export default class QuestionStats extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired,
        userId: PropTypes.number.isRequired
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
                <div className="question-stats-graph-title">
                    Estadísticas repuestas comunidad
                </div>
                <QuestionStatsGraphs question={question} userAnswer={userAnswer} />
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
