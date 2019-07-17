import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chip from './Chip';

export default class TagInput extends Component {

    static propTypes = {
        value            : PropTypes.string,
        tags             : PropTypes.array.isRequired,
        placeholder      : PropTypes.string.isRequired,
        type             : PropTypes.string,
        title            : PropTypes.string,
        onKeyUpHandler   : PropTypes.func,
        onClickTagHandler: PropTypes.func,
        doNotFocus       : PropTypes.bool
    };

    constructor() {
        super();

        this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
    }

    componentDidMount() {
        if (!this.props.doNotFocus) {
            this.focus();
        }
    }

    clearValue() {
        return this.refs.tagInput.value = '';
    }

    setValue(value) {
        return this.refs.tagInput.value = value;
    }

    getValue() {
        return this.refs.tagInput.value;
    }

    focus() {
        this.refs.tagInput.focus();
    }

    render() {
        const {tags, placeholder, type, title, value} = this.props;
        return (
            <div className="tag-input-wrapper">
                <div className="tag-input-title">{title ? title : ''}</div>
                <div className="tag-input">
                    <input placeholder={placeholder} ref="tagInput" type={type || "text"} defaultValue={value} onKeyUp={this.onKeyUpHandler} onFocus={this.onFocusHandler} required/>
                </div>
                <div className="tag-suggestions">
                    <ul>
                        {tags.map((tag, index) => <li key={index} className="tag-suggestion"><Chip onClickHandler={this.onClickTagHandler.bind(this, tag)} label={tag} value={tag}/></li>)}
                    </ul>
                </div>
            </div>
        );
    }

    onKeyUpHandler() {
        this.props.onKeyUpHandler(this.refs.tagInput.value);
    }

    onClickTagHandler(tag) {
        //this.refs.tagInput.value = '';
        this.props.onClickTagHandler(tag);
    }

    onFocusHandler() {
        let inputElem = this.refs.tagInput;
        if (inputElem) {
            /*window.setTimeout(function() {
                inputElem.scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }, 500);*/
        }
    }
}