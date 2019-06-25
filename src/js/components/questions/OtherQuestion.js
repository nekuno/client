import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Answer from './Answer';
import translate from '../../i18n/Translate';
import QuestionEditCountdown from './QuestionEditCountdown';

@translate('OtherQuestion')
export default class OtherQuestion extends Component {
    static propTypes = {
        question     : PropTypes.object.isRequired,
        userAnswer   : PropTypes.object,
        ownPicture   : PropTypes.string,
        otherPicture : PropTypes.string.isRequired,
        otherUserSlug: PropTypes.string.isRequired,
        onTimerEnd   : PropTypes.func,

        // Injected by @translate:
        strings: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToAnswerQuestion = this.goToAnswerQuestion.bind(this);
    }

    goToAnswerQuestion() {
        const {question, otherUserSlug} = this.props;
        this.context.router.push(`/answer-question/${question.question.questionId}/${otherUserSlug}`);
    }

    isAnswerAcceptedByOtherAnswer(answer, otherAnswer) {
        if (!answer || !otherAnswer || !answer.hasOwnProperty('acceptedAnswers') || !otherAnswer.hasOwnProperty('answerId')){
            return true;
        }

        return answer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === otherAnswer.answerId);
    }

    render() {
        let question = this.props.question.question;
        if (!question) {
            return null;
        }
        let userAnswer = this.props.userAnswer || {};
        let editable = userAnswer.hasOwnProperty('isEditable') ? userAnswer.isEditable : true;

        let otherUserAnswer = this.props.question.userAnswer;
        const {strings} = this.props;

        let userAnswerText, otherUserAnswerText;
        question.answers.forEach((answer) => {
            if (userAnswer && answer.answerId === userAnswer.answerId) {
                userAnswerText = answer.text;
            }
            if (otherUserAnswer && answer.answerId === otherUserAnswer.answerId) {
                otherUserAnswerText = answer.text;
            }
        });

        const locked = !userAnswerText;

        return (
            <div className="question" onClick={editable ? this.goToAnswerQuestion : null}>
                {editable ?
                    <span className="edit-question-button">
                        <span className="mdi mdi-lead-pencil"></span>
                    </span>
                    :
                    ''
                }
                <div className="question-title">
                    {question.text}
                </div>
                <Answer locked={locked} text={otherUserAnswerText} answered={false} defaultPicture={this.props.otherPicture} accepted={this.isAnswerAcceptedByOtherAnswer(userAnswer, otherUserAnswer)} {...this.props}/>
                <Answer grayed={locked} text={userAnswerText || strings.didntAnswered} answered={true} accepted={this.isAnswerAcceptedByOtherAnswer(otherUserAnswer, userAnswer)} {...this.props}/>
                {editable ? '' :
                    <QuestionEditCountdown seconds={userAnswer.editableIn} questionId={question.questionId} onTimerEnd={this.props.onTimerEnd}/>
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