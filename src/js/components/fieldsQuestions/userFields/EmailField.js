import React, { PropTypes, Component } from 'react';
import TextInput from '../../ui/TextInput';
import FullWidthButton from '../../ui/FullWidthButton';
import translate from '../../../i18n/Translate';

@translate('EmailField')
export default class EmailField extends Component {
    static propTypes = {
        email        : PropTypes.string,
        onSaveHandler: PropTypes.func,
        // Injected by @translate:
        strings      : PropTypes.object
    };

    handleClickSave() {
        this.props.onSaveHandler('email', this.refs.email.getValue());
    }

    render() {
        const {email, strings} = this.props;
        return (
            <div>
                <div className="answer-question">
                    <div className="title answer-question-title">
                        {strings.title}
                    </div>
                    <div className="list-block">
                        <ul>
                            <TextInput defaultValue={email} placeholder={strings.email} ref="email" />
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

EmailField.defaultProps = {
    strings: {
        email: 'email',
        title: 'Select your email',
        save : 'Save'
    }
};
