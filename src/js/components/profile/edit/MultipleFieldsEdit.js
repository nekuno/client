import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
import TextCheckboxes from '../../ui/TextCheckboxes';
import ChoiceEdit from '../edit/ChoiceEdit';
import IntegerEdit from '../edit/IntegerEdit';
import LocationEdit from '../edit/LocationEdit';
import TagsAndChoiceEdit from '../edit/TagsAndChoiceEdit';
import MultipleChoicesEdit from '../edit/MultipleChoicesEdit';
import MultipleLocationsEdit from '../edit/MultipleLocationsEdit';
import DoubleChoiceEdit from '../edit/DoubleChoiceEdit';
import TagEdit from '../edit/TagEdit';
import BirthdayEdit from '../edit/BirthdayEdit';
import TextAreaEdit from '../edit/TextAreaEdit';
import translate from '../../../i18n/Translate';
import Framework7Service from '../../../services/Framework7Service';

@translate('MultipleFieldsEdit')
export default class MultipleFieldsEdit extends Component {
    static propTypes = {
        editKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        profile: PropTypes.object,
        tags: PropTypes.array,
        data: PropTypes.array,
        handleChangeEdit: PropTypes.func.isRequired,
        handleClickRemoveEdit: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.handleChangeEditAndSave = this.handleChangeEditAndSave.bind(this);
        this.onFilterSelect = this.onFilterSelect.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleClickField = this.handleClickField.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);

        this.state = {
            profile: props.profile,
            selectedEdit: null,
            selectedIndex: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        const {profile, editKey} = this.props;
        if ((!profile || !profile[editKey]) && nextProps.profile) {
            this.setState({
                profile: nextProps.profile
            });
        }
    }

    handleChangeEditAndSave(key, data) {
        const {editKey, metadata, strings} = this.props;
        let {profile, selectedIndex} = this.state;

        profile[editKey] = profile[editKey] || [];

        if (null === selectedIndex) {
            profile[editKey].push({[key]: data});
            this.setState({
                selectedIndex: profile[editKey].length - 1,
                profile     : profile,
                selectedEdit: null,
            });
        } else {
            profile[editKey][selectedIndex][key] = data;
            this.setState({
                profile     : profile,
                selectedEdit: null,
            });
        }
        let emptyKey;
        if (emptyKey = Object.keys(metadata.metadata).find(fieldKey => metadata.metadata[fieldKey].required && profile[editKey].some(profileField => !profileField[fieldKey]))) {
            Framework7Service.nekunoApp().alert(emptyKey + ' ' + strings.isRequired);
            return;
        }

        this.props.handleChangeEdit(editKey, profile[editKey]);
    }

    onFilterSelect(key) {
        this.setState({
            selectedEdit: key,
        });
    }

    handleClickRemoveEdit() {
        const {editKey} = this.props;

        this.props.handleClickRemoveEdit(editKey);
    }

    handleClickAdd() {
        const {editKey, metadata, strings} = this.props;
        let {profile, selectedIndex} = this.state;

        if (null === selectedIndex || Object.keys(profile[editKey][selectedIndex]).length > 0) {
            profile[editKey] = this.clearVoidItems(profile[editKey], metadata);
            if (metadata.max && profile[editKey].length >= metadata.max) {
                Framework7Service.nekunoApp().alert(strings.maxChoices.replace("%max%", metadata.max));
                return;
            }
            profile[editKey].push({});
            Object.keys(profile[editKey][0]).forEach(field => {
                if (this.refs[field] && typeof this.refs[field].clearValue !== 'undefined') {
                    this.refs[field].clearValue();
                }
            });
            this.setState({
                profile      : profile,
                selectedIndex: profile[editKey].length - 1,
            });
        }
    }

    handleClickField(key) {
        const {editKey, metadata} = this.props;
        let {profile} = this.state;

        profile[editKey] = this.clearVoidItems(profile[editKey], metadata);
        if (profile[editKey] && profile[editKey][key]) {
            Object.keys(profile[editKey][key]).forEach(field => {
                if (this.refs[field] && typeof this.refs[field].setValue !== 'undefined') {
                    this.refs[field].setValue(profile[editKey][key][field]);
                }
            });
            this.setState({
                profile: profile,
                selectedIndex: key
            });
        } else {
            this.setState({
                profile: profile,
            });
        }
    }

