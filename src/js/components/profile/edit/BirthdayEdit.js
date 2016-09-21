import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import DateInput from '../../ui/DateInput';
import translate from '../../../i18n/Translate';

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

        this.onChangeValue = this.onChangeValue.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    onChangeValue(date) {
        const {editKey} = this.props;
        this.props.handleChangeEdit(editKey, date);
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, data, strings} = this.props;
        return (
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'birthday'} addedClass={'tag-filter'} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                <div className="birthday-filter-wrapper">
                    <DateInput label={metadata.label} placeholder={strings.birthdayPlaceholder} defaultValue={data} onChange={this.onChangeValue}/>
                </div>
            </SelectedEdit>

        );
    }
}

BirthdayEdit.defaultProps = {
    strings: {
        birthdayPlaceholder: 'Your birth date'
    }
};