import React, { PropTypes, Component } from 'react';
import InputRadio from '../ui/InputRadio';

export default class AnswerRadio extends Component {
    static propTypes = {
        answer        : PropTypes.object.isRequired,
        checked       : PropTypes.bool.isRequired,
        onClickHandler: PropTypes.func
    };

    render() {
        const {answer, checked} = this.props;
        return (
            <li>
                <InputRadio value={answer.answerId} name={'answerId'} text={answer.text} checked={checked} onClickHandler={this.props.onClickHandler}/>
            </li>
        );
    }
}
