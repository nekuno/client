import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TagInput from '../../ui/TagInput';
import * as TagSuggestionsActionCreators from '../../../actions/TagSuggestionsActionCreators';

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

export default class TagFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.array,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired,
        tags: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);

        this.state = {
            tagSuggestions: []
        };
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleKeyUpTag(tag) {
        let {filterKey} = this.props;
        filterKey = filterKey === 'tags' ? null : filterKey;
        if (tag.length > 2) {
            requestTagSuggestions(tag, filterKey);
        } else {
            resetTagSuggestions();
        }
    }

    handleClickTagSuggestion(tagString) {
        let {filterKey, data} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value.tag === tagString);
        if (!valueIndex > -1) {
            data.push(tagString);
        }
        resetTagSuggestions();
        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        const {filterKey, selected, filter, data, tags, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'tag'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TagInput placeholder={'Escribe un tag'} tags={tags.map(tag => tag.name)}
                              onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}
                              title={filter.label} />
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}