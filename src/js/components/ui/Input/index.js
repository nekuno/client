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
        maxNum      : PropTypes.number,
        minNum      : PropTypes.number,
        searchIcon  : PropTypes.bool,
        textColor   : PropTypes.string,
        size        : PropTypes.oneOf(['regular', 'small']),
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.clearValue = this.clearValue.bind(this);
        this.isFocused = this.isFocused.bind(this);

        this.state = {
            empty: !props.defaultValue,
            focused: false
        };
    }

    componentDidMount() {
        if (!this.props.doNotFocus) {
            this.focus();
        }
    }

    setValue(value) {
        console.log(value);
        console.log(this.refs);
        console.log(this.refs.input);
        if (this.refs.input) {
            this.refs.input.value = value;
        }
    }

    getValue() {
        return this.refs.input ? this.refs.input.value : null;
    }

    clearValue() {
        if (this.refs.input) {
            this.refs.input.value = '';
        }
        this.onChange();
    }

    focus() {
        if (this.refs.input) {
            this.refs.input.focus();
        }
    }

    isFocused() {
        return this.state.focused;
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

        this.setState({focused: true});
    }

    onBlurHandler() {
        this.setState({focused: false});
    }

    onChange() {
        if (this.props.onChange) {
            this.props.onChange(this.getValue());
        }

        this.setState({empty: !this.getValue()});
    }

    render() {
        const {placeholder, type, defaultValue, checked, maxLength, minNum, maxNum, searchIcon, textColor, size} = this.props;
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
                           onBlur={this.onBlurHandler}
                           maxLength={maxLength}
                           min={minNum}
                           max={maxNum}
                           required
                           style={{color: textColor}}
                    />
                    {/*{!empty && !checked ?*/}
                        {/*<span className={styles.iconCancel + ' ' + 'icon icon-x'} onClick={this.clearValue}/>*/}
                        {/*: null*/}
                    {/*}*/}
                    {!empty && checked ?
                        <span className={'icon icon-check-circle ' + styles.iconCheck}/>
                        : null
                    }
                </div>
            </div>
        );
    }
}