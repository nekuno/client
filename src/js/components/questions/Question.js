import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Answer from './Answer';
import QuestionStatsInLine from './QuestionStatsInline';
import QuestionEditCountdown from './QuestionEditCountdown';
import translate from '../../i18n/Translate';

@translate('Question')
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
        const { strings } = this.props;
        let question = this.props.question.question;
        let onTimerEnd = this.props.onTimerEnd;
        if (!question) {
            return null;
        }
        let {userAnswer} = this.props;
        let editable = userAnswer.hasOwnProperty('isEditable') ? userAnswer.isEditable : true;
        let answers = question && question.answers.length > 0 ? question.answers : [];

        return (
            <div className="question" onClick={editable ? this.goToAnswerQuestion : null}>
                { editable ?
                    <a href="javascript:void(0)">
                        <span className="edit-question-button">
                            <span className="mdi mdi-lead-pencil"></span>
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
                    <QuestionStatsInLine question={question} userAnswer={userAnswer} onClick={this.onClickHandler}/>
                :
                    <div class="view-question-stats" onClick={this.onClickHandler}>
                        <span class="text">{strings.viewStats}</span>
                        <span class="icon mdi mdi-chart-donut"></span>
                    </div>
                }
                
                <hr/>
            </div>
        );
    }

    onClickHandler(e) {
        e.stopPropagation();
        this.props.onClickHandler(this.props.question.question.questionId);
    }
}
