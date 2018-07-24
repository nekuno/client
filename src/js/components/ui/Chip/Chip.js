import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Chip.scss';

export default class Chip extends Component {

    static propTypes = {
        onClickHandler : PropTypes.func.isRequired,
        onCancelHandler: PropTypes.func,
        text           : PropTypes.string.isRequired,
        selected       : PropTypes.bool
    };

    handleClick() {
        this.props.onClickHandler();
    }

    handleCancel() {
        if (this.props.onCancelHandler) {
            this.props.onCancelHandler();
        }
    }

    render() {
        const {text, selected} = this.props;
        const chipClass = selected ? styles.selected + ' ' + styles.chip : styles.chip;

        return (
            <div className={chipClass}>
                {this.props.onCancelHandler ?
                    <span className={styles.cancelIcon + ' icon icon-cancel-circle'} onClick={this.handleCancel.bind(this)}/>
                    : null
                }
                <div className={styles.text} onClick={this.handleClick.bind(this)}>{text}</div>
            </div>
        );
    }
}