import React, { PropTypes, Component } from 'react';

export default class MessagesToolBar extends Component {

    static propTypes = {
        placeholder   : PropTypes.string.isRequired,
        text          : PropTypes.string.isRequired,
        onClickHandler: PropTypes.func.isRequired,
        onFocusHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    handleClick() {
        let text = this.refs.textarea.value.trim();
        if (text) {
            this.props.onClickHandler(text);
        }
        this.refs.textarea.value = '';
    }

    handleFocus(e) {
        this.props.onFocusHandler(e);
    }

    componentDidMount() {
        this.refs.textarea.focus();
    }

    _onKeyDown(event) {
        let ENTER_KEY_CODE = 13;
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            this.handleClick();
        }
    }

    render() {

        const {placeholder, text} = this.props;

        return (
            <div id="messages-toolbar" className="toolbar">
                <div className="toolbar-inner">
                    <div className="toolbar messagebar">
                        <div className="toolbar-inner">
                            <textarea placeholder={placeholder} ref="textarea" onKeyDown={this._onKeyDown} onFocus={this.handleFocus}/>
                            <a onClick={this.handleClick}>{text}</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onClickHandler() {
        this.props.onClickHandler();
    }
}
