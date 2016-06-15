import React, { PropTypes, Component } from 'react';

export default class DateInput extends Component {

    static propTypes = {
        label       : PropTypes.string.isRequired,
        placeholder : PropTypes.string.isRequired,
        defaultValue: PropTypes.string,
        onChange    : PropTypes.func
    };

    constructor(props) {

        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            calendar: null
        }
    }

    getValue() {
        return this.refs.input.value;
    }

    componentDidMount() {
        let calendar = nekunoApp.calendar({
            input              : '#calendar-input',
            convertToPopover   : false,
            closeOnSelect      : true,
            onChange           : this.onChange,
            monthPickerTemplate: '<div class="picker-calendar-month-picker">' +
            '<a href="javascript:void(0)" class="link icon-only picker-calendar-prev-month">' +
            '<i class="icon icon-prev"></i>' +
            '</a>' +
            '<span class="current-month-value"></span>' +
            '<a href="javascript:void(0)" class="link icon-only picker-calendar-next-month">' +
            '<i class="icon icon-next"></i>' +
            '</a>' +
            '</div>',
            yearPickerTemplate : '<div class="picker-calendar-year-picker">' +
            '<a href="javascript:void(0)" class="link icon-only picker-calendar-prev-year">' +
            '<i class="icon icon-prev"></i>' +
            '</a>' +
            '<span class="current-year-value"></span>' +
            '<a href="javascript:void(0)" class="link icon-only picker-calendar-next-year">' +
            '<i class="icon icon-next"></i>' +
            '</a>' +
            '</div>'
        });

        if (this.props.defaultValue) {
            calendar.setValue([this.props.defaultValue]);
        }

        this.setState({
            calendar: calendar
        });
    }

    onChange() {
        typeof this.props.onChange === 'function' ? window.setTimeout(this.props.onChange, 0) : null;
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