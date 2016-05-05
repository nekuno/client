import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
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
import LocationInput from '../components/ui/LocationInput';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';

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
@connectToStores([ProfileStore, FilterStore, TagSuggestionStore], getState)
export default class EditProfilePage extends Component {
    static propTypes = {
        profile: PropTypes.object,
        metadata: PropTypes.object,
        filters: PropTypes.object,
        user: PropTypes.object.isRequired,
        tags: PropTypes.array
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

    componentDidMount () {
        window.nekunoContainer.addEventListener('click', this.handleClickOutside)
    }

    componentWillUnmount () {
        window.nekunoContainer.removeEventListener('click', this.handleClickOutside)
    }

    onSuggestSelect(location) {
        let {profile} = this.state;
        profile.location = location;
        this.setState({
            profile: profile
        });
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

    render() {
        const {user, profile, metadata, filters, tags} = this.props;
        const imgSrc = this.props.user ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={'Editar perfil'} leftText={'Cancelar'} />
                <div className="page">
                    <div id="page-content">
                        <div className = "user-block">
                            <div className="user-image">
                                <img src={imgSrc}/>
                            </div>
                        </div>
                        {
                            profile && metadata && filters ? Object.keys(profile).map(profileName => {
                                let data = profile[profileName];
                                const selected = this.state.selectedFilter === profileName;
                                if (metadata[profileName].editable === false){
                                    return '';
                                }
                                switch (metadata[profileName]['type']) {
                                    case 'choice':
                                        return <ChoiceEdit   key={profileName} filterKey={profileName}
                                                             ref={selected ? 'selectedFilter' : ''}
                                                             metadata={metadata[profileName]}
                                                             data={data ? data : ''}
                                                             selected={selected}
                                                             handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                             handleChangeFilter={this.handleChangeFilterAndUnSelect}
                                                             handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'integer':
                                        return <IntegerEdit   key={profileName} filterKey={profileName}
                                                              ref={selected ? 'selectedFilter' : ''}
                                                              metadata={metadata[profileName]}
                                                              data={data ? parseInt(data) : 0}
                                                              selected={selected}
                                                              handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                              handleChangeFilter={this.handleChangeFilter}
                                                              handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'location':
                                        return <LocationEdit   key={profileName} filterKey={profileName} ref={selected ? 'selectedFilter' : ''}
                                                               metadata = {metadata[profileName]}
                                                               data={data ? data : {}}
                                                               selected={selected}
                                                               handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                               handleChangeFilter={this.handleChangeFilterAndUnSelect}
                                                               handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'tags_and_choice':
                                        return <TagsAndChoiceEdit   key={profileName} filterKey={profileName} ref={selected ? 'selectedFilter' : ''}
                                                                    metadata = {metadata[profileName]}
                                                                    data={data ? data : []}
                                                                    selected={selected}
                                                                    handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                    handleChangeFilter={this.handleChangeFilter}
                                                                    handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'multiple_choices':
                                        return <MultipleChoicesEdit key={profileName} filterKey={profileName} ref={selected ? 'selectedFilter' : ''}
                                                                 metadata={metadata[profileName]}
                                                                 data={data ? data : []}
                                                                 selected={selected}
                                                                 handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                 handleChangeFilter={this.handleChangeFilter}
                                                                 handleClickFilter={this.handleClickFilter}
                                            />;
                                    case 'double_choice':
                                        return <DoubleChoiceEdit key={profileName} filterKey={profileName} ref={selected ? 'selectedFilter' : ''}
                                                                    metadata={metadata[profileName]}
                                                                    data={data ? data : {}}
                                                                    selected={selected}
                                                                    handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                    handleChangeFilter={this.handleChangeFilter}
                                                                    handleChangeFilterDetail={this.handleChangeFilterAndUnSelect}
                                                                    handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'tags':
                                        return <TagEdit key={profileName} filterKey={profileName} ref={selected ? 'selectedFilter' : ''}
                                                                    metadata={metadata[profileName]}
                                                                    data={data ? data : []}
                                                                    selected={selected}
                                                                    handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                    handleChangeFilter={this.handleChangeFilterAndUnSelect}
                                                                    handleClickFilter={this.handleClickFilter}
                                                                    tags={tags}
                                        />;
                                    default:
                                        return '';
                                }
                            }):''
                        }
                        {
                            profile && metadata && filters ? Object.keys(metadata).map(metadataName => {
                                let metadataField = metadata[metadataName];
                                const selected = this.state.selectedFilter === metadataName;
                                if (profile.hasOwnProperty(metadataName) || metadataField.editable === false){
                                    return '';
                                }
                                switch (metadataField['type']) {
                                    case 'choice':
                                        return <ChoiceEdit   key={metadataName} filterKey={metadataName}
                                                             ref={selected ? 'selectedFilter' : ''}
                                                             metadata={metadata[metadataName]}
                                                             data={''}
                                                             selected={selected}
                                                             handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                             handleChangeFilter={this.handleChangeFilterAndUnSelect}
                                                             handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'integer':
                                        return <IntegerEdit key={metadataName} filterKey={metadataName}
                                                            ref={selected ? 'selectedFilter' : ''}
                                                            metadata={metadata[metadataName]}
                                                            data={0}
                                                            selected={selected}
                                                            handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                            handleChangeFilter={this.handleChangeFilter}
                                                            handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'location':
                                        return <LocationEdit key={metadataName} filterKey={metadataName} ref={selected ? 'selectedFilter' : ''}
                                                             metadata = {metadata[metadataName]}
                                                             data={{}}
                                                             selected={selected}
                                                             handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                             handleChangeFilter={this.handleChangeFilterAndUnSelect}
                                                             handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'tags_and_choice':
                                        return <TagsAndChoiceEdit   key={metadataName} filterKey={metadataName} ref={selected ? 'selectedFilter' : ''}
                                                                    metadata = {metadata[metadataName]}
                                                                    data={[]}
                                                                    selected={selected}
                                                                    handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                    handleChangeFilter={this.handleChangeFilter}
                                                                    handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'multiple_choices':
                                        return <MultipleChoicesEdit key={metadataName} filterKey={metadataName} ref={selected ? 'selectedFilter' : ''}
                                                                   metadata={metadata[metadataName]}
                                                                   data={[]}
                                                                   selected={selected}
                                                                   handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                   handleChangeFilter={this.handleChangeFilter}
                                                                   handleClickFilter={this.handleClickFilter}
                                            />;
                                    case 'double_choice':
                                        return <DoubleChoiceEdit key={metadataName} filterKey={metadataName} ref={selected ? 'selectedFilter' : ''}
                                                                    metadata={metadata[metadataName]}
                                                                    data={{}}
                                                                    selected={selected}
                                                                    handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                    handleChangeFilter={this.handleChangeFilter}
                                                                    handleChangeFilterDetail={this.handleChangeFilterAndUnSelect}
                                                                    handleClickFilter={this.handleClickFilter}
                                        />;
                                    case 'tags':
                                        return <TagEdit key={metadataName} filterKey={metadataName} ref={selected ? 'selectedFilter' : ''}
                                                                 metadata={metadata[metadataName]}
                                                                 data={[]}
                                                                 selected={selected}
                                                                 handleClickRemoveFilter={this.handleClickRemoveFilter}
                                                                 handleChangeFilter={this.handleChangeFilterAndUnSelect}
                                                                 handleClickFilter={this.handleClickFilter}
                                                                 tags={tags}
                                        />;
                                    default:
                                        return '';
                                }
                            }):''
                        }
                    </div>
                </div>
            </div>
        );
    }
};
