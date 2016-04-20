import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import TagInput from '../../ui/TagInput';
import TextRadios from '../../ui/TextRadios';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class TagsAndChoiceSelectedFilter extends Component {
    static propTypes = {
        handleClickRemoveFilter: PropTypes.func.isRequired,
        label: PropTypes.string,
        values: PropTypes.array.isRequired,
        tagSuggestions: PropTypes.array.isRequired,
        tag: PropTypes.string,
        handleKeyUpTagAndChoiceTag: PropTypes.func.isRequired,
        handleClickTagAndChoiceTagSuggestion: PropTypes.func.isRequired,
        choices: PropTypes.object.isRequired,
        handleClickTagAndChoiceChoice: PropTypes.func.isRequired,
        choice: PropTypes.string,
        choiceLabel: PropTypes.object.isRequired,
        handleClickRemoveTagsAndChoice: PropTypes.func.isRequired,
        handleClickAddTagsAndChoice: PropTypes.func.isRequired,
        handleClickTagAndChoiceTag: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);
        
        this.handleClickAddTagsAndChoice = this.handleClickAddTagsAndChoice.bind(this);
        this.handleClickRemoveTagsAndChoice = this.handleClickRemoveTagsAndChoice.bind(this);
        this.handleClickTagAndChoiceTag = this.handleClickTagAndChoiceTag.bind(this);
        this.handleClickTagAndChoiceTagSuggestion = this.handleClickTagAndChoiceTagSuggestion.bind(this);
        this.handleClickTagAndChoiceChoice = this.handleClickTagAndChoiceChoice.bind(this);
    }
    
    getSelectedFilter() {
        return this.refs.selectedFilter.getSelectedFilter();
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickTagAndChoiceTagSuggestion(tagString) {
        this.refs.tagInput.setValue(tagString);
        this.props.handleClickTagAndChoiceTagSuggestion(tagString);
    }
    
    handleClickAddTagsAndChoice() {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.props.handleClickAddTagsAndChoice();
    }

    handleClickTagAndChoiceChoice(choice) {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.props.handleClickTagAndChoiceChoice(choice);
    }

    handleClickRemoveTagsAndChoice() {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.props.handleClickRemoveTagsAndChoice();
    }
    
    handleClickTagAndChoiceTag(tag) {
        this.refs.tagInput.setValue(tag);
        this.refs.tagInput.focus();
        this.props.handleClickTagAndChoiceTag(tag);
    }

    render() {
        const {handleClickRemoveFilter, label, values, tagSuggestions, tag, handleKeyUpTagAndChoiceTag, 
            choices, choice, choiceLabel} = this.props;
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'tags-and-choice'} active={values.some(value => value.tag !== '')} handleClickRemoveFilter={handleClickRemoveFilter}>
                <div className="tags-and-choice-wrapper">
                    <TagInput ref={'tagInput'} placeholder={'Escribe un tag'} tags={tagSuggestions} value={tag}
                              onKeyUpHandler={handleKeyUpTagAndChoiceTag} onClickTagHandler={this.handleClickTagAndChoiceTagSuggestion}
                              title={label} />
                    {tag ?
                        <div className="tags-and-choice-choice">
                            <TextRadios labels={Object.keys(choices).map(key => { return({key: key, text: choices[key]}); }) }
                                        onClickHandler={this.handleClickTagAndChoiceChoice} value={choice} className={'tags-and-choice-choice-radios'}
                                        title={choiceLabel['es']} />
                        </div>
                        : ''}
                    {tag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTagsAndChoice}>Eliminar <span className="icon-delete"></span></div> : ''}
                    {values.length > 0 ?
                        <div className="tags-and-choice-unselected-filters">
                            {values.filter(value => value.tag !== tag).map((value, index) =>
                                <div className="tags-and-choice-unselected-filter" key={index}>
                                    <TextCheckboxes labels={[{key: value.tag, text: value.choice ? value.tag + ' ' + choices[value.choice] : value.tag}]} values={[value.tag]}
                                                    onClickHandler={this.handleClickTagAndChoiceTag} className={'tags-and-choice-filter'}/>
                                </div>
                            )}
                        </div> : ''
                    }
                    {tag ? <div className="add-tags-and-choice" onClick={this.handleClickAddTagsAndChoice}>Añadir <span className="icon-plus"></span></div> : ''}
                </div>
            </ThreadSelectedFilter>
        );
    }
}