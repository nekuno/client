import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
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

@translate('TagEdit')
export default class TagEdit extends Component {

    static propTypes = {
        editKey              : PropTypes.string.isRequired,
        selected             : PropTypes.bool.isRequired,
        metadata             : PropTypes.object.isRequired,
        data                 : PropTypes.array,
        handleClickRemoveEdit: PropTypes.func.isRequired,
        handleChangeEdit     : PropTypes.func.isRequired,
        handleClickEdit      : PropTypes.func.isRequired,
        tags                 : PropTypes.array.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
    }

    handleKeyUpTag(tag) {
        let {editKey} = this.props;
        editKey = editKey === 'tags' ? null : editKey;
        if (tag.length > 2) {
            requestTagSuggestions(tag, editKey);
        } else {
            resetTagSuggestions();
        }
    }

    handleClickTagSuggestion(tagString) {
        let {editKey, data} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value.tag === tagString);
        if (!valueIndex > -1) {
            data.push(tagString);
        }
        resetTagSuggestions();
        this.props.handleChangeEdit(editKey, data);
    }

    render() {
        const {editKey, selected, metadata, data, handleClickRemoveEdit, handleClickEdit, strings} = this.props;
        let tags = this.props.tags.slice(0);
        if (this.refs.hasOwnProperty('tagInput')) {
            tags.push({name: this.refs.tagInput.getValue()});
        }
        return (
            selected ?
                <SelectedEdit key={'selected-filter'} type={'tag'} plusIcon={true} handleClickRemoveEdit={handleClickRemoveEdit}>
                    <TagInput ref={'tagInput'} placeholder={strings.placeholder} tags={tags.map(tag => tag.name)}
                              onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}
                              title={metadata.label}/>
                </SelectedEdit>
                :
                <UnselectedEdit key={editKey} editKey={editKey} metadata={metadata} data={data} handleClickEdit={handleClickEdit}/>
        );
    }
}

TagEdit.defaultProps = {
    strings: {
        placeholder: 'Type a tag'
    }
};