import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import EmptyMessage from '../ui/EmptyMessage';
import AnswerQuestionForm from './AnswerQuestionForm';
import translate from '../../i18n/Translate';

@translate('AnswerQuestion')
export default class AnswerQuestion extends Component {
    static propTypes = {
        question       : PropTypes.object,
        userAnswer     : PropTypes.object,
        ownPicture     : PropTypes.string.isRequired,
        userId         : PropTypes.number.isRequired,
        errors         : PropTypes.string.isRequired,
        noMoreQuestions: PropTypes.bool,
        startTutorial  : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    render() {
        const {noMoreQuestions, strings, question} = this.props;
        let questionId = selectn('questionId', question);
        let answers = selectn('answers', question) || [];

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
                    noMoreQuestions ? <EmptyMessage text={strings.noMoreQuestions} /> : ''
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
