import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as TagSuggestionsActionCreators from '../../../actions/TagSuggestionsActionCreators';
import translate from '../../../i18n/Translate';
import InputTag from "../../RegisterFields/InputTag/InputTag";

function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

@translate('TagEdit')
export default class TagEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.array,
        handleClickInput     : PropTypes.func,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        selected             : PropTypes.array.isRequired,
        tagSuggestions       : PropTypes.array,
        profile              : PropTypes.object.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickInput = this.handleClickInput.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);
        this.handleClickRemoveTag = this.handleClickRemoveTag.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
        this.requestTagSuggestions = this.requestTagSuggestions.bind(this);

        this.state = {
            selectedTag: null,
            firstSearch: true
        };
    }

    componentWillMount() {
        if (this.props.selected && this.props.handleClickInput) {
            this.props.handleClickInput();
        }
    }

    handleClickInput() {
        const {editKey} = this.props;
        resetTagSuggestions();
        if (this.props.handleClickInput) {
            this.props.handleClickInput(editKey);
        }
    }

    handleKeyUpTag(tag) {
        let {editKey} = this.props;
        editKey = editKey === 'tags' ? null : editKey;
        if (tag.length > 2) {
            this.requestTagSuggestions(tag, editKey);
        } else {
            resetTagSuggestions();
        }
    }

    handleClickTagSuggestion(tagStringArray) {
        let {editKey} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();

        // let tag = this.props.selected.find(propTag => propTag.name === tagString);
        // if (tag === undefined) {
        //     tag = {name: tagString};
        // }

        // const exists = data.some(value => value.name === tagString);
        // if (!exists) {
        //     data.push(tag);
        // }
        const tags = tagStringArray.map(string => {return {name: string}});
        this.props.handleChangeEdit(tags);
        this.setState({
            selectedTag: null
        });
        resetTagSuggestions();
    }

    handleClickTag(tag) {
        const {editKey} = this.props;
        this.refs['tagInput' + editKey].setValue(tag);
        this.refs['tagInput' + editKey].focus();
        this.setState({
            selectedTag: tag
        });
        resetTagSuggestions();
    }

    handleClickRemoveTag() {
        let {editKey, data} = this.props;
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();
        const index = data.findIndex(value => value.name === this.state.selectedTag);
        data.splice(index, 1);
        this.setState({
            selectedTag: null
        });
        this.props.handleChangeEdit(data);
        resetTagSuggestions();
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;
        this.props.handleClickRemoveEdit(editKey);
    }

    requestTagSuggestions(search, type = null) {
        const {firstSearch} = this.state;
        const tagsTimeoutSec = firstSearch ? 0 : 1500;

        if (typeof this.tagsTimeout !== 'undefined') {
            clearTimeout(this.tagsTimeout);
        }
        this.tagsTimeout = setTimeout(() => {
            if (this.props.metadata.schema) {
                const language = this.props.profile.interfaceLanguage;
                type = this.props.metadata.schema;
                TagSuggestionsActionCreators.requestGoogleTagSuggestions(search, type, language);
            } else if (type === null) {
                TagSuggestionsActionCreators.requestContentTagSuggestions(search);
            } else {
                TagSuggestionsActionCreators.requestProfileTagSuggestions(search, type);
            }
            this.setState({
                firstSearch: false
            });
        }, tagsTimeoutSec);
    }

    render() {
        const {editKey, metadata, strings, tagSuggestions, selected} = this.props;
        let selectedTags = selected.slice(0).map(tag => tag.name);

        if (this.refs.hasOwnProperty('tagInput' + editKey) && this.refs['tagInput' + editKey].getValue()) {
            selectedTags.push(this.refs['tagInput' + editKey].getValue());
        }
        return (
            <InputTag ref={'tagInput' + editKey} placeholder={strings.placeholder} selected={selectedTags} tags={tagSuggestions}
                      onChangeHandler={this.handleKeyUpTag} onClickHandler={this.handleClickTagSuggestion}
                      title={metadata.labelEdit}/>
        );
    }
}

TagEdit.defaultProps = {
    strings         : {
        placeholder: 'Type a tag',
        remove     : 'Remove'
    },
    tagSuggestions  : [],
    selected        : [],
    handleChangeEdit: () => {
    },
};