import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TextInput extends Component {

    static propTypes = {
        placeholder: PropTypes.string.isRequired
    };

    constructor() {
        super();

        this.onFocusHandler = this.onFocusHandler.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    getValue() {
        return this.refs.input.value;
    }

    render() {
        return (
            <li>
                <div className="item-content">
                    <div className="item-inner">
                        <div className="item-input">
                            <input {...this.props} ref="input" type="text" placeholder={this.props.placeholder} onFocus={this.onFocusHandler}/>
                        </div>
                    </div>
                </div>
            </li>
        );
    }

    onFocusHandler() {
        let inputElem = this.refs.input;
        inputElem.scrollIntoView();
        document.getElementsByClassName('view')[0].scrollTop -= 50;
    }
}