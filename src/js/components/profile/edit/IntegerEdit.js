import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextInput from '../../ui/TextInput';

export default class IntegerEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.number,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit: PropTypes.func.isRequired,
        handleClickEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
    }

    getSelectedEdit() {
        return this.refs.selectedEdit ? this.refs.selectedEdit.getSelectedEdit() : {};
    }

    selectedEditContains(target) {
        return this.refs.selectedEdit && this.refs.selectedEdit.selectedEditContains(target);
    }

    handleChangeIntegerInput() {
        clearTimeout(this.integerTimeout);
        const {editKey, metadata} = this.props;
        const value = this.refs[editKey] ? parseInt(this.refs[editKey].getValue()) : 0;
        if (typeof value === 'number' && (value % 1) === 0 || value === '') {
            const minValue = metadata.min || 0;
            const maxValue = metadata.max || 0;
            if (typeof value === 'number' && value < minValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert('El valor mínimo de este valor es ' + minValue);
                }, 1000);
            } else if (typeof value === 'number' && value > maxValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert('El valor máximo de este valor es ' + maxValue);
                }, 1000);
            } else {
                this.props.handleChangeEdit(editKey, value);
            }
        } else {
            this.integerTimeout = setTimeout(() => {
                nekunoApp.alert('Este valor debe ser un entero');
            }, 1000);
        }
    }
    
    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedEdit'} type={'integer'} plusIcon={true} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <div className="list-block">
                        <div className="integer-title">{metadata.label}</div>
                        <ul>
                            <TextInput ref={editKey} placeholder={'Escribe un número'} onChange={this.handleChangeIntegerInput} defaultValue={data}/>
                        </ul>
                    </div>
                </SelectedEdit>
                    :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit} />
        );
    }
}