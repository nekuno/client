import React, { PropTypes, Component } from 'react';

export default class TextArea extends Component {

    static propTypes = {
        placeholder : PropTypes.string.isRequired,
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        style       : PropTypes.object,
        doNotFocus  : PropTypes.bool,
        onChange    : PropTypes.func
    };

    constructor() {
        super();

        this.onFocusHandler = this.onFocusHandler.bind(this);
    }

    componentDidMount() {
        if (!this.props.doNotFocus) {
            this.focus();
        }
    }

    getValue() {
        return this.refs.textarea.value;
    }

    focus() {
        this.refs.textarea.focus();
    }

    render() {
        const {placeholder, defaultValue, style, onChange} = this.props;
        return (
            <li>
                <textarea ref="textarea"
                          placeholder={placeholder}
                          style={style}
                          onChange={onChange}
                          defaultValue={defaultValue}
                          onFocus={this.onFocusHandler}/>
            </li>
        );
    }

    onFocusHandler() {
        let textareaElem = this.refs.textarea;
        if (textareaElem) {
            window.setTimeout(function () {
                textareaElem.scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }, 500);
        }
    }
}