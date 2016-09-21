import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TagInput from '../../ui/TagInput';
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
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickInput = this.handleClickInput.bind(this);
        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);

        this.state = {
            value: props.data ? props.data : '',
            tag: null
        }
    }

    handleClickInput() {
        const {editKey} = this.props;
        this.props.handleClickInput(editKey);
    }

    handleChangeIntegerInput() {
        const {editKey, metadata} = this.props;
        const minValue = metadata.min;
        const maxValue = metadata.max;
        let tag = null;
        let value = null;
        if (this.refs['tagInput' + editKey]) {
            value = parseInt(this.refs['tagInput' + editKey].getValue()) || 0;
            if (value > minValue && value < maxValue) {
                tag = parseInt(this.refs['tagInput' + editKey].getValue());
            }
        }
        this.setState({
            value: value,
            tag: tag
        });
    }

    handleClickTagSuggestion(integer) {
        const {editKey} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        this.props.handleChangeEdit(editKey, parseInt(integer));
        this.setState({
            tag: null,
            value: integer
        });
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
        this.setState({
            tag: null,
            value: null,
        });
    }

    render() {
        const {editKey, selected, metadata, strings} = this.props;
        return (
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'integer'} plusIcon={true} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null} onClickHandler={selected ? null : this.handleClickInput}>
                <TagInput ref={'tagInput' + editKey} placeholder={strings.placeholder} tags={selected ? this.state.tag ? [this.state.tag.toString()] : [] : []}
                          onKeyUpHandler={this.handleChangeIntegerInput} onClickTagHandler={this.handleClickTagSuggestion}
                          title={metadata.label} doNotFocus={!selected} value={this.state.value ? this.state.value.toString() : ''}/>
                <div className="table-row"></div>
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