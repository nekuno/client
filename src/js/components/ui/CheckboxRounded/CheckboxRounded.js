import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CheckboxRounded.scss';
import RoundedIcon from "../RoundedIcon/RoundedIcon";

export default class CheckboxRounded extends Component {

    static propTypes = {
        onClickHandler : PropTypes.func,
        checked        : PropTypes.bool.isRequired,
        value          : PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            checked: props.checked,
        };
    }

    handleClick() {
        const {value} = this.props;

        this.props.onClickHandler(value);
    }

    render() {
        const {children, checked, value} = this.props;

        return (
            checked ?
                <RoundedIcon value={value} background={"#928bff"} icon={'check'} size={'xx-small'} onClickHandler={this.handleClick}/>
                :
                <RoundedIcon value={value} border={"1px solid #c5d0de"} background={"#ffffff"} icon={''} size={'xx-small'} onClickHandler={this.handleClick}/>
        );
    }
}