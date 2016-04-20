import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from '../ThreadSelectedFilter';
import TagInput from '../../ui/TagInput';

export default class TagSelectedFilter extends Component {
    static propTypes = {
        handleClickRemoveFilter: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        tagSuggestions: PropTypes.array.isRequired,
        handleKeyUpTag: PropTypes.func.isRequired,
        handleClickTagSuggestion: PropTypes.func.isRequired
    };
    
    getSelectedFilter() {
        return this.refs.selectedFilter.getSelectedFilter();
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.selectedFilterContains(target);
    }

    render() {
        const {handleClickRemoveFilter, label, tagSuggestions, handleKeyUpTag, handleClickTagSuggestion} = this.props;
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'tag'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                <TagInput placeholder={'Escribe un tag'} tags={tagSuggestions}
                          onKeyUpHandler={handleKeyUpTag} onClickTagHandler={handleClickTagSuggestion}
                          title={label} />
            </ThreadSelectedFilter>
        );
    }
}