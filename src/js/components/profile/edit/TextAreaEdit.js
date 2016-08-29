import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TagInput from '../../ui/TagInput';

export default class TextAreaEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleClickInput = this.handleClickInput.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);

        this.state = {
            tag: null,
            value: props.data
        };
    }

    componentWillMount() {
        this.handleClickInput();
    }

    componentWillUpdate(nextProps, nextState) {
        const {editKey, selected} = this.props;
        const {value} = nextState;
        if (selected && !nextProps.selected) {
            this.props.handleChangeEdit(editKey, value);
        }
    }

    handleClickInput() {
        const {editKey} = this.props;
        this.props.handleClickInput(editKey);
    }

    onChangeValue() {
        const {editKey} = this.props;
        let value = '';
        let tag = null;
        if (this.refs['tagInput' + editKey]) {
            value = this.refs['tagInput' + editKey].getValue();
            if (value) {
                tag = value;
            }
        }
        this.setState({
            tag: tag,
            value: value
        });
    }

    handleClickTagSuggestion(string) {
        const {editKey} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        this.props.handleChangeEdit(editKey, string);
        this.setState({
            tag: null,
            value: string
        });
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
        this.setState({
            tag: null,
            value: ''
        });
    }

    render() {
        const {editKey, selected, metadata} = this.props;
        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null} onClickHandler={selected ? null : this.handleClickInput}>
                <TagInput ref={'tagInput' + editKey} placeholder={metadata.label} tags={selected && this.state.value ? [this.state.value] : []}
                          onKeyUpHandler={this.onChangeValue} onClickTagHandler={this.handleClickTagSuggestion}
                          title={metadata.label} doNotFocus={!selected} value={this.state.value}/>
                <div className="table-row"></div>
            </SelectedEdit>
        );
    }
}