import React, { PropTypes, Component } from 'react';
import User from '../components/User';
import ProfileDataList from '../components/profile/ProfileDataList'
import ShareProfileBanner from '../components/user/ShareProfileBanner';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import StatsStore from '../stores/StatsStore';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData() {
    ThreadActionCreators.requestFilters();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user} = props;
    const userId = parseId(user);
    const profile = ProfileStore.get(userId);
    const errors = ProfileStore.getErrors(userId);
    const profileWithMetadata = ProfileStore.getWithMetadata(userId);
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

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        if (this.props.errors) {
            nekunoApp.alert(this.props.errors);
        }
    }

    render() {
        const {user, profile, metadata, profileWithMetadata, stats, strings} = this.props;
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.aboutMe},
                    {'url': '/gallery', 'text': strings.photos},
                    {'url': '/questions', 'text': strings.questions},
                    {'url': '/interests', 'text': strings.interests}]} activeLinkIndex={0} arrowUpLeft={'10%'}/>
                <div className="view view-main">
                    <div className="page user-page">
                        {profile && metadata && stats ?
                            <div id="page-content">
                                <User user={user} profile={profile} onClick={() => this.context.router.push(`/gallery`)}/>
                                <div className="user-interests">
                                    <div className="number">
                                        {stats.numberOfContentLikes || 0}
                                    </div>
                                    <div className="label">{strings.interests}</div>
                                </div>
                                <ShareProfileBanner user={user}/>
                                <ProfileDataList profile={profile} metadata={metadata} profileWithMetadata={profileWithMetadata}/>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
};

UserPage.defaultProps = {
    strings: {
        aboutMe  : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests',
        myProfile: 'My profile'
    }
};