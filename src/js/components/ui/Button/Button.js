import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Button.scss';

export default class Button extends Component {

    static propTypes = {
        color           : PropTypes.string,
        borderColor     : PropTypes.string,
        backgroundColor : PropTypes.string,
        disabled        : PropTypes.bool,
        size            : PropTypes.oneOf(['small']),
        textAlign       : PropTypes.string,
        onClickHandler  : PropTypes.func
    };

    handleClick() {
        const {disabled} = this.props;

        if (!disabled && this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {textAlign, size, disabled, color, borderColor, backgroundColor, children} = this.props;

        return (
            <div className={styles.buttonWrapper + ' ' + styles[textAlign]}>
                <button className={styles.button + ' ' + styles[size]} disabled={disabled} style={{color: color, borderColor: borderColor, backgroundColor: backgroundColor}} onClick={this.handleClick.bind(this)}>
                    {children}
                </button>
            </div>
        );
    }
}