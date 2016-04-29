import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import User from '../components/User';
import ProfileDataList from '../components/profile/ProfileDataList'
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import StatsStore from '../stores/StatsStore';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const {user} = props;
    const userId = parseId(user);

    UserActionCreators.requestUser(userId, ['username', 'email', 'picture', 'status']);
    UserActionCreators.requestProfile(userId);
    UserActionCreators.requestMetadata();
    UserActionCreators.requestStats(userId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user} = props;
    const userId = parseId(user);
    const profile = ProfileStore.getWithMetadata(userId);
    const stats = StatsStore.get(userId);

    return {
        user,
        profile,
        stats
    };
}

@AuthenticatedComponent
@translate('UserPage')
@connectToStores([UserStore, ProfileStore, StatsStore], getState)
export default class UserPage extends Component {
    static propTypes = {
        // Injected by @AuthenticatedComponent
        user    : PropTypes.object,
        // Injected by @translate:
        strings : PropTypes.object,
        // Injected by @connectToStores:
        stats   : PropTypes.object,
        profile: PropTypes.object

    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        const {user, profile, stats, strings} = this.props;
        const picture = user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={strings.myProfile}/>
                <div className="page user-page">
                    {profile && stats ?
                        <div id="page-content">
                            <User user={user} profile={profile}/>
                            <div className="user-interests">
                                <div className="number">
                                    {stats.numberOfContentLikes || 0}
                                </div>
                                <div className="label">{strings.interests}</div>
                            </div>
                            <ProfileDataList profile={profile}/>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                        : ''}
                </div>
                {profile && stats ?
                    <ToolBar links={[
                    {'url': '/profile', 'text': strings.aboutMe},
                    {'url': '/questions', 'text': strings.questions},
                    {'url': '/interests', 'text': strings.interests}]} activeLinkIndex={0}/> 
                    : ''}
            </div>
        );
    }
};

UserPage.defaultProps = {
    strings: {
        aboutMe   : 'About me',
        questions : 'Answers',
        interests : 'Interests',
        myProfile : 'My profile'
    }
};