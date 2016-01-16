import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import AnswerQuestionForm from './AnswerQuestionForm';

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
                <div className="question-title">
                    {question.text}
                </div>
                <div className="your-answer">
                    <div className="your-answer-title">
                        Tu respuesta
                    </div>
                    <div className="your-answer-text">
                        {answers.map((answer, index) => userAnswer.answerId === answer.answerId ? answer.text : '')}
                    </div>
                </div>

            </div>
        );
    }
}
