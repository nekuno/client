import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextArea from '../../ui/TextArea';

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

    handleClickInput() {
        const {editKey} = this.props;
        this.props.handleClickInput(editKey);
    }

    onChangeValue() {
        const {editKey} = this.props;
        const value = this.refs[editKey].getValue();
        if (typeof this.textareaTimeout !== 'undefined') {
            clearTimeout(this.textareaTimeout);
        }
        this.textareaTimeout = setTimeout(() => {
            this.props.handleChangeEdit(editKey, value)

        }, 500);
        this.setState({
            value: value
        });
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
        this.setState({
            value: ''
        });
    }

    render() {
        const {editKey, selected, metadata} = this.props;
        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'textarea'} plusIcon={true} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null} onClickHandler={selected ? null : this.handleClickInput}>
                <div className="textarea-filter-wrapper">
                    <div className="list-block">
                        <ul>
                            <TextArea ref={editKey} placeholder={metadata.label} defaultValue={this.state.value} onChange={this.onChangeValue}/>
                        </ul>
                    </div>
                </div>
            </SelectedEdit>
        );
    }
}