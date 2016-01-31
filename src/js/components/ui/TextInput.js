import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TextInput extends Component {

    static propTypes = {
        placeholder: PropTypes.string.isRequired
    };

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
                            <input {...this.props} ref="input" type="text" placeholder={this.props.placeholder}/>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}