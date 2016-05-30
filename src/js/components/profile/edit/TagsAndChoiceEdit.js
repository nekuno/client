import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
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
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit     : PropTypes.func.isRequired,
        handleClickEdit      : PropTypes.func.isRequired,
        tags                 : PropTypes.array,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleKeyUpTagAndChoiceTag = this.handleKeyUpTagAndChoiceTag.bind(this);
        this.handleClickAddTagsAndChoice = this.handleClickAddTagsAndChoice.bind(this);
        this.handleClickRemoveTagsAndChoice = this.handleClickRemoveTagsAndChoice.bind(this);
        this.handleClickTagAndChoiceTag = this.handleClickTagAndChoiceTag.bind(this);
        this.handleClickTagAndChoiceTagSuggestion = this.handleClickTagAndChoiceTagSuggestion.bind(this);
        this.handleClickTagAndChoiceChoice = this.handleClickTagAndChoiceChoice.bind(this);

        this.state = {
            selectedTagAndChoice: {}
        };
    }

    handleClickTagAndChoiceTagSuggestion(tagString) {
        let {editKey, data} = this.props;
        this.refs.tagInput.setValue(tagString);
        data = data || [];
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valueIndex = data.findIndex(value => value.tag === tagString);
        if (valueIndex > -1) {
            selectedTagAndChoice = data[valueIndex];
            selectedTagAndChoice.index = valueIndex;
        } else {
            selectedTagAndChoice = {tag: tagString, index: data.length};
            data.push(selectedTagAndChoice);
        }
        resetTagSuggestions();
        this.setState({
            selectedTagAndChoice: selectedTagAndChoice
        });
        this.props.handleChangeEdit(editKey, data);
    }

    handleClickAddTagsAndChoice() {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.setState({
            selectedTagAndChoice: {}
        });
    }

    handleClickTagAndChoiceChoice(choice) {
        let {editKey, data} = this.props;
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valuesIndex = data.findIndex(value => value.tag === selectedTagAndChoice.tag);
        if (valuesIndex > -1) {
            data[valuesIndex].choice = choice;
        }
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleChangeEdit(editKey, data);
    }

    handleClickRemoveTagsAndChoice() {
        let {editKey, data} = this.props;
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        const index = this.state.selectedTagAndChoice.index;
        data.splice(index, 1);
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleChangeEdit(editKey, data);
    }

    handleClickTagAndChoiceTag(tag) {
        this.refs.tagInput.setValue(tag);
        this.refs.tagInput.focus();
        let {data} = this.props;
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
        let {editKey} = this.props;
        if (tag.length > 2) {
            requestTagSuggestions(tag, editKey);
        } else {
            resetTagSuggestions();
        }
    }

    render() {
        let {editKey, selected, metadata, data, tags, handleClickRemoveEdit, handleClickEdit, strings} = this.props;
        const {selectedTagAndChoice} = this.state;
        data = data || [];
        if (this.refs.hasOwnProperty('tagInput') && !tags.some(tag => tag.name === this.refs.tagInput.getValue())) {
            tags.push({name: this.refs.tagInput.getValue()});
        }
        return (
            selected ?
                <SelectedEdit key={'selected-filter'} type={'tags-and-choice'} active={data && data.some(value => value.tag !== '')} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <div className="tags-and-choice-wrapper">
                        <TagInput ref={'tagInput'} placeholder={strings.placeholder} tags={tags.map(tag => tag.name)} value={selectedTagAndChoice.tag}
                                  onKeyUpHandler={this.handleKeyUpTagAndChoiceTag} onClickTagHandler={this.handleClickTagAndChoiceTagSuggestion}
                                  title={metadata.label}/>
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
                :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit}/>
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