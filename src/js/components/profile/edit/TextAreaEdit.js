import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextInput from '../../ui/TextInput';

export default class TextAreaEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.onChangeValue = this.onChangeValue.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    onChangeValue() {
        if (this.refs.hasOwnProperty(this.props.editKey)){
            const value = this.refs[this.props.editKey].getValue();
            this.props.handleChangeEdit(this.props.editKey, value);
        }
    }

    handleClickRemoveEdit() {
        const {editKey, handleClickRemoveEdit} = this.props;
        handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, data} = this.props;
        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveEdit={this.handleClickRemoveEdit}>
                <div className="location-filter-wrapper">
                    <div className="list-block">
                        <ul>
                            <TextInput placeholder={metadata.label} ref={editKey} label={metadata.label} defaultValue={data} onChange={this.onChangeValue}/>
                        </ul>
                    </div>
                </div>
            </SelectedEdit>
        );
    }
}