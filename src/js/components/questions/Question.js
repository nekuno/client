import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        answers: PropTypes.object.isRequired,
        userAnswers: PropTypes.object.isRequired,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        last: PropTypes.bool.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {
        let question = this.props.question.question;
        let userAnswer = this.props.question.userAnswer;
        let questionAnswers = question.answers;
        let questionAnswersLength = questionAnswers.length;
        let answers = this.props.answers;
        let answer = answers ? answers[userAnswer] : null;

        for (let i=0; i<questionAnswersLength; i++) {
            if (answer.hasOwnProperty('answerId') && answer.answerId === questionAnswers[i]) {
                delete questionAnswers[i];
                questionAnswersLength--;
            }
        }
        let last = this.props.last;
        let userId = this.props.userId;

        return (
            <div className="question">
                <div className="question-title">
                    {question.text}
                </div>
                <div className="question-answered">
                    <div className="question-answered-picture">
                        <img src={this.props.ownPicture} />
                    </div>
                    <div className="question-answered-answer">
                        {answer.text}
                    </div>
                </div>
                {questionAnswers.map(answerId => {
                    return (
                        <div className="question-not-answered">
                            <div className="question-not-answered-picture">
                                <img src={this.props.defaultPicture} />
                            </div>
                            <div className="question-not-answered-answer">
                                {answers[answerId].text}
                            </div>
                        </div>
                    );
                })}
                <hr/>
            </div>
        );
    }
}
