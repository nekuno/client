import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Input.scss';

export default class Input extends Component {
    static propTypes = {
        placeholder : PropTypes.string,
        type        : PropTypes.string,
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        checked     : PropTypes.bool,
        doNotFocus  : PropTypes.bool,
        doNotScroll : PropTypes.bool,
        onChange    : PropTypes.func,
        maxLength   : PropTypes.string,
        searchIcon  : PropTypes.bool,
        size        : PropTypes.oneOf(['regular', 'small'])
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
        this.getValue = this.getValue.bind(this);
        this.clearValue = this.clearValue.bind(this);

        this.state = {
            empty: !props.defaultValue
        };
    }

    componentDidMount() {
        if (!this.props.doNotFocus) {
            this.focus();
        }
    }

    getValue() {
        return this.refs.input ? this.refs.input.value : null;
    }

    clearValue() {
        this.refs.input.value = '';
        this.onChange();
    }

    focus() {
        if (this.refs.input) {
            this.refs.input.focus();
        }
    }

    onFocusHandler() {
        const {doNotScroll} = this.props;
        let inputElem = this.refs.input;
        if (inputElem && !doNotScroll) {
            window.setTimeout(function () {
                inputElem.scrollIntoView();
                const viewClass = document.getElementsByClassName('view');
                if (viewClass && viewClass[0]) {
                    viewClass[0].scrollTop -= 100;
                }
            }, 500);
        }
    }

    onChange() {
        if (this.props.onChange) {
            this.props.onChange(this.getValue());
        }

        this.setState({empty: !this.getValue()});
    }

    render() {
        const {placeholder, type, defaultValue, checked, maxLength, searchIcon, size} = this.props;
        const {empty} = this.state;
        const sizeClass = size === 'small' ? styles.small : null;
        return (
            <div className={styles.inputWrapper + ' ' + sizeClass}>
                <div className={styles.input}>
                    {searchIcon && empty ?
                        <span className={styles.searchIcon + ' icon icon-search'}/>
                        : null
                    }
                    <input ref="input"
                           type={type || "text"}
                           placeholder={placeholder}
                           defaultValue={defaultValue}
                           onChange={this.onChange}
                           onFocus={this.onFocusHandler}
                           maxLength={maxLength}
                           required
                    />
                    {!empty && !checked ?
                        <span className={styles.iconCancel + ' ' + 'icon icon-x'} onClick={this.clearValue}/>
                        : null
                    }
                    {!empty && checked ?
                        <span className={'icon icon-check-circle ' + styles.iconCheck}/>
                        : null
                    }
                </div>
            </div>
        );
    }
}