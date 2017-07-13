import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string.isRequired,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    handleClickChoice(editKeyChoice) {
        let {editKey, data} = this.props;
        const choice = editKeyChoice.replace(editKey, '');
        if (choice !== data) {
            this.props.handleChangeEdit(editKey, choice);
        }
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, data} = this.props;
        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'radio'} active={data ? true : false} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                <TextRadios labels={Object.keys(metadata.choices).map(key => { return({key: editKey + key, text: metadata.choices[key]}); }) }
                            onClickHandler={this.handleClickChoice} value={editKey + data} className={'choice-filter'}
                            title={metadata.labelEdit} />
            </SelectedEdit>
        );
    }
}