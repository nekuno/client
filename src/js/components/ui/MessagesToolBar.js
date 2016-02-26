import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';

export default class MessagesToolBar extends Component {
    static propTypes = {
        onClickHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }
    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div className="toolbar">
                <div className="toolbar-inner">
                    <div className="toolbar messagebar">
                        <div className="toolbar-inner">
                            <textarea placeholder="Escribir mensaje..."></textarea>
                            <a onClick={this.onClickHandler}>Enviar</a>
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
