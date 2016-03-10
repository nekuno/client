import React, { PropTypes, Component } from 'react';

export default class MessagesToolBar extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    handleClick() {
        let text = this.refs.textarea.value.trim();
        if (text) {
            this.props.onClickHandler(text);
        }
        this.refs.textarea.value = '';
    }

    _onKeyDown(event) {
        let ENTER_KEY_CODE = 13;
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            this.handleClick();
        }
    }

    render() {
        return (
            <div className="toolbar">
                <div className="toolbar-inner">
                    <div className="toolbar messagebar">
                        <div className="toolbar-inner">
                            <textarea placeholder="Escribir mensaje..." ref="textarea" onKeyDown={this._onKeyDown}/>
                            <a onClick={this.handleClick}>Enviar</a>
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
