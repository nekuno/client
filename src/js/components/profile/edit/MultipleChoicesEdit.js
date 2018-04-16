import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextCheckboxes from '../../ui/TextCheckboxes';
import { Range } from 'rc-slider';
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
        this.handleChangeRange = this.handleChangeRange.bind(this);
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

    handleChangeRange(choices) {
        let {editKey, metadata, strings} = this.props;

        let fixedChoices = [];
        for (let i = choices[0]; i <= choices[1]; i++) {
            fixedChoices.push(metadata.choices[i].id);
        }
        if (metadata.max && fixedChoices.length > metadata.max) {
            Framework7Service.nekunoApp().alert(strings.maxChoices.replace('%max%', metadata.max));
            return;
        }

        this.props.handleChangeEdit(editKey, fixedChoices);
    }


    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, data} = this.props;
        const minRangeData = data.length > 0 ? Math.min(...data.map(choice => metadata.choices.findIndex(metadataChoice => metadataChoice.id === choice))) : 0;
        const maxRangeData = data.length > 0 ? Math.max(...data.map(choice => metadata.choices.findIndex(metadataChoice => metadataChoice.id === choice))) : 0;

        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'checkbox'} active={data && data.length > 0} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                {metadata.isRange ?
                    <div className="range-filter">
                        <div className="checkbox-title">{metadata.labelEdit}</div>
                        <Range
                            marks={Object.assign({}, metadata.choices.map(value => value.text))}
                            defaultValue={[minRangeData, maxRangeData]}
                            max={metadata.choices.length - 1}
                            onAfterChange={this.handleChangeRange}
                        />
                    </div>
                    :
                    <TextCheckboxes labels={metadata.choices.map(choice => { return({key: choice.id, text: choice.text}) })}
                                onClickHandler={this.handleClickMultipleChoice} values={data || []} className={'multiple-choice-filter'}
                                title={metadata.labelEdit} />
                }
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