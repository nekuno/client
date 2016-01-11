import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import Answer from './Answer';

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        last: PropTypes.bool.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {

        let question = this.props.question.question;
        let userAnswer = this.props.userAnswer;
        let answers = question.answers;
        let userAnswerText = '';

        if (userAnswer) {
            for (let index in answers) {
                if (!answers.hasOwnProperty(index)) {
                    continue;
                }
                if (answers[index].hasOwnProperty('answerId') && answers[index].answerId === userAnswer.answerId) {
                    userAnswerText = answers[index].text;
                }
            }
        }

        return (
            <div className="question">
                <div className="edit-question-button">
                    <a className="edit-question-link"><span className="icon-edit"></span></a>
                </div>
                <div className="question-title">
                    {question.text}
                </div>
                <Answer text={userAnswerText} answered={true} ownProfile={true} ownPicture={true} {...this.props} />

                {answers.map((answer, index) => {
                    if (answer.answerId === userAnswer.answerId) {
                        return null;
                    }
                    return (
                        <Answer key={index} text={answer.text} answered={false} ownProfile={true} ownPicture={true} {...this.props} />
                    );
                })}
                <hr/>
            </div>
        );
    }
}
