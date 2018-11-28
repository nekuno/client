/** TODO : Not used yet but useful for editing profile **/
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TagInput from '../../ui/TagInput';
import TextRadios from '../../ui/TextRadios';
import TextCheckboxes from '../../ui/TextCheckboxes';
import translate from '../../../i18n/Translate';

@translate('TagsAndChoiceFilter')
export default class TagsAndChoiceFilter extends Component {

    static propTypes = {
        filterKey              : PropTypes.string.isRequired,
        selected               : PropTypes.bool.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.array.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter     : PropTypes.func.isRequired,
        handleClickFilter      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object
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
            selectedTagAndChoice: {},
            tagSuggestions      : []
        };
    }

    handleClickTagAndChoiceTagSuggestion(tagString) {
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
        this.setState({
            selectedTagAndChoice: selectedTagAndChoice,
            tagSuggestions      : []
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

    handleClickTagAndChoiceChoice(choice) {
        let {filterKey, data} = this.props;
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
        if (tag.length > 2) {
            // TODO: Call get tags action and save in store
            // TODO: Replace this example setting the tagSuggestions in getState method as props
            console.log(tag);
            this.setState({
                tagSuggestions: [tag, tag + '2', tag + '3']
            });
        } else {
            this.setState({
                tagSuggestions: []
            });
        }
    }

    render() {
        let {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter, strings} = this.props;
        const {tagSuggestions, selectedTagAndChoice} = this.state;
        data = data || [];
        return (
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'tags-and-choice'} active={data && data.some(value => value.tag !== '')} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="tags-and-choice-wrapper">
                        <TagInput ref={'tagInput'} placeholder={strings.placeholder} tags={tagSuggestions} value={selectedTagAndChoice.tag}
                                  onKeyUpHandler={this.handleKeyUpTagAndChoiceTag} onClickTagHandler={this.handleClickTagAndChoiceTagSuggestion}
                                  title={filter.label}/>
                        {selectedTagAndChoice.tag ?
                            <div className="tags-and-choice-choice">
                                <TextRadios labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}); }) }
                                            onClickHandler={this.handleClickTagAndChoiceChoice} value={selectedTagAndChoice.choice} className={'tags-and-choice-choice-radios'}
                                            title={filter.choiceLabel['es']}/>
                            </div>
                            : ''}
                        {/*{selectedTagAndChoice.tag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTagsAndChoice}>{strings.remove} <span className="icon-delete"></span></div> : ''}*/}
                        {data.length > 0 ?
                            <div className="tags-and-choice-unselected-filters">
                                {data.filter(value => value.tag !== selectedTagAndChoice.tag).map((value, index) =>
                                    <div className="tags-and-choice-unselected-filter" key={index}>
                                        <TextCheckboxes labels={[{key: value.tag, text: value.choice ? value.tag + ' ' + filter.choices[value.choice] : value.tag}]} values={[value.tag]}
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

TagsAndChoiceFilter.defaultProps = {
    strings: {
        placeholder: 'Type a tag',
        remove     : 'Remove',
        add        : 'Add'
    }
};