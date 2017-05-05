import React, { PropTypes, Component } from 'react';

export default class Input extends Component {

    static propTypes = {
        placeholder : PropTypes.string.isRequired,
        type        : PropTypes.string,
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        style       : PropTypes.object,
        doNotFocus  : PropTypes.bool,
        onChange    : PropTypes.func,
        onKeyDown   : PropTypes.func,
        maxLength   : PropTypes.string
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
        return this.refs.input.value;
    }

    focus() {
        this.refs.input.focus();
    }

    render() {
        const {placeholder, type, defaultValue, style, maxLength, onChange, onKeyDown} = this.props;
        return (
            <li>
                <div className="item-content">
                    <div className="item-inner">
                        <div className="item-input">
                            <input ref="input" type={type || "text"}
                                   placeholder={placeholder}
                                   defaultValue={defaultValue}
                                   style={style}
                                   onKeyDown={onKeyDown}
                                   onChange={onChange}
                                   onFocus={this.onFocusHandler}
                                   maxLength={maxLength}/>
                        </div>
                    </div>
                </div>
            </li>
        );
    }

    onFocusHandler() {
        let inputElem = this.refs.input;
        if (inputElem) {
            window.setTimeout(function () {
                inputElem.scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }, 500);
        }
    }
}