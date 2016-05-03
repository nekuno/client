import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import ProfileStore from '../stores/ProfileStore';
import FilterStore from '../stores/FilterStore';
import ChoiceFilter from '../components/threads/filters/ChoiceFilter';
import IntegerFilter from '../components/threads/filters/IntegerFilter';
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

    return {
        profile,
        metadata,
        filters
    };
}

@AuthenticatedComponent
@connectToStores([ProfileStore, FilterStore], getState)
export default class EditProfilePage extends Component {
    static propTypes = {
        profile: PropTypes.object,
        metadata: PropTypes.object,
        filters: PropTypes.object,
        user: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            profile: {}
        };

        this.onSuggestSelect = this.onSuggestSelect.bind(this);
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

    onSuggestSelect(location) {
        let profile = this.state.profile;
        profile.location = location;
        this.setState({
            profile: profile
        });
    }

    render() {
        const {user, profile, metadata, filters} = this.props;
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
                                console.log(this);
                                let data = profile[profileName];
                                let selected = false;
                                let key = profileName;
                                switch (metadata[profileName]['type']) {
                                    case 'choice':
                                        return <ChoiceFilter key={key} filterKey={key}
                                                             ref={selected ? 'selectedFilter' : ''}
                                                             filter={metadata[profileName]}
                                                             data={data}
                                                             selected={selected}
                                                             handleClickRemoveFilter={function(){}}
                                                             handleChangeFilter={function(){}}
                                                             handleClickFilter={function(){}}
                                        />;
                                    case 'integer':
                                        return <IntegerFilter key={key} filterKey={key}
                                                              ref={selected ? 'selectedFilter' : ''}
                                                              filter={metadata[profileName]}
                                                              data={parseInt(data)}
                                                              selected={selected}
                                                              handleClickRemoveFilter={function(){}}
                                                              handleChangeFilter={function(){}}
                                                              handleClickFilter={function(){}}
                                        />;
                                    case 'location':
                                        return <LocationInput key={key} placeholder={data.address} onSuggestSelect={this.onSuggestSelect}
                                            />;
                                    default:
                                        return '';
                                }
                            }) : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
};
