import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoundedIcon from '../RoundedIcon/RoundedIcon.js';
import styles from './InputRadio.scss';

export default class InputRadio extends Component {

    static propTypes = {
        value         : PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        text          : PropTypes.string.isRequired,
        checked       : PropTypes.bool.isRequired,
        onClickHandler: PropTypes.func.isRequired,
        reverse       : PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler() {
        this.props.onClickHandler(this.props.value);
    }

    render() {
        const {reverse, checked, text} = this.props;
        //TODO: Replace with check/un-check icons
        const icon = checked ? 'minus' : 'plus';

        return (
            reverse ?
                <label className={styles.inputRadio} onClick={this.onClickHandler}>
                    <div className={styles.iconWrapper}>
                        <RoundedIcon icon={icon} size={'small'} />
                    </div>
                    <div className={styles.itemWrapper}>
                        <div className={styles.itemText}>{text}</div>
                    </div>
                </label>
                :
                <label className={styles.inputRadio} onClick={this.onClickHandler}>
                    <div className={styles.itemWrapper}>
                        <div className={styles.itemText}>{text}</div>
                    </div>
                    <div className={styles.iconWrapper}>
                        <RoundedIcon icon={icon} size={'small'} />
                    </div>
                </label>
        );
    }
}
