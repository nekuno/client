import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TagInput from '../../ui/TagInput';
import TextRadios from '../../ui/TextRadios';
import TextCheckboxes from '../../ui/TextCheckboxes';
import * as TagSuggestionsActionCreators from '../../../actions/TagSuggestionsActionCreators';
import translate from '../../../i18n/Translate';
import ChoiceEdit from "./ChoiceEdit/ChoiceEdit";
import InputTag from "../../RegisterFields/InputTag/InputTag";
import TagEdit from "./TagEdit";

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
        profile              : PropTypes.object,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickInput = this.handleClickInput.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleClickRemove = this.handleClickRemove.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
        this.requestTagSuggestions = this.requestTagSuggestions.bind(this);
        this.buildChoices = this.buildChoices.bind(this);

        this.state = {
            selectedTagAndChoice: {}
        };
    }

    handleClickInput() {
        const {editKey} = this.props;
        resetTagSuggestions();
        this.props.handleClickInput(editKey);
    }

    handleClickTagSuggestion(tagString) {
        let {editKey, data} = this.props;
        data = data.slice(0);
        this.refs['tagInput' + editKey].setValue(tagString);
        data = data || [];
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valueIndex = data.findIndex(value => value.tag.name === tagString);
        if (valueIndex > -1) {
            selectedTagAndChoice = data[valueIndex];
            selectedTagAndChoice.index = valueIndex;
        } else {
            selectedTagAndChoice = {tag: {name: tagString}, choice: '', index: data.length};
            data.push(selectedTagAndChoice);
        }
        this.setState({
            selectedTagAndChoice: selectedTagAndChoice
        });
        this.props.handleChangeEdit(editKey, data);
        resetTagSuggestions();
    }

    handleClickAdd() {
        const {editKey} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        this.setState({
            selectedTagAndChoice: {}
        });
    }

    handleClickChoice(choice) {
        let {editKey, data} = this.props;
        data = data.slice(0);
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valuesIndex = data.findIndex(value => value.tag.name === selectedTagAndChoice.tag.name);
        if (valuesIndex > -1) {
            data[valuesIndex].choice = choice;
        }
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleChangeEdit(editKey, data);
        resetTagSuggestions();
    }

    handleClickRemove() {
        let {editKey, data} = this.props;
        data = data.slice(0);
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

    handleClickTag(tag) {
        tag = {name: tag};
        const {editKey} = this.props;
        this.refs['tagInput' + editKey].setValue(tag);
        this.refs['tagInput' + editKey].focus();
        let {data} = this.props;
        const index = data.findIndex(value => value.tag.name === tag.name);
        if (index > -1) {
            let selectedTagAndChoice = data[index];
            selectedTagAndChoice.index = index;
            this.setState({
                selectedTagAndChoice: selectedTagAndChoice
            });
        }
        resetTagSuggestions();
    }

    handleKeyUpTag(tag) {
        let {editKey} = this.props;
        if (tag.length > 2) {
            this.requestTagSuggestions(tag, editKey);
        } else {
            resetTagSuggestions();
        }
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    requestTagSuggestions(search, type = null) {
        if (this.props.metadata.schema) {
            const language = this.props.profile.interfaceLanguage;
            type = this.props.metadata.schema;
            TagSuggestionsActionCreators.requestGoogleTagSuggestions(search, type, language);
        } else if (type === null) {
            TagSuggestionsActionCreators.requestContentTagSuggestions(search);
        } else {
            TagSuggestionsActionCreators.requestProfileTagSuggestions(search, type);
        }
    }

    buildChoices() {
        const {metadata} = this.props;
        return Object.keys(metadata.choices).map((choiceId) => {
            const choiceText = metadata.choices[choiceId];
            return {
                text   : choiceText,
                id     : choiceId,
                picture: '',
            }
        });
    }

    render() {
        const {editKey, metadata, strings, profile} = this.props;
        const choices = this.buildChoices();
        let tags = this.props.tags.slice(0).map(tag => tag.name);
        const {selectedTagAndChoice} = this.state;
        if (this.refs.hasOwnProperty('tagInput' + editKey) && !tags.some(tag => tag === this.refs['tagInput' + editKey].getValue())) {
            tags.push(this.refs['tagInput' + editKey].getValue());
        }
        return (
            <div className="tags-and-choice-wrapper">
                <TagEdit editKey={'tag' + editKey} metadata={metadata} handleChangeEdit={this.handleClickTag} tags={tags} profile={profile}/>
                {selectedTagAndChoice.tag ?
                    <ChoiceEdit editKey={'choice' + editKey} choices={choices} handleChangeEdit={this.handleClickChoice}/>
                    : ''}
                {selectedTagAndChoice.tag ? <div className="add-tags-and-choice" onClick={this.handleClickAdd}>{strings.add} <span className="icon-plus"></span></div> : ''}
            </div>
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