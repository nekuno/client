import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputTag from '../../RegisterFields/InputTag/InputTag.js';
import SelectMultiple from '../../ui/SelectMultiple/SelectMultiple.js';
import * as TagSuggestionsActionCreators from '../../../actions/TagSuggestionsActionCreators';
import translate from '../../../i18n/Translate';

function requestTagSuggestions(search, type) {
    TagSuggestionsActionCreators.requestProfileTagSuggestions(search, type);
}

function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

@translate('TagsAndMultipleChoicesFilter')
export default class TagsAndMultipleChoicesFilter extends Component {

    static propTypes = {
        filterKey              : PropTypes.string.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.array,
        handleChangeFilter     : PropTypes.func.isRequired,
        handleClickFilter      : PropTypes.func.isRequired,
        tags                   : PropTypes.array.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleKeyUpTagAndChoiceTag = this.handleKeyUpTagAndChoiceTag.bind(this);
        this.handleClickAddTagsAndChoice = this.handleClickAddTagsAndChoice.bind(this);
        this.handleClickRemoveTagsAndChoice = this.handleClickRemoveTagsAndChoice.bind(this);
        this.handleClickTagAndChoiceTag = this.handleClickTagAndChoiceTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);

        this.state = {
            selectedTagAndChoice: {}
        };
    }

    handleClickTagSuggestion(tagsArray) {
        let {filterKey, data} = this.props;
        let tagString = tagsArray[tagsArray.length - 1];
        this.refs.inputTag.setValue(tagString);
        data = data || [];
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valueIndex = data.findIndex(value => value.tag === tagString);
        if (valueIndex > -1) {
            selectedTagAndChoice = data[valueIndex];
            selectedTagAndChoice.index = valueIndex;
        } else {
            selectedTagAndChoice = {tag: {name: tagString}, index: data.length};
            data.push(selectedTagAndChoice);
        }
        resetTagSuggestions();
        this.setState({
            selectedTagAndChoice: selectedTagAndChoice
        });
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickAddTagsAndChoice() {
        this.refs.inputTag.clearValue();
        this.refs.inputTag.focus();
        this.setState({
            selectedTagAndChoice: {}
        });
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        console.log(choice)
        this.refs.inputTag.focus();
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valuesIndex = data.findIndex(value => value.tag === selectedTagAndChoice.tag);
        if (valuesIndex > -1) {
            const choices = data[valuesIndex].choices || [];
            const choiceIndex = choices.findIndex(savedChoice => savedChoice === choice);
            if (choiceIndex > -1) {
                data[valuesIndex].choices.splice(choiceIndex, 1);
            } else {
                data[valuesIndex].choices = data[valuesIndex].choices || [];
                data[valuesIndex].choices.push(choice);
            }
        }
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickRemoveTagsAndChoice() {
        let {filterKey, data} = this.props;
        this.refs.inputTag.clearValue();
        this.refs.inputTag.focus();
        const index = this.state.selectedTagAndChoice.index;
        data.splice(index, 1);
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickTagAndChoiceTag(tag) {
        let {data} = this.props;
        this.refs.inputTag.setValue(tag);
        this.refs.inputTag.focus();
        console.log(data)
        const index = data.findIndex(value => value.tag === tag);
        if (index > -1) {
            let selectedTagAndChoice = data[index];
            selectedTagAndChoice.index = index;
            this.setState({
                selectedTagAndChoice: selectedTagAndChoice
            });
        }
    }

    handleKeyUpTagAndChoiceTag(tag) {
        let {filterKey} = this.props;
        if (tag.length > 2) {
            requestTagSuggestions(tag, filterKey);
        } else {
            resetTagSuggestions();
        }
    }

    render() {
        let {filter, data, tags, strings} = this.props;
        const {selectedTagAndChoice} = this.state;
        data = data || [];
        return (
            <div className="tags-and-choice-wrapper">
                <InputTag ref={'inputTag'} placeholder={strings.placeholder} tags={tags.map(tag => tag.name)} value={selectedTagAndChoice.tag ? selectedTagAndChoice.tag.name :''}
                          onChangeHandler={this.handleKeyUpTagAndChoiceTag} onClickHandler={this.handleClickTagSuggestion}
                          title={filter.label}/>
                {selectedTagAndChoice.tag ?
                    <div className="tags-and-choice-choice">
                        <div className="table-row"></div>
                        <SelectMultiple title={filter.choiceLabel['es']} labels={Object.keys(filter.choices).map(key => { return({id: key, text: filter.choices[key]['es']})})} values={selectedTagAndChoice.choices || []} onClickHandler={this.handleClickChoice}/>
                    </div>
                    : ''}
                {/*{selectedTagAndChoice.tag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTagsAndChoice}>{strings.remove} <span className="icon-delete"></span></div> : ''}*/}
                {data.length > 0 ?
                    <div className="tags-and-choice-unselected-filters">
                        {data.filter(value => value.tag !== selectedTagAndChoice.tag).map((value, index) =>
                            <div className="tags-and-choice-unselected-filter" key={index}>
                                <SelectMultiple labels={[{id: value.tag.name, text: value.choices && value.choices.length > 0 ? value.tag.name + ' ' + value.choices.map(choice => filter.choices[choice]['es']).join(', ') : value.tag.name}]}
                                                values={[value.tag]}
                                                onClickHandler={this.handleClickTagAndChoiceTag}/>
                            </div>
                        )}
                    </div> : ''
                }
                {selectedTagAndChoice.tag ? <div className="add-tags-and-choice" onClick={this.handleClickAddTagsAndChoice}>{strings.add} <span className="icon-plus"/></div> : ''}
            </div>
        );
    }
}

TagsAndMultipleChoicesFilter.defaultProps = {
    strings: {
        placeholder: 'Type a tag',
        remove     : 'Remove',
        add        : 'Add'
    }
};