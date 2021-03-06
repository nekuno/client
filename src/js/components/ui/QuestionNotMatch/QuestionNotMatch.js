import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './QuestionNotMatch.scss';
import RoundedImage from "../RoundedImage/RoundedImage";
import ProposalIcon from "../ProposalIcon/ProposalIcon";

export default class QuestionNotMatch extends Component {

    static propTypes = {
        otherQuestion  : PropTypes.object,
        ownQuestion    : PropTypes.object,
        otherUser      : PropTypes.object,
        user           : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    handleClick(questionId) {
        const {user} = this.props;
        this.context.router.push(`/answer-question/${questionId}/${user.slug}`);
    }

    render() {
        const {otherQuestion, ownQuestion, otherUser, user} = this.props;

        return (
            <div className={styles.questionNotMatch}>
                <h3 className={styles.titleAnswer}>{otherQuestion.question.text}</h3>
                <div className={styles.userData}>
                    {otherUser &&
                    <div className={styles.photos}>
                        <div className={styles.photo}>
                            <RoundedImage size={'x-small'} url={otherUser.photo.url}/>
                        </div>
                    </div>
                    }

                    <div className={styles.userTextOneLine}>
                        {otherQuestion.question.answers.map((answer, answerId) =>
                            answer.answerId === otherQuestion.userAnswer.answerId ?
                                <div key={answerId}>
                                    <div className={styles.answer}>{answer.text}</div>
                                    <div className={styles.answerIcon}><ProposalIcon size={'small'} icon={'danger'} background={'transparent'}/></div>
                                </div>
                                :
                                ''
                        )}
                    </div>
                </div>
                <div className={styles.userData}>
                    {user &&
                    <div className={styles.photos}>
                        <div className={styles.photo}>
                            <RoundedImage size={'x-small'} url={user.photo.url}/>
                        </div>
                    </div>
                    }
                    <div className={styles.userText}>
                        {ownQuestion.question.answers.map((answer, answerId) =>
                            answer.answerId === ownQuestion.userAnswer.answerId ?
                                <div key={answerId}>
                                    <div className={styles.answer}>{answer.text}</div>
                                    <div className={styles.editAnswer} onClick={this.handleClick.bind(this, ownQuestion.question.questionId)}>Editar respuesta</div>
                                </div>
                                :
                                ''
                        )}
                    </div>
                </div>
            </div>
        );
    }
}