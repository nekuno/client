import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DateInput from '../../ui/DateInput';
import translate from '../../../i18n/Translate';

@translate('BirthdayField')
export default class BirthdayField extends Component {
    static propTypes = {
        birthday       : PropTypes.string,
        onSaveHandler  : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(date) {
        this.props.onSaveHandler('birthday', date);
    }

    render() {
        const {birthday, strings} = this.props;
        return (
            <div>
                <div className="answer-question">
                    <div className="title answer-question-title">
                        {strings.title}
                    </div>
                    <DateInput defaultValue={birthday} placeholder={strings.birthdayPlaceholder} onChange={this.onChange} autoFocus={true}/>
                </div>
                <br />
                <br />
                <br />
            </div>
        );
    }
}

BirthdayField.defaultProps = {
    strings: {
        birthday           : 'birthday',
        title              : 'When were you born?',
        birthdayPlaceholder: 'Your birthday'
    }
};
