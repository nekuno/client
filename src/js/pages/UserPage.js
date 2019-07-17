import PropTypes from 'prop-types';
import React, { Component } from 'react';
import User from '../components/User';
import ProfileDataList from '../components/profile/ProfileDataList'
import ShareProfileBanner from '../components/user/ShareProfileBanner';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar/';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import StatsStore from '../stores/StatsStore';
import Framework7Service from '../services/Framework7Service';
import AboutMeCategory from "../components/profile/AboutMeCategory/AboutMeCategory";
import NaturalCategory from "../components/profile/NaturalCategory/NaturalCategory";
import Button from "../components/ui/Button";

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    ThreadActionCreators.requestFilters();
    if (!props.profile && props.user.slug) {
        UserActionCreators.requestOwnProfile(props.user.slug);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user} = props;
    const userId = parseId(user);
    const profile = ProfileStore.get(user.slug);
    const errors = ProfileStore.getErrors(userId);
    const profileWithMetadata = ProfileStore.getWithMetadata(user.slug);
    const metadata = ProfileStore.getMetadata();
    const stats = StatsStore.stats;

    return {
        user,
        profile,
        errors,
        profileWithMetadata,
        metadata,
        stats
    };
}

@AuthenticatedComponent
@translate('UserPage')
@connectToStores([UserStore, ProfileStore, StatsStore], getState)
export default class UserPage extends Component {
    static propTypes = {
        // Injected by @AuthenticatedComponent
        user               : PropTypes.object,
        // Injected by @translate:
        strings            : PropTypes.object,
        // Injected by @connectToStores:
        stats              : PropTypes.object,
        profile            : PropTypes.object,
        errors             : PropTypes.string,
        profileWithMetadata: PropTypes.array,
        metadata           : PropTypes.object,

    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
        };

        this.getNatural = this.getNatural.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        if (this.props.errors) {
            Framework7Service.nekunoApp().alert(this.props.errors);
        }
    }

    getNatural() {
        const {profile, strings} = this.props;
        const natural = profile.naturalProfile;

        const categories = Object.keys(natural).map((type) => {
            const text = natural[type];
            return <div key={type}>
                {
                    type === 'About Me' ?
                        <AboutMeCategory text={text}/>
                        :
                        <NaturalCategory category={type} text={text}/>
                }
            </div>

        });

        let editButton = <div className='edit-profile-button'><Button key='editButton' onClick={this.toggleEditMode} >
            <span> {strings.editProfile} </span>
        </Button></div>;

        categories.push(editButton);

        return categories;
    }

    toggleEditMode() {
        const {editMode} = this.state;

        this.setState({editMode: !editMode})
    }

    render() {
        const {user, profile, metadata, profileWithMetadata, stats, strings} = this.props;
        const {editMode} = this.state;
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.about, 'icon': 'account'},
                    {'url': '/gallery', 'text': strings.photos, 'icon': 'camera'},
                    {'url': '/questions', 'text': strings.questions, 'icon': 'comment-question'},
                    {'url': '/interests', 'text': strings.interests, 'icon': 'thumbs-up-down'},
                ]} activeLinkIndex={0} arrowUpLeft={'10%'}/>
                <div className="view view-main">
                    <div className="page user-page">
                        {profile && metadata && stats ?
                            <div id="page-content" className="with-tab-bar">
                                <User user={user} profile={profile} onClick={() => this.context.router.push(`/gallery`)}/>
                                <div className="user-interests">
                                    <div className="number">
                                        {stats.numberOfContentLikes || 0}
                                    </div>
                                    <div className="label">{strings.interests}</div>
                                </div>
                                <ShareProfileBanner user={user}/>
                                {editMode ?
                                    <ProfileDataList profile={profile} metadata={metadata} profileWithMetadata={profileWithMetadata} ownUser={user}/>
                                    :
                                    this.getNatural()
                                }
                            </div>
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
}

UserPage.defaultProps = {
    strings: {
        aboutMe  : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests',
        myProfile: 'My profile',
        editProfile: 'Edit profile'
    }
};