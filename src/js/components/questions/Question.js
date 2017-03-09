import React, { PropTypes, Component } from 'react';
import Answer from './Answer';
import QuestionStatsInLine from './QuestionStatsInline';

export default class Question extends Component {
    static propTypes = {
        question      : PropTypes.object.isRequired,
        userAnswer    : PropTypes.object.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        last          : PropTypes.bool.isRequired,
        userSlug      : PropTypes.string.isRequired,
        onClickHandler: PropTypes.func,
        graphActive   : PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
        this.goToPreviousPage = this.goToPreviousPage.bind(this);
    }

    goToPreviousPage() {
        const {question, userSlug} = this.props;
        this.context.router.replace(`/answer-question/${question.question.questionId}/${userSlug}`);
    }

    render() {
        let question = this.props.question.question;
        if (!question) {
            return null;
        }
        let {userAnswer} = this.props;
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
                <a href="javascript:void(0)" onClick={this.goToPreviousPage}>
                    <span className="edit-question-button">
                        <span className="icon-edit"></span>
                    </span>
                </a>
                <div className="question-title">
                    {question.text}
                </div>
                <Answer text={userAnswerText} answered={true} accepted={userAnswer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === userAnswer.answerId)} {...this.props}/>

                {answers.map((answer, index) => {
                    if (answer.answerId === userAnswer.answerId) {
                        return null;
                    }
                    return (
                        <Answer key={index} text={answer.text} answered={false} accepted={userAnswer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === answer.answerId)} {...this.props}/>
                    );
                })}
                {this.props.graphActive ?
                    <QuestionStatsInLine question={question} userAnswer={userAnswer}/> : ''
                }
                <hr/>
            </div>
        );
    }

    onClickHandler() {
        this.props.onClickHandler(this.props.question.question.questionId);
    }
}
