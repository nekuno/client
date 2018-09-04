import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Button.scss';

export default class Button extends Component {

    static propTypes = {
        disabled      : PropTypes.bool,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        const {disabled} = this.props;

        if (!disabled && this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {disabled, children} = this.props;

        return (
            <div className={styles.buttonWrapper}>
                <button className={styles.button} disabled={disabled} onClick={this.handleClick.bind(this)}>
                    {children}
                </button>
            </div>
        );
    }
}