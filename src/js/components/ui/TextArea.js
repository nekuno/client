import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class TextArea extends Component {

    static propTypes = {
        placeholder : PropTypes.string.isRequired,
        title       : PropTypes.string.isRequired,
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        style       : PropTypes.object,
        focus       : PropTypes.bool,
        onChange    : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.onFocusHandler = this.onFocusHandler.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (this.props.focus) {
            this.focus();
        }
    }

    getValue() {
        return this.refs.textarea.value;
    }

    clearValue() {
        this.refs.textarea.value = '';
    }

    setValue(value) {
        this.refs.textarea.value = value;
    }

    focus() {
        this.refs.textarea.focus();
    }

    onFocusHandler() {
        let textareaElem = this.refs.textarea;
        if (textareaElem) {
            /*window.setTimeout(function() {
                textareaElem.scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }, 500);*/
        }
    }

    onChange() {
        this.props.onChange();
    }

    render() {
        const {placeholder, title, style, defaultValue} = this.props;
        return (
            <li>
                <div className="textarea-title">{title}</div>
                <textarea ref="textarea"
                          placeholder={placeholder}
                          style={style}
                          onChange={this.onChange}
                          onFocus={this.onFocusHandler}
                          defaultValue={defaultValue}
                          required
                />
            </li>
        );
    }

}