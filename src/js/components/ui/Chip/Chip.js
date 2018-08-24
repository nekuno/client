import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Chip.scss';

export default class Chip extends Component {

    static propTypes = {
        onClickHandler : PropTypes.func.isRequired,
        text           : PropTypes.string.isRequired,
        selected       : PropTypes.bool,
        color          : PropTypes.oneOf(['purple', 'blue', 'pink', 'green'])
    };

    handleClick() {
        this.props.onClickHandler();
    }

    render() {
        const {text, selected, color} = this.props;
        const chipClass = selected ? styles.selected + ' ' + styles.chip : styles.chip;

        return (
            <div className={chipClass + ' ' + styles[color]} onClick={this.handleClick.bind(this)}>
                {selected ?
                    null :
                    <span className={styles.addIcon + ' icon icon-x'}/>
                }
                <div className={styles.text}>{text}</div>
                {selected ?
                    <span className={styles.cancelIcon + ' icon icon-x'}/>
                    : null
                }
            </div>
        );
    }
}