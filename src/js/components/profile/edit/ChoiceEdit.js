import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string.isRequired,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }

    handleClickChoice(choice) {
        let {editKey, data} = this.props;
        if (choice !== data) {
            this.props.handleChangeEdit(editKey, choice);
        }
    }

    handleClickRemoveEdit() {
        const {editKey, handleClickRemoveEdit} = this.props;
        handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, data} = this.props;
        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'radio'} active={data ? true : false} handleClickRemoveEdit={this.handleClickRemoveEdit}>
                <TextRadios labels={Object.keys(metadata.choices).map(key => { return({key: key, text: metadata.choices[key]}); }) }
                            onClickHandler={this.handleClickChoice} value={data} className={'choice-filter'}
                            title={metadata.label} />
            </SelectedEdit>
        );
    }
}