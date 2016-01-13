import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import AnswerQuestionForm from './AnswerQuestionForm';

export default class AnswerQuestion extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        userAnswer: PropTypes.object,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {

        let question = this.props.question;
        let userAnswer = this.props.userAnswer;
        let answers = question.answers;

        if (!question || !answers) {
            return null;
        }

        return (
            <div className="answer-question">
                <div className="answer-question-title">
                    {question.text}
                </div>
                <AnswerQuestionForm answers={answers} {...this.props} />
            </div>
        );
    }
}
