import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TagInput from '../../ui/TagInput';
import TextRadios from '../../ui/TextRadios';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class TagsAndChoiceFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleClickTagAndChoiceTagSuggestion: PropTypes.func.isRequired,
        handleClickTagAndChoiceChoice: PropTypes.func.isRequired,
        handleClickRemoveTagsAndChoice: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
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
            tagSuggestions: []
        };
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickTagAndChoiceTagSuggestion(tagString) {
        this.refs.tagInput.setValue(tagString);
        const filter = this.props.filter;
        const values = filter.values || [];
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        const valueIndex = values.findIndex(value => value.tag === tagString);
        if (valueIndex > -1) {
            selectedTagAndChoice = values[valueIndex];
            selectedTagAndChoice.index = valueIndex;
        } else {
            selectedTagAndChoice = {tag: tagString, index: values.length};
        }
        this.setState({
            selectedTagAndChoice: selectedTagAndChoice,
            tagSuggestions: []
        });
        
        this.props.handleClickTagAndChoiceTagSuggestion(tagString);
    }
    
    handleClickAddTagsAndChoice() {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.setState({
            selectedTagAndChoice: {}
        });
    }

    handleClickTagAndChoiceChoice(choice) {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleClickTagAndChoiceChoice(choice, selectedTagAndChoice.tag);
    }

    handleClickRemoveTagsAndChoice() {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        const index = this.state.selectedTagAndChoice.index;
        this.setState({
            selectedTagAndChoice: {}
        });
        this.props.handleClickRemoveTagsAndChoice(index);
    }
    
    handleClickTagAndChoiceTag(tag) {
        this.refs.tagInput.setValue(tag);
        this.refs.tagInput.focus();
        const filter = this.props.filter;
        const values = filter.values;
        const index = values.findIndex(value => value.tag === tag);
        if (index > -1) {
            let selectedTagAndChoice = values[index];
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
        const {selected, filter, handleClickRemoveFilter, handleClickFilter} = this.props;
        const {tagSuggestions, selectedTagAndChoice} = this.state;
        const values = filter.values || [];
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'tags-and-choice'} active={values && values.some(value => value.tag !== '')} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="tags-and-choice-wrapper">
                        <TagInput ref={'tagInput'} placeholder={'Escribe un tag'} tags={tagSuggestions} value={selectedTagAndChoice.tag}
                                  onKeyUpHandler={this.handleKeyUpTagAndChoiceTag} onClickTagHandler={this.handleClickTagAndChoiceTagSuggestion}
                                  title={filter.label} />
                        {selectedTagAndChoice.tag ?
                            <div className="tags-and-choice-choice">
                                <TextRadios labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}); }) }
                                            onClickHandler={this.handleClickTagAndChoiceChoice} value={selectedTagAndChoice.choice} className={'tags-and-choice-choice-radios'}
                                            title={filter.choiceLabel['es']} />
                            </div>
                            : ''}
                        {selectedTagAndChoice.tag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTagsAndChoice}>Eliminar <span className="icon-delete"></span></div> : ''}
                        {values.length > 0 ?
                            <div className="tags-and-choice-unselected-filters">
                                {values.filter(value => value.tag !== selectedTagAndChoice.tag).map((value, index) =>
                                    <div className="tags-and-choice-unselected-filter" key={index}>
                                        <TextCheckboxes labels={[{key: value.tag, text: value.choice ? value.tag + ' ' + filter.choices[value.choice] : value.tag}]} values={[value.tag]}
                                                        onClickHandler={this.handleClickTagAndChoiceTag} className={'tags-and-choice-filter'}/>
                                    </div>
                                )}
                            </div> : ''
                        }
                        {selectedTagAndChoice.tag ? <div className="add-tags-and-choice" onClick={this.handleClickAddTagsAndChoice}>Añadir <span className="icon-plus"></span></div> : ''}
                    </div>
                </ThreadSelectedFilter>
                    : 
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}