import React, { PropTypes, Component } from 'react';

export default class DateInput extends Component {

    static propTypes = {
        label       : PropTypes.string.isRequired,
        placeholder : PropTypes.string.isRequired,
        defaultValue: PropTypes.string
    };

    constructor(props) {

        super(props);

        this.state = {
            calendar: null
        }
    }

    getValue() {
        return this.refs.input.value;
    }

    componentDidMount() {
        let calendar = nekunoApp.calendar({
            input: '#calendar-input'
        });
        this.setState({
            calendar: calendar
        });
    }

    render() {
        return (
            <li className="date-item">
                <div className="item-content date-content">
                    <div className="item-title label date-label">{this.props.label}</div>
                    <div className="item-inner">
                        <div className="item-input">
                            <input {...this.props} id="calendar-input" ref="input" type="text" placeholder={this.props.placeholder}/>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}