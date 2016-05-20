import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Answer from './Answer';
import QuestionStatsInLine from './QuestionStatsInline';

export default class Question extends Component {
    static propTypes = {
        question      : PropTypes.object.isRequired,
        userAnswer    : PropTypes.object.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        last          : PropTypes.bool.isRequired,
        userId        : PropTypes.number.isRequired,
        onClickHandler: PropTypes.func,
        graphActive   : PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        let question = this.props.question.question;
        if (!question) {
            return null;
        }
        let userAnswer = this.props.userAnswer;
        let answers = question && question.answers.length > 0 ? question.answers : [];
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
            <div className="question" onClick={this.onClickHandler}>
                <Link to={`/answer-question/${question.questionId}`}>
                    <span className="edit-question-button">
                        <span className="icon-edit"></span>
                    </span>
                </Link>
                <div className="question-title">
                    {question.text}
                </div>
                <Answer text={userAnswerText} answered={true} {...this.props} />

                {answers.map((answer, index) => {
                    if (answer.answerId === userAnswer.answerId) {
                        return null;
                    }
                    return (
                        <Answer key={index} text={answer.text} answered={false} {...this.props} />
                    );
                })}
                {this.props.graphActive ?
                    <QuestionStatsInLine question={question} userAnswer={userAnswer} userId={this.props.userId}/> : ''
                }
                <hr/>
            </div>
        );
    }

    onClickHandler() {
        this.props.onClickHandler(this.props.question.question.questionId);
    }
}
