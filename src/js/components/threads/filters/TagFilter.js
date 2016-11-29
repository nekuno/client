import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TagInput from '../../ui/TagInput';
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

@translate('TagFilter')
export default class TagFilter extends Component {

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

        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
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
        const {filterKey, selected, filter, data, tags, handleClickRemoveFilter, handleClickFilter, strings} = this.props;
        return (
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'tag'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TagInput placeholder={strings.placeholder} tags={tags.map(tag => tag.name)}
                              onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}
                              title={filter.label}/>
                </ThreadSelectedFilter>
                :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter}/>
        );
    }
}

TagFilter.defaultProps = {
    strings: {
        placeholder: 'Type a tag'
    }
};