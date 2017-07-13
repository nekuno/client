import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TagInput from '../../ui/TagInput';
import TextRadios from '../../ui/TextRadios';
import TextCheckboxes from '../../ui/TextCheckboxes';
import * as TagSuggestionsActionCreators from '../../../actions/TagSuggestionsActionCreators';
import translate from '../../../i18n/Translate';

function requestTagSuggestions(search, type = null) {
    if (type === null) {
        TagSuggestionsActionCreators.requestContentTagSuggestions(search);
    } else {
        TagSuggestionsActionCreators.requestProfileTagSuggestions(search, type);
    }
}

function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

@translate('TagsAndChoiceEdit')
export default class TagsAndChoiceEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.array.isRequired,
        handleClickInput     : PropTypes.func.isRequired,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        tags                 : PropTypes.array,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickInput = this.handleClickInput.bind(this);
        this.handleKeyUpTagAndChoiceTag = this.handleKeyUpTagAndChoiceTag.bind(this);
        this.handleClickAddTagsAndChoice = this.handleClickAddTagsAndChoice.bind(this);
        this.handleClickRemoveTagsAndChoice = this.handleClickRemoveTagsAndChoice.bind(this);
        this.handleClickTagAndChoiceTag = this.handleClickTagAndChoiceTag.bind(this);
        this.handleClickTagAndChoiceTagSuggestion = this.handleClickTagAndChoiceTagSuggestion.bind(this);
        this.handleClickTagAndChoiceChoice = this.handleClickTagAndChoiceChoice.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);

        this.state = {
            selectedTagAndChoice: {}
        };
    }

    handleClickInput() {
        const {editKey} = this.props;
        resetTagSuggestions();
        this.props.handleClickInput(editKey);
    }

    handleClickTagAndChoiceTagSuggestion(tagString) {
        let {editKey, data} = this.props;
        this.refs['tagInput' + editKey].setValue(tagString);
        data = data || [];
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valueIndex = data.findIndex(value => value.tag === tagString);
        if (valueIndex > -1) {
            selectedTagAndChoice = data[valueIndex];
            selectedTagAndChoice.index = valueIndex;
        } else {
            selectedTagAndChoice = {tag: tagString, choice: '', index: data.length};
            data.push(selectedTagAndChoice);
        }
        this.setState({
            selectedTagAndChoice: selectedTagAndChoice
        });
        this.props.handleChangeEdit(editKey, data);
        resetTagSuggestions();
    }

    handleClickAddTagsAndChoice() {
        const {editKey} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        this.setState({
            selectedTagAndChoice: {}
        });
    }

    handleClickTagAndChoiceChoice(choice) {
        let {editKey, data} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valuesIndex = data.findIndex(value => value.tag === selectedTagAndChoice.tag);
        if (valuesIndex > -1) {
            data[valuesIndex].choice = choice;
        }
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleChangeEdit(editKey, data);
        resetTagSuggestions();
    }

    handleClickRemoveTagsAndChoice() {
        let {editKey, data} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        const index = this.state.selectedTagAndChoice.index;
        data.splice(index, 1);
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleChangeEdit(editKey, data);
       resetTagSuggestions();
    }

    handleClickTagAndChoiceTag(tag) {
        const {editKey} = this.props;
        this.refs['tagInput' + editKey].setValue(tag);
        this.refs['tagInput' + editKey].focus();
        let {data} = this.props;
        const index = data.findIndex(value => value.tag === tag);
        if (index > -1) {
            let selectedTagAndChoice = data[index];
            selectedTagAndChoice.index = index;
            this.setState({
                selectedTagAndChoice: selectedTagAndChoice
            });
        }
        resetTagSuggestions();
    }

    handleKeyUpTagAndChoiceTag(tag) {
        let {editKey} = this.props;
        if (tag.length > 2) {
            requestTagSuggestions(tag, editKey);
        } else {
            resetTagSuggestions();
        }
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    render() {
        const {editKey, selected, metadata, strings} = this.props;
        const data = this.props.data || [];
        let tags = this.props.tags.slice(0);
        const {selectedTagAndChoice} = this.state;
        if (this.refs.hasOwnProperty('tagInput' + editKey) && !tags.some(tag => tag.name === this.refs['tagInput' + editKey].getValue())) {
            tags.push({name: this.refs['tagInput' + editKey].getValue()});
        }
        return (
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'tags-and-choice'} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null} onClickHandler={selected ? null : this.handleClickInput}>
                <div className="tags-and-choice-wrapper">
                    <TagInput ref={'tagInput' + editKey} placeholder={strings.placeholder} tags={selected && tags.length > 0 && tags[0].name ? tags.map(tag => tag.name) : []} value={selectedTagAndChoice.tag}
                              onKeyUpHandler={this.handleKeyUpTagAndChoiceTag} onClickTagHandler={this.handleClickTagAndChoiceTagSuggestion}
                              title={metadata.labelEdit} doNotFocus={!selected}/>
                    {selectedTagAndChoice.tag ?
                        <div className="tags-and-choice-choice">
                            <TextRadios labels={Object.keys(metadata.choices).map(key => { return({key: key, text: metadata.choices[key]}); }) }
                                        onClickHandler={this.handleClickTagAndChoiceChoice} value={selectedTagAndChoice.choice} className={'tags-and-choice-choice-radios'}
                                        title={metadata.choiceLabel['es']}/>
                        </div>
                        : ''}
                    {selectedTagAndChoice.tag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTagsAndChoice}>{strings.remove} <span className="icon-delete"></span></div> : ''}
                    {data.length > 0 ?
                        <div className="tags-and-choice-unselected-filters">
                            {data.filter(value => value.tag !== selectedTagAndChoice.tag).map((value, index) =>
                                <div className="tags-and-choice-unselected-filter" key={index}>
                                    <TextCheckboxes labels={[{key: value.tag, text: value.choice ? value.tag + ' ' + metadata.choices[value.choice] : value.tag}]} values={[value.tag]}
                                                    onClickHandler={this.handleClickTagAndChoiceTag} className={'tags-and-choice-filter'}/>
                                </div>
                            )}
                        </div> : ''
                    }
                    {selectedTagAndChoice.tag ? <div className="add-tags-and-choice" onClick={this.handleClickAddTagsAndChoice}>{strings.add} <span className="icon-plus"></span></div> : ''}
                </div>
            </SelectedEdit>
        );
    }
}

TagsAndChoiceEdit.defaultProps = {
    strings: {
        placeholder: 'Type a tag',
        remove     : 'Remove',
        add        : 'Add'
    }
};