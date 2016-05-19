import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import DateInput from '../../ui/DateInput';
import TextRadios from '../../ui/TextRadios';

export default class BirthdayEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit: PropTypes.func.isRequired,
        handleClickEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    getSelectedEdit() {
        return this.refs.selectedEdit ? this.refs.selectedEdit.getSelectedEdit() : {};
    }

    selectedEditContains(target) {
        return this.refs.selectedEdit && this.refs.selectedEdit.selectedEditContains(target);
    }

    onChangeValue() {
        if (this.refs.hasOwnProperty(this.props.editKey)){
            const value = this.refs[this.props.editKey].getValue();
            this.props.handleChangeEdit(this.props.editKey, value);
        }
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedEdit'} type={'birthday'} addedClass={'tag-filter'} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <div className="birthday-filter-wrapper">
                        <div className="list-block">
                            <ul>
                                <DateInput ref={editKey} label={metadata.label} defaultValue={data} onChange={this.onChangeValue}/>
                            </ul>
                        </div>
                    </div>
                </SelectedEdit>
                    :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit} />
        );
    }
}