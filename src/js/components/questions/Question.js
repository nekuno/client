import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import Answer from './Answer';
import QuestionStatsInLine from './QuestionStatsInline';

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        last: PropTypes.bool.isRequired,
        userId: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);

        this.state = {
            graphDisplay: false
        };
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
                <div className="edit-question-button">
                    <Link to={`/answer-question/${question.questionId}`}><span className="icon-edit"></span></Link>
                </div>
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
                {this.state.graphDisplay ?
                    <QuestionStatsInLine question={question} userAnswer={userAnswer} userId={this.props.userId}/> : ''
                }
                <hr/>
            </div>
        );
    }

    onClickHandler() {
        this.setState({
            graphDisplay: !this.state.graphDisplay
        });
    }
}
