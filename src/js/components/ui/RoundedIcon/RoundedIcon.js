import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './RoundedIcon.scss';

export default class RoundedIcon extends Component {

    static propTypes = {
        icon           : PropTypes.string.isRequired,
        size           : PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
        disabled       : PropTypes.bool,
        background     : PropTypes.string,
        color          : PropTypes.string,
        fontSize       : PropTypes.string,
        onClickHandler : PropTypes.func
    };

    handleClick() {
        if (!this.props.disabled && this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {icon, size, disabled, background, color, fontSize} = this.props;
        let className = styles.roundedIcon + ' ' + styles[size];
        className = disabled ? styles.disabled + ' ' + className : className;

        return (
            <div className={className} style={{background: background, color: color}} onClick={this.handleClick.bind(this)}>
                <div className={styles.icon + ' icon icon-' + icon} style={{fontSize: fontSize}}/>
            </div>
        );
    }
}