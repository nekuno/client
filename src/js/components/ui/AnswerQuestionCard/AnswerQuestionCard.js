import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './AnswerQuestionCard.scss';
import CardUser from "../../cardUsers/CardUser";
import translate from "../../../i18n/Translate";

@translate('AnswerQuestionCard')
export default class AnswerQuestionCard extends Component {

    static propTypes = {
        onClickHandler : PropTypes.func,
        question       : PropTypes.object,
        otherUser      : PropTypes.object,
        strings       : PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    handleClick(questionId) {
        const {otherUser} = this.props;
        this.context.router.push(`/answer-question/${questionId}/${otherUser.slug}`);
    }

    render() {
        const {children, question, strings} = this.props;
        return (
            <div className={styles.answerQuestionCard} onClick={this.handleClick.bind(this, question.questionId)}>
                <h3>{question.text}</h3>
                <p>{strings.answerQuestion}</p>
            </div>
        );
    }
}

AnswerQuestionCard.defaultProps = {
    strings: {
        answerQuestion      : 'Answer to see your answer',
    }
};