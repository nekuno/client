import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import ProfileStore from '../stores/ProfileStore';
import FilterStore from '../stores/FilterStore';
import TagSuggestionStore from '../stores/TagSuggestionsStore';
import ChoiceEdit from '../components/profile/edit/ChoiceEdit';
import LocationEdit from '../components/profile/edit/LocationEdit';
import IntegerEdit from '../components/profile/edit/IntegerEdit';
import TagsAndChoiceEdit from '../components/profile/edit/TagsAndChoiceEdit';
import MultipleChoicesEdit from '../components/profile/edit/MultipleChoicesEdit';
import DoubleChoiceEdit from '../components/profile/edit/DoubleChoiceEdit';
import TagEdit from '../components/profile/edit/TagEdit';
import BirthdayEdit from '../components/profile/edit/BirthdayEdit';
import TextAreaEdit from '../components/profile/edit/TextAreaEdit';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import FullWidthButton from '../components/ui/FullWidthButton';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const user = props.user;
    UserActionCreators.requestProfile(parseId(user));
    UserActionCreators.requestMetadata();
    ThreadActionCreators.requestFilters();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const user = props.user;
    const profile = ProfileStore.get(parseId(user));
    const metadata = ProfileStore.getMetadata();
    const filters = FilterStore.filters;
    const tags = TagSuggestionStore.tags;

    return {
        profile,
        metadata,
        filters,
        tags
    };
}

@AuthenticatedComponent
@translate('EditProfilePage')
@connectToStores([ProfileStore, FilterStore, TagSuggestionStore], getState)
export default class EditProfilePage extends Component {
    static propTypes = {
        // Injected by @connectToStores:
        profile: PropTypes.object,
        metadata: PropTypes.object,
        filters: PropTypes.object,
        tags: PropTypes.array,
        // Injected by @AuthenticatedComponent
        user: PropTypes.object,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            selectedEdit: null
        };

        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.handleClickEdit = this.handleClickEdit.bind(this);
        this.handleChangeEdit = this.handleChangeEdit.bind(this);
        this.handleChangeEditAndUnSelect = this.handleChangeEditAndUnSelect.bind(this);
        this.handleClickRemoveEdit = this.handleClickRemoveEdit.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profile) {
            this.setState({
                profile: nextProps.profile
            });
        }
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentDidMount() {
        window.nekunoContainer.addEventListener('click', this.handleClickOutside)
    }

    componentWillUnmount() {
        window.nekunoContainer.removeEventListener('click', this.handleClickOutside)
    }

    onSuggestSelect(location) {
        let {profile} = this.state;
        profile.location = location;
        this.setState({
            profile: profile
        });
    }

    saveProfile() {
        UserActionCreators.editProfile(this.state.profile);
    }

    handleClickEdit(key) {
        let {profile} = this.state;
        profile[key] = profile[key] || null;
        //resetTagSuggestions();
        this.setState({
            selectedEdit: key,
            profile: profile
        });
    }

    handleChangeEdit(key, data) {
        let {profile} = this.state;
        profile[key] = data;
        this.setState({
            profile: profile,
            selectedEdit: key
        });
    }

    handleChangeEditAndUnSelect(key, data) {
        let {profile} = this.state;
        profile[key] = data;
        this.setState({
            profile: profile,
            selectedEdit: null
        });
    }

    handleClickRemoveEdit() {
        let {profile, selectedEdit} = this.state;
        if (this.props.metadata[selectedEdit].required === true){
            nekunoApp.alert(this.props.strings.cannotRemove);
            return;
        }
        delete profile[selectedEdit];
        this.setState({
            profile: profile,
            selectedEdit: null
        })
    }

    handleClickOutside(e) {
        const selectedEdit = this.refs.selectedEdit;
        if (selectedEdit && selectedEdit.getSelectedEdit() && !selectedEdit.selectedEditContains(e.target)) {
            this.setState({selectedEdit: null});
        }
    }

    renderField(dataArray, metadata, dataName) {
        let data = dataArray.hasOwnProperty(dataName) ? dataArray[dataName] : null;
        const selected = this.state.selectedEdit === dataName;
        if (!metadata.hasOwnProperty(dataName) || metadata[dataName].editable === false) {
            return '';
        }
        let props = {
            key: dataName, editKey: dataName,
            ref: selected ? 'selectedEdit' : '',
            metadata: metadata[dataName],
            selected: selected,
            handleClickRemoveEdit: this.handleClickRemoveEdit,
            handleClickEdit: this.handleClickEdit
        };
        switch (metadata[dataName]['type']) {
            case 'choice':
                props.data = data ? data : '';
                props.handleChangeEdit = this.handleChangeEditAndUnSelect;
                return <ChoiceEdit {...props} />;
            case 'integer':
                props.data = data ? parseInt(data) : 0;
                props.handleChangeEdit = this.handleChangeEdit;
                return <IntegerEdit {...props}/>;
            case 'location':
                props.data = data ? data : {};
                props.handleChangeEdit = this.handleChangeEditAndUnSelect;
                return <LocationEdit {...props}/>;
            case 'tags_and_choice':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChangeEdit;
                return <TagsAndChoiceEdit {...props}/>;
            case 'multiple_choices':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChangeEdit;
                return <MultipleChoicesEdit {...props} />;
            case 'double_choice':
                props.data = data ? data : {};
                props.handleChangeEdit = this.handleChangeEdit;
                props.handleChangeEditDetail = this.handleChangeEditAndUnSelect;
                return <DoubleChoiceEdit {...props} />;
            case 'tags':
                props.data = data ? data : [];
                props.handleChangeEdit = this.handleChangeEditAndUnSelect;
                props.tags = this.props.tags;
                return <TagEdit {...props} />;
            case 'birthday':
                props.data = data ? data : null;
                props.handleChangeEdit = this.handleChangeEdit;
                return <BirthdayEdit {...props} />;
            case 'textarea':
                props.data = data ? data : null;
                props.handleChangeEdit = this.handleChangeEdit;
                return <TextAreaEdit {...props} />;
            default:
                return '';
        }
    }

    render() {
        const {user, profile, metadata, filters, strings} = this.props;
        const imgSrc = this.props.user ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={strings.title} leftText={strings.cancel}/>
                <div className="page edit-profile-page">
                    <div id="page-content">
                        <div className="user-block">
                            <div className="user-image">
                                <img src={imgSrc}/>
                            </div>
                        </div>
                        {
                            profile && metadata && filters ? Object.keys(profile).map(profileName => {
                                return this.renderField(profile, metadata, profileName);
                            }) : null
                        }
                        {
                            profile && metadata && filters ? Object.keys(metadata).map(metadataName => {
                                if (profile.hasOwnProperty(metadataName)) {
                                    return null;
                                }
                                return this.renderField([], metadata, metadataName);
                            }) : null
                        }
                        <br />
                        <FullWidthButton onClick={this.saveProfile}> {strings.saveChanges} </FullWidthButton>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
};
