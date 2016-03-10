import React, { PropTypes, Component } from 'react';

export default class MessagesToolBar extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.props.onClickHandler(this.refs.textarea.value, event);
    }

    render() {
        return (
            <div className="toolbar">
                <div className="toolbar-inner">
                    <div className="toolbar messagebar">
                        <div className="toolbar-inner">
                            <textarea placeholder="Escribir mensaje..." ref="textarea" />
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
