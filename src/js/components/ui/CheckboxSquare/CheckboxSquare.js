import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CheckboxSquare.scss';
import SquareIcon from "../SquareIcon/SquareIcon";
import RoundedIcon from "../RoundedIcon/RoundedIcon";

export default class CheckboxSquare extends Component {

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
        this.setState({
            checked : !this.state.checked,
        });
        this.props.onClickHandler(!this.props.checked, this.props.value);
    }

    render() {
        const {children, checked} = this.props;

        return (
            this.state.checked ?
                <SquareIcon background={"#928bff"} icon={'check'} size={'xx-small'} color={'#ffffff'} onClickHandler={this.handleClick}/>
                :
                <SquareIcon background={"#ffffff"} border={'1px solid #c5d0de'} size={'xx-small'} color={'#ffffff'} onClickHandler={this.handleClick}/>
        );
    }
}