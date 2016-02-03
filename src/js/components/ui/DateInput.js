import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class DateInput extends Component {

    static propTypes = {
        label: PropTypes.string.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    getValue() {
        return this.refs.input.value;
    }

    render() {
        return (
            <li className="date-item">
                <div className="item-content date-content">
                    <div className="item-title label date-label">{this.props.label}</div>
                    <div className="item-inner">
                        <div className="item-input">
                            <input {...this.props} ref="input" type="date"/>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}