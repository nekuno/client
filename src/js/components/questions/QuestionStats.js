import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { QUESTION_STATS_COLORS } from '../../constants/Constants';
import QuestionStatsGraphs from './QuestionStatsGraphs';
import translate from '../../i18n/Translate';
import styles from './QuestionStats.scss';
import RoundedImage from "../ui/RoundedImage/RoundedImage";
import RoundedIcon from "../ui/RoundedIcon/RoundedIcon";
import Button from "../ui/Button/Button";


@translate('QuestionStats')
export default class QuestionStats extends Component {
    static propTypes = {
        question  : PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired,
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    getImportanceByRating = function(rating) {
        const {strings} = this.props;
        let importance;
        if (rating === 1) {
            importance = strings.few;
        }
        else if (rating === 2) {
            importance = strings.normal;
        }
        else if (rating === 3) {
            importance = strings.aLot;
        }
        else if (rating === 0) {
            importance = strings.irrelevant;
        }
        return importance;
    };

    render() {
        const {strings, question, user, userAnswer} = this.props;
        let answers = question.answers;

        if (!question || !answers) {
            return null;
        }

        return (
            <div className={styles.questionStats}>
                <div className={styles.questionTitle}>
                    {question.text}
                </div>
                {user &&
                <div className={styles.yourAnswer}>
                    <RoundedImage size={'x-small'} url={user.photo.url}/>
                    <div className={styles.yourAnswerText}>
                        {answers.map((answer, index) => userAnswer.answerId === answer.answerId ? answer.text : '')}
                    </div>
                </div>
                }
                <div className={styles.otherUserAnswers}>
                    <div className={styles.otherUserAnswersText}>
                        {strings.otherUserAnswers}
                    </div>
                    {userAnswer && question ?
                        question.answers.map((answer, answerIndex) =>
                            <div key={answerIndex}>
                                {userAnswer.acceptedAnswers.map((acceptedAnswer, acceptedAnswerIndex) =>
                                    <div key={acceptedAnswerIndex}>
                                        {acceptedAnswer === answer.answerId ?
                                            <div className={styles.otherUserAnswersAccepted}>
                                                {userAnswer.answerId !== answer.answerId ?
                                                    <div className={styles.otherUserAnswersAcceptedWrapper}>
                                                        <RoundedIcon icon={'nekuno'} size={'small'} background={'#615acb'}/>
                                                        <div className={styles.answer}>
                                                            {answer.text}
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                            : null
                                        }
                                    </div>
                                )}
                            </div>
                        )
                    : null}
                </div>
                <div className={styles.answerImportance}>
                    <div className={styles.answerImportanceText}>
                        {strings.userImportance}
                    </div>
                    <Button backgroundColor={'#928bff'} color={'#ffffff'} size={'small'} textAlign={'left'}>
                        {this.getImportanceByRating(userAnswer.rating)}
                    </Button>
                </div>

                {userAnswer.isEditable ?
                    <div className="edit-answer">{strings.editAnswer}</div>
                    : null
                }

                <div className={styles.questionStatsGraphs}>
                    <QuestionStatsGraphs question={question} userAnswer={userAnswer}/>

                    <div className={styles.answersColors}>
                        {answers.map((answer, index) =>
                            <div key={index} className={styles.answerColor}>
                                <span className={styles.iconCircle} style={{'background-color': QUESTION_STATS_COLORS[index]}}></span>
                                <div className={styles.answer} style={{'fontWeight': answer.answerId === userAnswer.answerId ? 'bold' : 'normal'}}>{answer.text}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        );
    }
}

QuestionStats.defaultProps = {
    strings: {
        yourAnswer       : 'Your answer',
        statistics       : 'Statistics answers community',
        otherUserAnswers : 'Answers that I accept from another user',
        few              : 'Few',
        normal           : 'Normal',
        aLot             : 'A lot',
        irrelevant       : 'Irrelevant',
        userImportance   : 'The importance of your answer is',
        editAnswer       : 'Edit answer',
    }
};