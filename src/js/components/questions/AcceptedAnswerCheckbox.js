import React, { PropTypes, Component } from 'react';
import InputCheckbox from '../ui/InputCheckbox';

export default class AcceptedAnswerCheckbox extends Component {

    static propTypes = {
        answer        : PropTypes.object.isRequired,
        checked       : PropTypes.bool.isRequired,
        onClickHandler: PropTypes.func
    };

    render() {
        const {answer, checked} = this.props;
        return (
            <li>
                <InputCheckbox value={answer.answerId} text={answer.text} checked={checked} onClickHandler={this.props.onClickHandler}/>
            </li>
        );
    }
}
