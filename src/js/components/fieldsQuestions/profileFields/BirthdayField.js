import React, { PropTypes, Component } from 'react';
import DateInput from '../../ui/DateInput';
import FullWidthButton from '../../ui/FullWidthButton';
import translate from '../../../i18n/Translate';

@translate('BirthdayField')
export default class BirthdayField extends Component {
    static propTypes = {
        birthday       : PropTypes.string,
        onSaveHandler  : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };
    
    handleClickSave() {
        this.props.onSaveHandler('birthday', this.refs.birthday.getValue());
    }

    render() {
        const {birthday, strings} = this.props;
        return (
            <div>
                <div className="answer-question">
                    <div className="title answer-question-title">
                        {strings.title}
                    </div>
                    <div className="list-block">
                        <ul>
                            <DateInput defaultValue={birthday} placeholder={strings.birthdayPlaceholder} ref="birthday"/>
                        </ul>
                    </div>
                </div>
                <br />
                <br />
                <FullWidthButton type="submit" onClick={this.handleClickSave.bind(this)}>{strings.save}</FullWidthButton>
            </div>
        );
    }
}

BirthdayField.defaultProps = {
    strings: {
        birthday           : 'birthday',
        title              : 'When were you born?',
        birthdayPlaceholder: 'Your birthday',
        save               : 'Save'
    }
};
