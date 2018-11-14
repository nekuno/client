import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputTag from '../../RegisterFields/InputTag/InputTag.js';
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
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.array,
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

    handleClickTagSuggestion(tags) {
        let {filterKey} = this.props;

        resetTagSuggestions();
        this.props.handleChangeFilter(filterKey, tags);
    }

    render() {
        const {filter, data, tags, strings} = this.props;
        const tagValues = tags ? tags.map(tag => tag.name) : [];

        return (
            <InputTag tags={tagValues} selected={data} title={filter.label} selectedLabel={strings.selected} placeholder={strings.placeholder} onChangeHandler={this.handleKeyUpTag} onClickHandler={this.handleClickTagSuggestion}/>
        );
    }
}

TagFilter.defaultProps = {
    strings: {
        selected   : 'Your selection',
        placeholder: 'Type a tag'
    }
};