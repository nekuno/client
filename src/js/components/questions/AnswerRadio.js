import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import InputRadio from '../ui/InputRadio';

export default class AnswerRadio extends Component {
    static propTypes = {
        answer: PropTypes.object.isRequired,
        checked: PropTypes.bool.isRequired,
        userAnswer: PropTypes.object,
        onClickHandler: PropTypes.func
    };

    render() {

        let userAnswer = this.props.userAnswer;
        let answer = this.props.answer;
        let checked = this.props.checked;

        return (
        <li>
            <InputRadio value={answer.answerId} name={'answerId'} text={answer.text} checked={checked} onClickHandler={this.props.onClickHandler} />
        </li>
        );
    }
}
