import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Answer from './Answer';
import translate from '../../i18n/Translate';

@translate('OtherQuestion')
export default class OtherQuestion extends Component {
    static propTypes = {
        question       : PropTypes.object.isRequired,
        userAnswer     : PropTypes.object,
        ownPicture     : PropTypes.string,
        otherPicture   : PropTypes.string.isRequired,
        userId         : PropTypes.number.isRequired,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    render() {
        let question = this.props.question.question;
        if (!question) {
            return null;
        }
        let userAnswer = this.props.userAnswer || {};
        let otherUserAnswer = this.props.question.userAnswer;
        const {strings} = this.props;

        userAnswer.text = otherUserAnswer.text = strings.didntAnswered;
        question.answers.forEach((answer) => {
            if (answer.answerId === userAnswer.answerId) {
                userAnswer.text = answer.text;
            }
            if (answer.answerId === otherUserAnswer.answerId) {
                otherUserAnswer.text = answer.text;
            }
        });

        return (
            <div className="question">
                <Link to={`/answer-question/${question.questionId}`}>
                    <span className="edit-question-button">
                        <span className="icon-edit"></span>
                    </span>
                </Link>
                <div className="question-title">
                    {question.text}
                </div>
                <Answer text={otherUserAnswer.text} answered={false} defaultPicture={this.props.otherPicture} accepted={userAnswer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === otherUserAnswer.answerId)} {...this.props}/>
                {userAnswer.text ?
                    <Answer text={userAnswer.text} answered={true} accepted={otherUserAnswer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === userAnswer.answerId)} {...this.props}/>
                    :
                    <div className="not-answered-text">{strings.didntAnswered}</div>
                }
                <hr/>
            </div>
        );
    }
}

OtherQuestion.defaultProps = {
    strings: {
        didntAnswered: 'You have not answered this question'
    }
};