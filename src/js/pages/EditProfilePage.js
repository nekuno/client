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
        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeFilterAndUnSelect = this.handleChangeFilterAndUnSelect.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
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

    handleClickFilter(key) {
        let {profile} = this.state;
        profile[key] = profile[key] || null;
        //resetTagSuggestions();
        this.setState({
            selectedFilter: key,
            profile: profile
        });
    }

    handleChangeFilter(key, data) {
        let {profile} = this.state;
        profile[key] = data;
        this.setState({
            profile: profile,
            selectedFilter: key
        });
    }

    handleChangeFilterAndUnSelect(key, data) {
        let {profile} = this.state;
        profile[key] = data;
        this.setState({
            profile: profile,
            selectedFilter: null
        });
    }

    handleClickRemoveFilter() {
        let {profile, selectedFilter} = this.state;
        if (this.props.metadata[selectedFilter].required === true){
            nekunoApp.alert(this.props.strings.cannotRemove);
            return;
        }
        delete profile[selectedFilter];
        this.setState({
            profile: profile,
            selectedFilter: null
        })
    }

    handleClickOutside(e) {
        const selectedFilter = this.refs.selectedFilter;
        if (selectedFilter && selectedFilter.getSelectedFilter() && !selectedFilter.selectedFilterContains(e.target)) {
            this.setState({selectedFilter: null});
        }
    }

    renderField(dataArray, metadata, dataName) {
        let data = dataArray.hasOwnProperty(dataName) ? dataArray[dataName] : null;
        const selected = this.state.selectedFilter === dataName;
        if (metadata[dataName].editable === false) {
            return '';
        }
        let props = {
            key: dataName, filterKey: dataName,
            ref: selected ? 'selectedFilter' : '',
            metadata: metadata[dataName],
            selected: selected,
            handleClickRemoveFilter: this.handleClickRemoveFilter,
            handleClickFilter: this.handleClickFilter
        };
        switch (metadata[dataName]['type']) {
            case 'choice':
                props.data = data ? data : '';
                props.handleChangeFilter = this.handleChangeFilterAndUnSelect;
                return <ChoiceEdit {...props} />;
            case 'integer':
                props.data = data ? parseInt(data) : 0;
                props.handleChangeFilter = this.handleChangeFilter;
                return <IntegerEdit {...props}/>;
            case 'location':
                props.data = data ? data : {};
                props.handleChangeFilter = this.handleChangeFilterAndUnSelect;
                return <LocationEdit {...props}/>;
            case 'tags_and_choice':
                props.data = data ? data : [];
                props.handleChangeFilter = this.handleChangeFilter;
                return <TagsAndChoiceEdit {...props}/>;
            case 'multiple_choices':
                props.data = data ? data : [];
                props.handleChangeFilter = this.handleChangeFilter;
                return <MultipleChoicesEdit {...props} />;
            case 'double_choice':
                props.data = data ? data : {};
                props.handleChangeFilter = this.handleChangeFilter;
                props.handleChangeFilterDetail = this.handleChangeFilterAndUnSelect;
                return <DoubleChoiceEdit {...props} />;
            case 'tags':
                props.data = data ? data : [];
                props.handleChangeFilter = this.handleChangeFilterAndUnSelect;
                props.tags = this.props.tags;
                return <TagEdit {...props} />;
            case 'birthday':
                props.data = data ? data : null;
                props.handleChangeFilter = this.handleChangeFilter;
                return <BirthdayEdit {...props} />;
            case 'textarea':
                props.data = data ? data : null;
                props.handleChangeFilter = this.handleChangeFilter;
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
                <div className="page">
                    <div id="page-content">
                        <div className="user-block">
                            <div className="user-image">
                                <img src={imgSrc}/>
                            </div>
                        </div>
                        {
                            profile && metadata && filters ? Object.keys(profile).map(profileName => {
                                return this.renderField(profile, metadata, profileName);
                            }) : ''
                        }
                        {
                            profile && metadata && filters ? Object.keys(metadata).map(metadataName => {
                                if (profile.hasOwnProperty(metadataName)) {
                                    return '';
                                }
                                return this.renderField([], metadata, metadataName);
                            }) : ''
                        }
                        <FullWidthButton onClick={this.saveProfile}> {strings.saveChanges} </FullWidthButton>
                    </div>
                </div>
            </div>
        );
    }
};
