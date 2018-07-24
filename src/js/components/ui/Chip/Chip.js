import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Chip.scss';

export default class Chip extends Component {

    static propTypes = {
        onClickHandler : PropTypes.func.isRequired,
        text           : PropTypes.string.isRequired,
        selected       : PropTypes.bool
    };

    handleClick() {
        this.props.onClickHandler();
    }

    render() {
        const {text, selected} = this.props;
        const chipClass = selected ? styles.selected + ' ' + styles.chip : styles.chip;

        return (
            <div className={chipClass} onClick={this.handleClick.bind(this)}>
                {selected ?
                    <span className={styles.cancelIcon + ' icon icon-cancel-circle'}/>
                    :
                    <span className={styles.addIcon + ' icon icon-cancel-circle'}/>
                }
                <div className={styles.text}>{text}</div>
            </div>
        );
    }
}