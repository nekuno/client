import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectedEdit from './SelectedEdit';
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
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);

        this.state = {
            profile: props.profile,
            selectedEdit: null,
            selectedIndex: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile) {
            this.setState({
                profile: nextProps.profile
            });
        }
    }

    handleChangeEditAndSave(key, data) {
        const {editKey} = this.props;
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
        const {editKey} = this.props;
        let {profile} = this.state;
        profile.push({});
        this.setState({
            profile: profile,
            selectedIndex: profile[editKey].length - 1,
        });
    }

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
                //props.data = data ? data : null;
                props.data = null;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <TextAreaEdit {...props} />;
                break;
        }
        return <div key={dataName} ref={selected ? 'selectedEdit' : ''}>{filter}</div>;
    }

    render() {
        const {editKey, selected, metadata, data, profile, strings} = this.props;
        const {selectedIndex} = this.state;
        const selectedData = null !== selectedIndex && data[selectedIndex] ? data[selectedIndex] : {};

        return(
            <SelectedEdit key={selected ? 'selected-filter' : editKey} type={'checkbox'} active={data && data.length > 0} handleClickRemoveEdit={this.props.handleClickRemoveEdit ? this.handleClickRemoveEdit : null}>
                <div className="list-block text-checkboxes">
                    <div className="checkbox-title">{metadata.labelEdit}</div>
                </div>
                <div className="multiple-fields">
                    {Object.keys(metadata.metadata).map(key => this.renderField(selectedData, metadata.metadata, key))}
                </div>
                {profile[editKey] ? <div className="add-tags-and-choice" onClick={this.handleClickAdd}>{strings.add} <span className="icon-plus"></span></div> : ''}
            </SelectedEdit>
        );
    }
}

MultipleFieldsEdit.defaultProps = {
    strings: {
        minChoices: 'Select at least %min% items',
        maxChoices: 'Select up to %max% items',
        add       : 'Add proposal'
    }
};