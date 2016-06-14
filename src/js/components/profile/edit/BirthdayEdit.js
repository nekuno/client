import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import DateInput from '../../ui/DateInput';
import translate from '../../../i18n/Translate';

@translate('BirthdayEdit')
export default class BirthdayEdit extends Component {
    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.string,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit     : PropTypes.func.isRequired,
        handleClickEdit      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue() {
        if (this.refs.hasOwnProperty(this.props.editKey)) {
            const value = this.refs[this.props.editKey].getValue();
            this.props.handleChangeEdit(this.props.editKey, value);
        }
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit, strings} = this.props;
        return (
            selected ?
                <SelectedEdit key={'selected-filter'} type={'birthday'} addedClass={'tag-filter'} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <div className="birthday-filter-wrapper">
                        <div className="list-block">
                            <ul>
                                <DateInput ref={editKey} label={metadata.label} placeholder={strings.birthdayPlaceholder} defaultValue={data} onChange={this.onChangeValue}/>
                            </ul>
                        </div>
                    </div>
                </SelectedEdit>
                :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit}/>
        );
    }
}

BirthdayEdit.defaultProps = {
    strings: {
        birthdayPlaceholder: 'Your birth date'
    }
};