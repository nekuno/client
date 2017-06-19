import React, { PropTypes, Component } from 'react';
import Answer from './Answer';
import QuestionStatsInLine from './QuestionStatsInline';
import QuestionEditCountdown from './QuestionEditCountdown';

export default class Question extends Component {
    static propTypes = {
        question      : PropTypes.object.isRequired,
        userAnswer    : PropTypes.object.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        last          : PropTypes.bool.isRequired,
        userSlug      : PropTypes.string.isRequired,
        onClickHandler: PropTypes.func,
        onTimerEnd    : PropTypes.func,
        graphActive   : PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
        this.goToAnswerQuestion = this.goToAnswerQuestion.bind(this);
    }

    goToAnswerQuestion() {
        const {question, userSlug} = this.props;
        this.context.router.push(`/answer-question/${question.question.questionId}/${userSlug}`);
    }

    render() {
        let question = this.props.question.question;
        let onTimerEnd = this.props.onTimerEnd;
        if (!question) {
            return null;
        }
        let {userAnswer} = this.props;
        let editable = userAnswer.hasOwnProperty('isEditable') ? userAnswer.isEditable : true;
        let answers = question && question.answers.length > 0 ? question.answers : [];

        return (
            <div className="question" onClick={this.onClickHandler}>
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
                {answers.map((answer, index) =>
                    <Answer key={index}
                            text={answer.text}
                            answered={answer.answerId === userAnswer.answerId}
                            accepted={userAnswer.acceptedAnswers.some(acceptedAnswerId => acceptedAnswerId === answer.answerId)}
                            {...this.props}
                    />
                )}
                {editable ? '' :
                    <QuestionEditCountdown seconds={userAnswer.editableIn} questionId={question.questionId} onTimerEnd={onTimerEnd} />
                }
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
