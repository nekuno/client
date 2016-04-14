import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import AnswerQuestionForm from './AnswerQuestionForm';
import translate from '../../i18n/Translate';

@translate('AnswerQuestion')
export default class AnswerQuestion extends Component {
    static propTypes = {
        question       : PropTypes.object.isRequired,
        userAnswer     : PropTypes.object,
        isFirstQuestion: PropTypes.bool.isRequired,
        ownPicture     : PropTypes.string.isRequired,
        userId         : PropTypes.number.isRequired,
        errors         : PropTypes.string.isRequired,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    render() {
        let question = this.props.question;
        let questionId = selectn('questionId', question);
        let userAnswer = this.props.userAnswer;
        let answers = selectn('answers', question) || [];
        let errors = this.props.errors;
        const {strings} = this.props;

        if (errors) {
            nekunoApp.alert(errors);
        }

        return (
            <div>
                {questionId ?
                    <div className="answer-question">
                        <div className="title answer-question-title">
                            {question.text}
                        </div>
                        <AnswerQuestionForm answers={answers} {...this.props} />
                    </div>
                    :
                    <h1>{strings.noMoreQuestions}</h1>
                }
            </div>
        );
    }
}

AnswerQuestion.defaultProps = {
    strings: {
        noMoreQuestions: 'No more questions'
    }
};
