import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputRadio from '../InputRadio/InputRadio.js';
import styles from './Select.scss';

export default class Select extends Component {

    static propTypes = {
        title          : PropTypes.string,
        options        : PropTypes.array.isRequired,
        defaultOption  : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onClickHandler : PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            selected: props.defaultOption || null
        };
    }

    handleClick(value) {
        this.setState({selected: value});

        this.props.onClickHandler(value);
    }


    render() {
        const {title, options} = this.props;
        const {selected} = this.state;

        return (
            <div className={styles.selectWrapper}>
                {title ? <div className={styles.title + ' small'}>{title}</div> : null}
                <div className={styles.select}>
                    {options.map((option, key) =>
                        <InputRadio key={key} value={option.key} text={option.text} checked={selected !== option.key} onClickHandler={this.handleClick}/>
                    )}
                </div>
            </div>
        );
    }
}