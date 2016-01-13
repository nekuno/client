import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import InputRadio from '../ui/InputRadio';

export default class AnswerRadio extends Component {
    static propTypes = {
        answer: PropTypes.object.isRequired,
        checked: PropTypes.bool.isRequired,
        userAnswer: PropTypes.object,
        ownPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {

        let userAnswer = this.props.userAnswer;
        let answer = this.props.answer;
        let checked = this.props.checked;

        return (
        <li>
            <InputRadio value={answer.answerId} name={'answer'} text={answer.text} checked={checked} />
        </li>
        );
    }
}