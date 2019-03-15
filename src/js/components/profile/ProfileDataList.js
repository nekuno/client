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
import MultipleChoicesEdit from './edit/MultipleChoicesEdit/MultipleChoicesEdit';
import MultipleFieldsEdit from '../../components/profile/edit/MultipleFieldsEdit';
import MultipleLocationsEdit from '../../components/profile/edit/MultipleLocationsEdit';
import DoubleChoiceEdit from './edit/DoubleChoiceEdit/DoubleChoiceEdit';
import BirthdayEdit from './edit/BirthdayEdit/BirthdayEdit';
import TextAreaEdit from '../../components/profile/edit/TextAreaEdit';
import Framework7Service from '../../services/Framework7Service';
import EditProfileCategory from "../OwnUser/EditProfileCategory";
import TagEdit from "./edit/TagEdit";
import RoundedIcon from "../ui/RoundedIcon/RoundedIcon";
import AuthenticatedComponent from "../AuthenticatedComponent";

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const categories = ProfileStore.getCategories();
    const filters = FilterStore.filters;
    const tags = TagSuggestionsStore.tags;
    const tagType = TagSuggestionsStore.tagType;

    return {
        categories,
        filters,
        tags,
        tagType
    };
}

@translate('ProfileDataList')
@AuthenticatedComponent
@connectToStores([ProfileStore, FilterStore, TagSuggestionsStore], getState)
export default class ProfileDataList extends Component {

    static propTypes = {
        profile            : PropTypes.object.isRequired,
        profileWithMetadata: PropTypes.array.isRequired,
        metadata           : PropTypes.object,
        categories         : PropTypes.array,
        filters            : PropTypes.object,
        tags               : PropTypes.array,
        tagType            : PropTypes.string,
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
        const {profile, metadata, user} = this.props;
        const renderedCategory =  Object.keys(category.fields).map(field =>
            <div key={'parent-' + field} className={styles.profileCategoryEdition}>
                {this.renderField(profile.hasOwnProperty(field) ? profile : [], metadata, field)}
            </div>
        );

        const isMainCategory = category.fields.birthday !== undefined;
        if (isMainCategory)
        {
            const userField = <div key={'parent-user'} className={styles["profile-category-edition"] + ' ' + styles.userField}>
                <div className={styles.userPhoto}><RoundedIcon icon={user.photo.thumbnail.medium} size={'medium'}/></div>
                <div className={styles.userName}> {user.username} </div>
            </div>;
            renderedCategory.unshift(userField);
        }

        return renderedCategory;
    }

    renderField(dataArray, metadata, dataName) {
        let data = dataArray.hasOwnProperty(dataName) ? dataArray[dataName] : null;

        const selected = this.state.selectedEdit === dataName;
        if (!metadata.hasOwnProperty(dataName) || metadata[dataName].editable === false) {
            return '';
        }
        let props = {
            title                : metadata[dataName].labelEdit,
            editKey              : dataName,
            metadata             : metadata[dataName],
            selected             : selected,
            handleClickRemoveEdit: metadata[dataName].notErasable ? null : this.handleClickRemoveEdit,
            handleClickEdit      : this.handleClickEdit
        };
        let filter = null;
        let handleClick = this.handleChangeEditAndSave.bind(this, dataName); //called only with data
        const options = metadata[dataName]['choices'];
        switch (metadata[dataName]['type']) {
            case 'choice':
                props.selected = data ? data : '';
                props.choices = options;
                let handleClickChoice = function(data) {
                    const option = options.find((each) => {
                        return each.text === data
                    });
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
                const details = metadata[dataName]['doubleChoices'];
                let handleClickDoubleChoice = function(data) {
                    const choiceId = data.choice;

                    const choiceDetails = details[choiceId];
                    const detailId = Object.keys(choiceDetails).find(eachKey => {
                        return choiceDetails[eachKey] === data.detail
                    });
                    handleClick({choice: choiceId, detail: detailId});
                };
                data = data ? data : {};
                props.firstChoiceSelected = data.choice ? data.choice : null;
                props.detailSelected = data.detail ? data.detail : null;
                props.handleChangeEdit = handleClickDoubleChoice;
                filter = <DoubleChoiceEdit {...props} />;
                break;
            case 'tags':
                props.selected = data ? data : [];
                props.tagSuggestions = this.props.tagType === dataName ? this.props.tags.map(tag => tag.name) : [];
                props.handleChangeEdit = handleClick;
                props.profile = this.props.profile;
                filter = <TagEdit {...props} />;
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
                profileWithMetadata.map(
                    category => {
                        return <EditProfileCategory key={category.label} title={category.label} fields={this.renderFields(category)} onToggleCollapse={this.onCategoryToggle.bind(this, category.label)}/>
                    }
                )
        );
    }
}

ProfileDataList.defaultProps = {
    strings: {
        cannotRemove: 'This field cannot be deleted'
    }
};