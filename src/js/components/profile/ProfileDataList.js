import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProfileDataList.scss';
import ProfileData from './ProfileData';
import * as UserActionCreators from '../../actions/UserActionCreators';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import ProfileStore from '../../stores/ProfileStore';
import FilterStore from '../../stores/FilterStore';
import TagSuggestionsStore from '../../stores/TagSuggestionsStore';
import ChoiceEdit from './edit/ChoiceEdit/ChoiceEdit';
import LocationEdit from '../../components/profile/edit/LocationEdit';
import IntegerEdit from '../../components/profile/edit/IntegerEdit';
import TagsAndChoiceEdit from '../../components/profile/edit/TagsAndChoiceEdit';
import MultipleChoicesEdit from '../../components/profile/edit/MultipleChoicesEdit';
import MultipleFieldsEdit from '../../components/profile/edit/MultipleFieldsEdit';
import MultipleLocationsEdit from '../../components/profile/edit/MultipleLocationsEdit';
import DoubleChoiceEdit from '../../components/profile/edit/DoubleChoiceEdit';
import BirthdayEdit from '../../components/profile/edit/BirthdayEdit';
import TextAreaEdit from '../../components/profile/edit/TextAreaEdit';
import Framework7Service from '../../services/Framework7Service';
import EditProfileCategory from "../OwnUser/EditProfileCategory";
import InputTag from "../RegisterFields/InputTag/InputTag";

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const categories = ProfileStore.getCategories();
    const filters = FilterStore.filters;
    const tags = TagSuggestionsStore.tags;

    return {
        categories,
        filters,
        tags
    };
}

@translate('ProfileDataList')
@connectToStores([ProfileStore, FilterStore, TagSuggestionsStore], getState)
export default class ProfileDataList extends Component {

    static propTypes = {
        profile            : PropTypes.object.isRequired,
        profileWithMetadata: PropTypes.array.isRequired,
        metadata           : PropTypes.object,
        categories         : PropTypes.array,
        filters            : PropTypes.object,
        tags               : PropTypes.array,
        saveProfile        : PropTypes.func.isRequired,
        // Injected by @AuthenticatedComponent
        user               : PropTypes.object,
        // Injected by @translate:
        strings            : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            profile         : {},
            selectedEdit    : null,
            selectedCategory: null
        };

