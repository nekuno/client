import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Chip.scss';

export default class Chip extends Component {

    static propTypes = {
        onClickHandler : PropTypes.func.isRequired,
        onCancelHandler: PropTypes.func,
        text           : PropTypes.string.isRequired,
        value          : PropTypes.string,
        selected       : PropTypes.bool,
        color          : PropTypes.oneOf(['purple', 'blue', 'pink', 'green']),
        fullWidth      : PropTypes.bool
    };

    handleClick() {
        const {value, text} = this.props;

        this.props.onClickHandler(value || text);
    }

    handleCancel() {
        if (this.props.onCancelHandler) {
            this.props.onCancelHandler();
        }
    }

    render() {
        const {text, selected, color, fullWidth} = this.props;
        let chipClass = selected ? styles.selected + ' ' + styles.chip : styles.chip;
        chipClass = fullWidth ? chipClass + ' ' + styles.fullWidth : chipClass;

        return (
            <div className={chipClass + ' ' + styles[color]}>
                {selected ?
                    null :
                    <span className={styles.addIcon + ' icon icon-x'} onClick={this.handleClick.bind(this)}/>
                }
                <div className={styles.text} onClick={this.handleClick.bind(this)}>{text}</div>
                {selected ?
                    <span className={styles.cancelIcon + ' icon icon-x'} onClick={this.handleCancel.bind(this)}/>
                    : null
                }
            </div>
        );
    }
}