    clearVoidItems = function(fields, metadata) {
        if (fields && fields.length > 0) {
            fields.forEach((field, index) => {
                if (!field || !Object.keys(field).length || Object.keys(metadata.metadata).some(key => metadata.metadata[key].required && !field[key])) {
                    fields.splice(index, 1);
                }
            });
        }

        return fields;
    };

    renderField(dataArray, metadata, dataName) {
        let data = dataArray.hasOwnProperty(dataName) ? dataArray[dataName] : null;

        const selected = this.state.selectedEdit === dataName;
        if (!metadata.hasOwnProperty(dataName) || metadata[dataName].editable === false) {
            return '';
        }
        let props = {
            editKey              : dataName,
            metadata             : metadata[dataName],
            selected             : selected,
            handleClickEdit      : this.handleClickEdit
        };
        let filter = null;
        switch (metadata[dataName]['type']) {
            case 'choice':
                props.data = data ? data : '';
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <ChoiceEdit {...props} />;
                break;
            case 'integer':
                props.data = data ? parseInt(data) : null;
                props.handleClickInput = this.onFilterSelect;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <IntegerEdit {...props}/>;
                break;
            case 'location':
                props.data = data ? data : {};
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <LocationEdit {...props}/>;
                break;
            case 'tags_and_choice':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChangeEditAndSave;
                props.handleClickInput = this.onFilterSelect;
                props.tags = this.props.tags;
                props.profile = this.props.profile;
                props.googleSuggestions = true;
                filter = <TagsAndChoiceEdit {...props}/>;
                break;
            case 'multiple_choices':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <MultipleChoicesEdit {...props} />;
                break;
            case 'multiple_locations':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <MultipleLocationsEdit {...props} />;
                break;
            case 'double_choice':
                props.data = data ? data : {};
                props.handleChangeEdit = this.handleChangeEditAndSave;
                props.handleChangeEditDetail = this.handleChangeEditAndSave;
                filter = <DoubleChoiceEdit {...props} />;
                break;
            case 'tags':
                props.data = data ? data : [];
                props.handleClickInput = this.onFilterSelect;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                props.tags = this.props.tags;
                props.profile = this.props.profile;
                props.googleSuggestions = true;
                filter = <TagEdit {...props} />;
                break;
            case 'birthday':
                props.data = data ? data : null;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <BirthdayEdit {...props} />;
                break;
            case 'textarea':
                props.data = data ? data : null;
                props.ref = dataName;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <TextAreaEdit {...props} />;
                break;
        }
        return <div key={dataName} ref={selected ? 'selectedEdit' : ''}>{filter}</div>;
    }

    renderNotSelectedText = function(data = []) {
        let text = '';
        for (let value in data) {
            if (typeof data[value] === 'string') {
                text += data[value];
                break;
            }
        }

        return text.length > 40 ? text.substr(0, 37) + '...' : text;
    };

    render() {
        const {editKey, selected, metadata, data, strings} = this.props;
        const {profile, selectedIndex} = this.state;
        const selectedData = null !== selectedIndex && profile && profile[editKey] && profile[editKey][selectedIndex] ? profile[editKey][selectedIndex] : {};

        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'checkbox'} active={data && data.length > 0} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                <div className="list-block text-multiple-fields">
                    <div className="multiple-fields-title">{metadata.labelEdit}</div>
                </div>
                <div className="multiple-fields">
                    {Object.keys(metadata.metadata).map(key => this.renderField(selectedData, metadata.metadata, key))}
                </div>
                {profile[editKey] && profile[editKey].length > 0 ? <div className="add-tags-and-choice" onClick={this.handleClickAdd}>{strings.add} <span className="icon-plus"></span></div> : ''}
                {profile[editKey] && profile[editKey].length > 0 > 0 ? profile[editKey].map((value, index) =>
                    index !== selectedIndex ?
                        <div className="tags-and-choice-unselected-filter" key={index}>
                            <TextCheckboxes labels={[{key: index, text: this.renderNotSelectedText(value)}]} values={[index]}
                                            onClickHandler={this.handleClickField} className={'tags-and-choice-filter'}/>
                        </div>
                        : null
                ) : null}
            </SelectedEdit>
        );
    }
}

MultipleFieldsEdit.defaultProps = {
    strings: {
        minChoices: 'Select at least %min% items',
        maxChoices: 'Select up to %max% items',
        isRequired: 'is required',
        add       : 'Add'
    }
};