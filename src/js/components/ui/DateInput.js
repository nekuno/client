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
            <li>
                <div className="item-content">
                    <div className="item-inner">
                        <div className="item-input">
                            <label>{this.props.label} <input {...this.props} ref="input" type="date"/></label>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}