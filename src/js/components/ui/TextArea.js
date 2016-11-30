import React, { PropTypes, Component } from 'react';

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
        this.state = {
            value: props.defaultValue || ''
        };
    }

    componentDidMount() {
        if (this.props.focus) {
            this.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.defaultValue && nextProps.defaultValue !== null) {
            this.setState({value: nextProps.defaultValue});
        }
    }

    getValue() {
        return this.refs.textarea.value;
    }

    focus() {
        this.refs.textarea.focus();
    }

    onFocusHandler() {
        let textareaElem = this.refs.textarea;
        if (textareaElem) {
            window.setTimeout(function() {
                textareaElem.scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }, 500);
        }
    }

    onChange() {
        this.setState({value: this.getValue()});
        this.props.onChange();
    }

    render() {
        const {placeholder, title, style} = this.props;
        return (
            <li>
                { this.state.value ? <div className="textarea-title">{title}</div> : null}
                <textarea ref="textarea"
                          placeholder={placeholder}
                          style={style}
                          onChange={this.onChange}
                          value={this.state.value}
                          onFocus={this.onFocusHandler}/>
            </li>
        );
    }

}