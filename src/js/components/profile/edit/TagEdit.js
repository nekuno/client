import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TagInput from '../../ui/TagInput';
import TextCheckboxes from '../../ui/TextCheckboxes';
import * as TagSuggestionsActionCreators from '../../../actions/TagSuggestionsActionCreators';
import translate from '../../../i18n/Translate';

function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

@translate('TagEdit')
export default class TagEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.array,
        handleClickInput     : PropTypes.func,
        handleClickRemoveEdit: PropTypes.func,
        handleChangeEdit     : PropTypes.func.isRequired,
        tags                 : PropTypes.array.isRequired,
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

    handleClickTagSuggestion(tagString) {
        let {editKey, data} = this.props;
        data = data || [];
        this.refs['tagInput' + editKey].clearValue();
        this.refs['tagInput' + editKey].focus();

        let tag = this.props.tags.find(propTag => propTag.name === tagString);
        if (tag === undefined){
            tag = {name: tagString};
        }

        const exists = data.some(value => value.name === tagString);
        if (!exists) {
            data.push(tag);
        }
        this.props.handleChangeEdit(editKey, data);
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
        this.props.handleChangeEdit(editKey, data);
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
        const {editKey, selected, metadata, data, strings} = this.props;
        const {selectedTag} = this.state;
        let tags = this.props.tags.slice(0);

        if (this.refs.hasOwnProperty('tagInput' + editKey) && this.refs['tagInput' + editKey].getValue()) {
            tags.push({name: this.refs['tagInput' + editKey].getValue()});
        }
        return (
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'tag'} plusIcon={true} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null} onClickHandler={selected ? null : this.handleClickInput}>
                <TagInput ref={'tagInput' + editKey} placeholder={strings.placeholder} tags={selected ? tags.map(tag => tag.name) : []}
                          onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}
                          title={metadata.labelEdit} doNotFocus={!selected}/>
                <div className="table-row"></div>
                {selectedTag ? <div className="table-row"></div> : null}
                {selectedTag ? <div className="table-row"></div> : null}
                {/*{selectedTag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTag}>{strings.remove} <span className="icon-delete"></span></div> : ''}*/}
                {data.length > 0 ?
                    <div className="tags-and-choice-unselected-filters">
                        <div className="table-row"></div>
                        {data.filter(value => selectedTag === null || value !== selectedTag.name).map((value, index) =>
                            <div className="tags-and-choice-unselected-filter" key={index}>
                                <TextCheckboxes labels={[{key: value.name, text: value.name}]} values={[value.name]}
                                                onClickHandler={this.handleClickTag} className={'tags-and-choice-filter'}/>
                            </div>
                        )}
                    </div> : ''
                }

            </SelectedEdit>
        );
    }
}

TagEdit.defaultProps = {
    strings: {
        placeholder: 'Type a tag',
        remove     : 'Remove'
    }
};