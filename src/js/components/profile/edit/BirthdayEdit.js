import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DateInput from '../../ui/DateInput/DateInput';
import translate from '../../../i18n/Translate';
import InputSelectSingle from "../../ui/InputSelectSingle/InputSelectSingle";

@translate('BirthdayEdit')
export default class BirthdayEdit extends Component {
    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.string,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    onChangeValue(date) {
        const {editKey} = this.props;
        this.toggleOpen();
        this.props.handleChangeEdit(editKey, date);
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    toggleOpen() {
        const {open} = this.state;
        this.setState({
            open: !open
        })
    }

    render() {
        const {metadata, data, strings} = this.props;
        const {open} = this.state;
        return (
                    <div className="birthday-filter-wrapper">
                        {!open ?
                            <InputSelectSingle options={[data]} onToggle={this.toggleOpen} placeholderText={data}/>
                        :
                            <DateInput label={metadata.labelEdit} placeholder={strings.birthdayPlaceholder} defaultValue={data} onChange={this.onChangeValue} autoFocus={true}/>
                        }

                    </div>


        );
    }
}

BirthdayEdit.defaultProps = {
    strings: {
        birthdayPlaceholder: 'Your birth date'
    }
};