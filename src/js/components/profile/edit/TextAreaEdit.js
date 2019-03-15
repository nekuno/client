import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextArea from '../../ui/TextArea';
import Textarea from "../../ui/Textarea/Textarea";

export default class TextAreaEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.string,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.onChangeValue = this.onChangeValue.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
        this.clearValue = this.clearValue.bind(this);
        this.setValue = this.setValue.bind(this);

        this.state = {
            value: props.data
        };
    }

    onChangeValue() {
        const {editKey} = this.props;
        const value = this.refs[editKey].getValue();
        if (typeof this.textareaTimeout !== 'undefined') {
            clearTimeout(this.textareaTimeout);
        }
        this.textareaTimeout = setTimeout(() => {
            this.setState({
                value: value
            });
            this.props.handleChangeEdit(editKey, value);
        }, 500);
    }

    handleClickRemoveEdit() {
        if (this.props.handleClickRemoveEdit) {
            const {editKey} = this.props;
            this.clearValue();
            this.setState({
                value: ''
            });
            this.props.handleClickRemoveEdit(editKey);
        }
    }

    clearValue() {
        const {editKey} = this.props;
        this.refs[editKey].clearValue();
    }

    setValue(value) {
        const {editKey} = this.props;
        this.refs[editKey].setValue(value);
    }

    render() {
        const {editKey, metadata} = this.props;
        return (
            <div className="textarea-filter-wrapper">
                <Textarea ref={editKey} title={''} placeholder={metadata.labelEdit} defaultValue={this.state.value} onChange={this.onChangeValue}/>
            </div>
        );
    }
}