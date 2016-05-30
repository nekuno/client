import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextInput from '../../ui/TextInput';
import translate from '../../../i18n/Translate';

@translate('IntegerEdit')
export default class IntegerEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.number,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit     : PropTypes.func.isRequired,
        handleClickEdit      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
    }

    handleChangeIntegerInput() {
        clearTimeout(this.integerTimeout);
        const {editKey, metadata, strings} = this.props;
        const value = this.refs[editKey] ? parseInt(this.refs[editKey].getValue()) : 0;
        if (typeof value === 'number' && (value % 1) === 0 || value === '') {
            const minValue = metadata.min || 0;
            const maxValue = metadata.max || 0;
            if (typeof value === 'number' && value < minValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert(strings.minValue + minValue);
                }, 1000);
            } else if (typeof value === 'number' && value > maxValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert(strings.maxValue + maxValue);
                }, 1000);
            } else {
                this.props.handleChangeEdit(editKey, value);
            }
        } else {
            this.integerTimeout = setTimeout(() => {
                nekunoApp.alert(strings.value);
            }, 1000);
        }
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit, strings} = this.props;
        return (
            selected ?
                <SelectedEdit key={'selected-filter'} type={'integer'} plusIcon={true} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <div className="list-block">
                        <div className="integer-title">{metadata.label}</div>
                        <ul>
                            <TextInput ref={editKey} placeholder={strings.placeholder} onChange={this.handleChangeIntegerInput} defaultValue={data}/>
                        </ul>
                    </div>
                </SelectedEdit>
                :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit}/>
        );
    }
}

IntegerEdit.defaultProps = {
    strings: {
        minValue   : 'The minimum value of this value is ',
        maxValue   : 'The maximum value of this value is ',
        value      : 'This value must be an integer',
        placeholder: 'Type a number'
    }
};