        this.onFilterSelect = this.onFilterSelect.bind(this);
        this.handleClickEdit = this.handleClickEdit.bind(this);
        this.handleChangeEdit = this.handleChangeEdit.bind(this);
        this.handleChangeEditAndSave = this.handleChangeEditAndSave.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.renderField = this.renderField.bind(this);
        this.renderFields = this.renderFields.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile) {
            this.setState({
                profile: nextProps.profile
            });
        }
    }

    componentDidMount() {
        window.nekunoContainer.addEventListener('click', this.handleClickOutside)
    }

    componentWillUnmount() {
        window.nekunoContainer.removeEventListener('click', this.handleClickOutside)
    }

    onCategoryToggle(category) {
        this.setState({
            selectedCategory: this.state.selectedCategory ? null : category
        });
    }

    onFilterSelect(key) {
        console.log('onFilterselect');
        this.setState({
            selectedEdit: key,
        });
    }

    saveProfile(oldProfile) {
        UserActionCreators.editProfile(this.state.profile, oldProfile);
    }

    handleClickEdit(key) {
        let {profile} = this.state;
        profile[key] = profile[key] || null;
        //resetTagSuggestions();
        this.setState({
            selectedEdit: key,
            profile     : profile
        });
    }

    handleChangeEdit(key, data) {
        let {profile} = this.state;
        profile[key] = data;
        this.setState({
            profile     : profile,
            selectedEdit: key
        });
    }

    handleChangeEditAndSave(key, data) {
        console.log('handleChangeEditAndSave');
        let {profile} = this.state;
        let oldProfile = Object.assign({}, profile);
        profile[key] = data;
        this.setState({
            profile     : profile,
            selectedEdit: null
        });
        this.props.saveProfile(oldProfile, profile);
    }

    handleClickRemoveEdit(editKey) {
        let {profile} = this.state;
        let oldProfile = Object.assign({}, profile);
        if (this.props.metadata[editKey] && this.props.metadata[editKey].required === true) {
            Framework7Service.nekunoApp().alert(this.props.strings.cannotRemove);
            return;
        }
        profile[editKey] = null;
        this.setState({
            profile     : profile,
            selectedEdit: null
        });
        this.saveProfile(oldProfile);
    }

    handleClickOutside(e) {
        const selectedEditRef = this.refs.selectedEdit;
        const selectedCategoryRef = this.refs.selectedCategory;
        const selectedCategoryEditRef = this.refs.selectedCategoryEdit;
        let selectedEdit = this.state.selectedEdit;
        let selectedCategory = this.state.selectedCategory;
        if (selectedEditRef && !selectedEditRef.contains(e.target)) {
            selectedEdit = null;
        }
        if (selectedCategoryRef && !selectedCategoryRef.contains(e.target) && selectedCategoryEditRef && !selectedCategoryEditRef.contains(e.target)) {
            selectedCategory = null;
        }
        if (selectedEdit !== this.state.selectedEdit || selectedCategory !== this.state.selectedCategory) {
            this.setState({
                selectedEdit    : selectedEdit,
                selectedCategory: selectedCategory
            });
        }
    }

    renderFields(category) {
        const {profile, metadata} = this.props;
        return Object.keys(category.fields).map(field =>
            <div key={'parent-' + field} className={styles.profileCategoryEdition}>
                <hr/>
                <br/>
                {this.renderField(profile.hasOwnProperty(field) ? profile : [], metadata, field)}
            </div>
        )
    }

    renderField(dataArray, metadata, dataName) {
        let data = dataArray.hasOwnProperty(dataName) ? dataArray[dataName] : null;

        const selected = this.state.selectedEdit === dataName;
        if (!metadata.hasOwnProperty(dataName) || metadata[dataName].editable === false) {
            return '';
        }
        let props = {
            title                : metadata[dataname].labelEdit,
            editKey              : dataName,
            metadata             : metadata[dataName],
            selected             : selected,
            handleClickRemoveEdit: metadata[dataName].notErasable ? null : this.handleClickRemoveEdit,
            handleClickEdit      : this.handleClickEdit
        };
        let filter = null;
        let handleClick = this.handleChangeEditAndSave.bind(this, dataName); //called only with data
        switch (metadata[dataName]['type']) {
            case 'choice':
                props.selected = data ? data : '';
                let handleClickChoice = function(data)
                {
                    const options = metadata[dataName]['choices'];
                    const option = options.find((each) => {return each.text === data});
                    handleClick(option.id);
                };
                props.handleChangeEdit = handleClickChoice;
                props.onClickHandler = handleClick;
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
                filter = <TagsAndChoiceEdit {...props}/>;
                break;
            case 'multiple_choices':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <MultipleChoicesEdit {...props} />;
                break;
            case 'multiple_fields':
                props.data = data ? data : [];
                props.tags = this.props.tags;
                props.profile = this.props.profile;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <MultipleFieldsEdit {...props} />;
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
                let handleClickTag = function(data){
                    const tags = data.map(tag => {
                        return {name: tag}
                    });
                    return handleClick(tags);
                };
                props.tags = data ? data.map((tag) => {return tag.name}) : [];
                props.selected = props.tags;
                // props.onClickHandler = this.onFilterSelect;
                props.onClickHandler = handleClickTag;
                // props.onChangeHandler = this.handleChangeEditAndSave;
                props.onChangeHandler = this.onFilterSelect;
                props.profile = this.props.profile;
                // filter = <TagEdit {...props} />;

                filter = <InputTag {...props}/>;
                break;
            case 'birthday':
                props.data = data ? data : null;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <BirthdayEdit {...props} />;
                break;
            case 'textarea':
                props.data = data ? data : null;
                props.handleChangeEdit = this.handleChangeEditAndSave;
                filter = <TextAreaEdit {...props} />;
                break;
        }
        return <div key={dataName} ref={selected ? 'selectedEdit' : ''}>{filter}</div>;
    }

    render() {

        const {profileWithMetadata} = this.props;

        return (
            <div className={styles.profileDataList}>
                {profileWithMetadata.map(
                    category => {
                        // return (
                        //     <div key={category.label} ref={this.state.selectedCategory === category.label ? "selectedCategoryEdit" : null}>
                        //         <div className="profile-category" ref={category.label === this.state.selectedCategory ? 'selectedCategory' : null}>
                        //             <h3>{category.label} <span className="icon-wrapper" onClick={this.onCategoryToggle.bind(this, category.label)}><span className={category.label === this.state.selectedCategory ? 'icon-checkmark' : 'icon-edit'}/></span></h3>
                        //         </div>
                        //
                        //         {this.state.selectedCategory === category.label ?
                        //             Object.keys(category.fields).map(field =>
                        //                 <div key={'parent-' + field} className="profile-category-edition">
                        //                     <hr/>
                        //                     <br/>
                        //                     {this.renderField(profile.hasOwnProperty(field) ? profile : [], metadata, field)}
                        //                 </div>
                        //             )
                        //             :
                        //             Object.keys(category.fields).map(
                        //                 profileDataKey =>
                        //                     category.fields[profileDataKey].value && metadata[profileDataKey].hidden !== true?
                        //                         <ProfileData key={profileDataKey} name={category.fields[profileDataKey].text} value={category.fields[profileDataKey].value} forceLong={category.fields[profileDataKey].type === 'textarea'}/>
                        //                         : null
                        //             )
                        //         }
                        //     </div>
                        // )
                        return <EditProfileCategory key={category.label} title={category.label} fields={this.renderFields(category)} onToggleCollapse={this.onCategoryToggle.bind(this, category.label)}/>
                    }
                )}
            </div>
        );
    }
}

ProfileDataList.defaultProps = {
    strings: {
        cannotRemove: 'This field cannot be deleted'
    }
};