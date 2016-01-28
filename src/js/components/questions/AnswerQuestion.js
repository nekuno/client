import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import AnswerQuestionForm from './AnswerQuestionForm';

export default class AnswerQuestion extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        userAnswer: PropTypes.object,
        isFirstQuestion: PropTypes.bool.isRequired,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired,
        errors: PropTypes.string.isRequired
    };

    render() {
        let question = this.props.question;
        let questionId = selectn('questionId', question);
        let userAnswer = this.props.userAnswer;
        let answers = selectn('answers', question) || [];
        let errors = this.props.errors;

        if (errors) {
            nekunoApp.alert(errors);
        }

        return (
            <div>
                {questionId ?
                    <div className="answer-question">
                        <div className="answer-question-title">
                            {question.text}
                        </div>
                        <AnswerQuestionForm answers={answers} {...this.props} />
                    </div>
                    :
                    <h1>No hay más preguntas</h1>
                }
            </div>
        );
    }
}
