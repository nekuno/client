import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';
import EmptyMessage from '../ui/EmptyMessage/EmptyMessage';
import AnswerQuestionForm from './AnswerQuestionForm';
import translate from '../../i18n/Translate';
import styles from './AnswerQuestion.scss';


@translate('AnswerQuestion')
export default class AnswerQuestion extends Component {
    static propTypes = {
        question             : PropTypes.object,
        userAnswer           : PropTypes.object,
        ownPicture           : PropTypes.string.isRequired,
        userId               : PropTypes.number.isRequired,
        errors               : PropTypes.string.isRequired,
        noMoreQuestions      : PropTypes.bool,
        isLoadingOwnQuestions: PropTypes.bool,
        startTutorial        : PropTypes.func,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    render() {
        const {noMoreQuestions, question, isLoadingOwnQuestions, strings} = this.props;
        let questionId = selectn('questionId', question);
        let answers = selectn('answers', question) || [];
        const questionTitleClass = questionId && question.text.length > 60 ? "title " + styles.answerQuestionTitle + " answer-question-title-long" : "title " + styles.answerQuestionTitle;
        return (
            <div>
                {
                    isLoadingOwnQuestions ?
                        <EmptyMessage text={strings.loading} loadingGif={true}/>
                        :
                        noMoreQuestions ? <EmptyMessage text={strings.noMoreQuestions}/>
                            :
                            questionId ?
                                <div className="answer-question">
                                    <div className={questionTitleClass}>
                                        {question.text}
                                    </div>
                                    <AnswerQuestionForm answers={answers} {...this.props} />
                                </div>
                                : ''
                }
            </div>
        );
    }
}

AnswerQuestion.defaultProps = {
    strings: {
        noMoreQuestions: 'No more questions',
        loading        : 'Loading question'
    }
};
