import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TagInput from '../../ui/TagInput';
import TextCheckboxes from '../../ui/TextCheckboxes';
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
        selected               : PropTypes.bool.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.array,
        handleClickRemoveFilter: PropTypes.func.isRequired,
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

    handleClickTagSuggestion(tagString) {
        let {filterKey, data} = this.props;
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
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickAddTagsAndChoice() {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.setState({
            selectedTagAndChoice: {}
        });
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        this.refs.tagInput.focus();
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
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        const index = this.state.selectedTagAndChoice.index;
        data.splice(index, 1);
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickTagAndChoiceTag(tag) {
        let {data} = this.props;
        this.refs.tagInput.setValue(tag);
        this.refs.tagInput.focus();
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
        let {filterKey, selected, filter, data, tags, handleClickRemoveFilter, handleClickFilter, strings} = this.props;
        const {selectedTagAndChoice} = this.state;
        data = data || [];
        return (
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'tags-and-choice'} active={data && data.some(value => value.tag !== '')} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="tags-and-choice-wrapper">
                        <TagInput ref={'tagInput'} placeholder={strings.placeholder} tags={tags.map(tag => tag.name)} value={selectedTagAndChoice.tag}
                                  onKeyUpHandler={this.handleKeyUpTagAndChoiceTag} onClickTagHandler={this.handleClickTagSuggestion}
                                  title={filter.label}/>
                        {selectedTagAndChoice.tag ?
                            <div className="tags-and-choice-choice">
                                <div className="table-row"></div>
                                <TextCheckboxes labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]['es']}); })}
                                                onClickHandler={this.handleClickChoice} values={selectedTagAndChoice.choices || []} className={'tags-and-choice-choice-radios'}
                                                title={filter.choiceLabel['es']}/>
                            </div>
                            : ''}
                        {selectedTagAndChoice.tag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTagsAndChoice}>{strings.remove} <span className="icon-delete"></span></div> : ''}
                        {data.length > 0 ?
                            <div className="tags-and-choice-unselected-filters">
                                {data.filter(value => value.tag !== selectedTagAndChoice.tag).map((value, index) =>
                                    <div className="tags-and-choice-unselected-filter" key={index}>
                                        <TextCheckboxes labels={[{key: value.tag, text: value.choices && value.choices.length > 0 ? value.tag + ' ' + value.choices.map(choice => filter.choices[choice]['es']).join(', ') : value.tag}]}
                                                        values={[value.tag]}
                                                        onClickHandler={this.handleClickTagAndChoiceTag} className={'tags-and-choice-filter'}/>
                                    </div>
                                )}
                            </div> : ''
                        }
                        {selectedTagAndChoice.tag ? <div className="add-tags-and-choice" onClick={this.handleClickAddTagsAndChoice}>{strings.add} <span className="icon-plus"></span></div> : ''}
                    </div>
                </ThreadSelectedFilter>
                :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter}/>
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