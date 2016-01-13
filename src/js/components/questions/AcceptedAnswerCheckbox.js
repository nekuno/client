import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import InputCheckbox from '../ui/InputCheckbox';

export default class AcceptedAnswerCheckbox extends Component {
    static propTypes = {
        answer: PropTypes.object.isRequired,
        checked: PropTypes.bool.isRequired,
        userAnswer: PropTypes.object,
        ownPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired,
        onClickHandler: PropTypes.func
    };

    render() {

        let userAnswer = this.props.userAnswer;
        let answer = this.props.answer;
        let checked = this.props.checked;

        return (
            <li>
                <InputCheckbox value={answer.answerId} name={'accepted-answer'} text={answer.text} checked={checked} onClickHandler={this.props.onClickHandler} />
            </li>
        );
    }
}
