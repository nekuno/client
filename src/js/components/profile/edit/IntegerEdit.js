import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextInput from '../../ui/TextInput';
import translate from '../../../i18n/Translate';

@translate('IntegerEdit')
export default class IntegerEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.number,
        handleClickInput     : PropTypes.func.isRequired,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        handleErrorEdit      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickInput = this.handleClickInput.bind(this);
        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);

        this.state = {
            value: props.data ? props.data : '',
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const {editKey, metadata, selected, handleChangeEdit, handleErrorEdit, strings} = this.props;
        const {value} = nextState;
        const minValue = metadata.min;
        const maxValue = metadata.max;
        let error = '';
        if (selected && !nextProps.selected) {
            if (typeof value !== 'number' || isNaN(value)) {
                error += strings.value + '.\n';
            }
            if (value < minValue) {
                error += strings.minValue + minValue + '.\n';
            }
            if (value > maxValue) {
                error += strings.maxValue + maxValue + '.\n';
            }

            if (error) {
                handleErrorEdit(editKey, error);
            } else {
                handleChangeEdit(editKey, value);
            }
        }
    }

    handleClickInput() {
        const {editKey} = this.props;
        this.props.handleClickInput(editKey);
    }

    handleChangeIntegerInput() {
        const {editKey} = this.props;
        const value = this.refs[editKey] ? parseInt(this.refs[editKey].getValue()) : 0;
        this.setState({
            value: value,
        });
    }

    handleClickRemoveEdit() {
        const {editKey, handleClickRemoveEdit} = this.props;
        handleClickRemoveEdit(editKey);
        this.setState({
            value: null,
        });
    }

    render() {
        const {editKey, selected, metadata, handleClickRemoveEdit, strings} = this.props;
        return (
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'integer'} plusIcon={true} handleClickRemoveEdit={handleClickRemoveEdit ? this.handleClickRemoveEdit : null} onClickHandler={selected ? null : this.handleClickInput}>
                <div className="list-block">
                    <div className="integer-title">{metadata.label}</div>
                    <ul>
                        <TextInput ref={editKey} placeholder={strings.placeholder} onChange={this.handleChangeIntegerInput} defaultValue={this.state.value} doNotFocus={!selected}/>
                    </ul>
                </div>
            </SelectedEdit>
        );
    }
}

IntegerEdit.defaultProps = {
    strings: {
        minValue   : 'The minimum value is ',
        maxValue   : 'The maximum value is ',
        value      : 'This value must be an integer',
        placeholder: 'Type a number'
    }
};