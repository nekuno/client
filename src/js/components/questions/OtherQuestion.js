import React, { PropTypes, Component } from 'react';
import Answer from './Answer';
import translate from '../../i18n/Translate';
import QuestionEditCountdown from './QuestionEditCountdown';

@translate('OtherQuestion')
export default class OtherQuestion extends Component {
    static propTypes = {
        question       : PropTypes.object.isRequired,
        userAnswer     : PropTypes.object,
        ownPicture     : PropTypes.string,
        otherPicture   : PropTypes.string.isRequired,
        otherUserSlug  : PropTypes.string.isRequired,
        onTimerEnd    : PropTypes.func,

        // Injected by @translate:
        strings        : PropTypes.object
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
        this.context.router.replace(`/answer-question/${question.question.questionId}/${otherUserSlug}`);
    }

    render() {
        let question = this.props.question.question;
        if (!question) {
            return null;
        }
        let userAnswer = this.props.userAnswer || {};
        let editable = userAnswer.hasOwnProperty('editable') ? userAnswer.editable : true;

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
                {editable ?
                    <a href="javascript:void(0)" onClick={this.goToAnswerQuestion}>
                        <span className="edit-question-button">
                            <span className="icon-edit"></span>
                        </span>
                    </a>
                    :
                    ''
                }
                <div className="question-title">
                    {question.text}
                </div>
                <Answer text={otherUserAnswer.text} answered={false} defaultPicture={this.props.otherPicture} accepted={userAnswer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === otherUserAnswer.answerId)} {...this.props}/>
                {userAnswer.text ?
                    <Answer text={userAnswer.text} answered={true} accepted={otherUserAnswer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === userAnswer.answerId)} {...this.props}/>
                    :
                    <div className="not-answered-text">{strings.didntAnswered}</div>
                }
                {editable ? '' :
                    <QuestionEditCountdown seconds={userAnswer.nextEdit} questionId={question.questionId} onTimerEnd={this.props.onTimerEnd} />
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