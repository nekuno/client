import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './QuestionMatch.scss';
import RoundedImage from "../RoundedImage/RoundedImage";

export default class QuestionMatch extends Component {

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
        const {children, otherQuestion, ownQuestion, otherUser, user} = this.props;

        return (
            <div className={styles.otherUserAnswerMatch}>
                <h3 className={styles.titleAnswer}>{otherQuestion.question.text}</h3>
                <div className={styles.userData}>
                    {otherUser && user &&
                    <div className={styles.photos}>
                        <div className={styles.photo}>
                            <RoundedImage size={'x-small'} url={otherUser.photo.url}/>
                        </div>
                        <div className={styles.photo}>
                            <RoundedImage size={'x-small'} url={user.photo.url}/>
                        </div>
                    </div>
                    }
                    <div className={styles.userText}>
                        {otherQuestion.question.answers.map((answer, answerId) =>
                            answer.answerId === otherQuestion.userAnswer.answerId ?
                                <div key={answerId}>
                                    <div className={styles.answer}>{answer.text}</div>
                                    <div className={styles.editAnswer} onClick={this.handleClick.bind(this, answer.answerId)}>Editar respuesta</div>
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
