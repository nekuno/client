import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextInput from '../../ui/TextInput';

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
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);

        this.state = {
            value: props.data
        };
    }

    componentWillMount() {
        this.handleClickInput();
    }

    componentWillUpdate(nextProps, nextState) {
        const {editKey, selected, handleChangeEdit} = this.props;
        const {value} = nextState;
        if (selected && !nextProps.selected) {
            handleChangeEdit(editKey, value);
        }
    }

    handleClickInput() {
        const {editKey} = this.props;
        this.props.handleClickInput(editKey);
    }

    onChangeValue() {
        if (this.refs.hasOwnProperty(this.props.editKey)){
            const value = this.refs[this.props.editKey].getValue();
            this.setState({
                value: value
            });
        }
    }

    handleClickRemoveEdit() {
        const {editKey, handleClickRemoveEdit} = this.props;
        handleClickRemoveEdit(editKey);
        this.setState({
            value: ''
        });
    }

    render() {
        const {editKey, selected, metadata, handleClickRemoveEdit} = this.props;
        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveEdit={handleClickRemoveEdit ? this.handleClickRemoveEdit : null} onClickHandler={selected ? null : this.handleClickInput}>
                <div className="location-filter-wrapper">
                    <div className="list-block">
                        <ul>
                            <TextInput placeholder={metadata.label} ref={editKey} label={metadata.label} defaultValue={this.state.value} onChange={this.onChangeValue}/>
                        </ul>
                    </div>
                </div>
            </SelectedEdit>
        );
    }
}