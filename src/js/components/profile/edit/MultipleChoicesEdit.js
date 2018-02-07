import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextCheckboxes from '../../ui/TextCheckboxes';
import translate from '../../../i18n/Translate';
import Framework7Service from '../../../services/Framework7Service';

@translate('MultipleChoicesEdit')
export default class MultipleChoicesEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.array,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
    }
    
    handleClickMultipleChoice(choice) {
        let {editKey, metadata, data, strings} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value == choice);
        if (valueIndex > -1) {
            if (metadata.min && data.length <= metadata.min) {
                Framework7Service.nekunoApp().alert(strings.minChoices.replace('%min%', metadata.min));
                return;
            }
            data.splice(valueIndex, 1);
        } else {
            if (metadata.max && data.length >= metadata.max) {
                Framework7Service.nekunoApp().alert(strings.maxChoices.replace('%max%', metadata.max));
                return;
            }
            data.push(choice);
        }
        this.props.handleChangeEdit(editKey, data);
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, data} = this.props;
        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'checkbox'} active={data && data.length > 0} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                <TextCheckboxes labels={Object.keys(metadata.choices).map(key => { return({key: key, text: metadata.choices[key]}) })}
                                onClickHandler={this.handleClickMultipleChoice} values={data || []} className={'multiple-choice-filter'}
                                title={metadata.labelEdit} />
            </SelectedEdit>
        );
    }
}

MultipleChoicesEdit.defaultProps = {
    strings: {
        minChoices: 'Select at least %min% items',
        maxChoices: 'Select up to %max% items'
    }
};