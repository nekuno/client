import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';

import App from './App';
import HomePage from './pages/HomePage';
import AnswerUsernamePage from './pages/AnswerUsernamePage';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';
import ProfessionalProfileIndustryPage from './pages/ProfessionalProfileIndustryPage';
import LeisureProfilePage from './pages/LeisureProfilePage';
import ExplorerProfilePage from './pages/ExplorerProfilePage';
import AvailabilityPage from './pages/AvailabilityPage';
import ExplorePage from './pages/ExplorePage';
import ChatThreadsPage from './pages/ChatThreadsPage';
import ChatMessagesPage from './pages/ChatMessagesPage';
import InterestsPage from './pages/InterestsPage';
import GalleryPage from './pages/GalleryPage';
import OtherGalleryPage from './pages/OtherGalleryPage';
import GalleryPhotoPage from './pages/GalleryPhotoPage';
import OtherGalleryPhotoPage from './pages/OtherGalleryPhotoPage';
import GalleryProfilePhotoPage from './pages/GalleryProfilePhotoPage';
import GalleryAlbumsPage from './pages/GalleryAlbumsPage';
import GalleryAlbumPhotosPage from './pages/GalleryAlbumPhotosPage';
import OtherInterestsPage from './pages/OtherInterestsPage';
import QuestionsPage from './pages/QuestionsPage';
import OtherQuestionsPage from './pages/OtherQuestionsPage';
import AnswerQuestionPage from './pages/AnswerQuestionPage';
import AnswerNextQuestionPage from './pages/AnswerNextQuestionPage';
import AnswerNextOtherQuestionPage from './pages/AnswerNextOtherQuestionPage';
import QuestionStatsPage from './pages/QuestionStatsPage';
import QuestionEditedStatsPage from './pages/QuestionEditedStatsPage';
import QuestionOtherStatsPage from './pages/QuestionOtherStatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterQuestionsLandingPage from './pages/RegisterQuestionLandingPage';
import AnswerUserFieldPage from './pages/AnswerUserFieldPage';
import AnswerProfileFieldPage from './pages/AnswerProfileFieldPage';
import UserPage from './pages/UserPage';
import OtherUserPage from './pages/OtherUserPage';
import SharedUserPage from './pages/SharedUserPage';
import ProfilePage from './pages/ProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import RecommendationPage from './pages/RecommendationPage';
import InvitationsPage from './pages/InvitationsPage';
import ConnectSocialNetworksOnSignUpPage from './pages/ConnectSocialNetworksOnSignUpPage';
import ConnectSocialNetworksPage from './pages/ConnectSocialNetworksPage';
import CreateThreadPage from './pages/CreateThreadPage';
import EditThreadLitePage from './pages/EditThreadLitePage';
import GroupPage from './pages/GroupPage';
import GroupStatsPage from './pages/GroupStatsPage';
import GroupMembersPage from './pages/GroupMembersPage';
import GroupContentsPage from './pages/GroupContentsPage';
import SettingsPage from './pages/SettingsPage';
import RouterActionCreators from './actions/RouterActionCreators';
import LoginStore from './stores/LoginStore';

function requireAuth(nextState, replaceState) {

    if (!LoginStore.isLoggedIn()) {
        let transitionPath = nextState.location.pathname;
        RouterActionCreators.storeRouterTransitionPath(transitionPath);
        console.log('Unauthorized path ', transitionPath, ' stored, redirecting to login now...');
        replaceState({nextPathname: nextState.location.pathname}, '/')
    }
}

export default class Root extends Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    render() {
        const {history} = this.props;
        return (
            <Router history={history} render={applyRouterMiddleware(useScroll())}>
                <Route name="home" path="/" component={App}>

                    <Route name="splash" path="/splash" component={HomePage}/>
                    <Route name="answer-username" path="/answer-username" component={AnswerUsernamePage}/>
                    <Route name="professional-profile" path="/professional-profile" component={ProfessionalProfilePage}/>
                    <Route name="professional-profile-industry" path="/professional-profile-industry" component={ProfessionalProfileIndustryPage}/>
                    <Route name="leisure-profile" path="/leisure-profile" component={LeisureProfilePage}/>
                    <Route name="explorer-profile" path="/explorer-profile" component={ExplorerProfilePage}/>
                    <Route name="availability" path="/availability" component={AvailabilityPage}/>
                    <Route name="login" path="/login" component={LoginPage}/>
                    <Route name="register" path="/register" component={RegisterPage}/>
                    <Route name="shared-user" path="/p/:slug" component={ProfilePage}/>

                    <Route onEnter={requireAuth}>
                        <Route name="explore" path="/explore" component={ExplorePage}/>
                        <Route name="register-questions-landing" path="/register-questions-landing" component={RegisterQuestionsLandingPage}/>
                        <Route name="answer-user-fields" path="/answer-user-fields" component={AnswerUserFieldPage}/>
                        <Route name="answer-profile-fields" path="/answer-profile-fields" component={AnswerProfileFieldPage}/>
                        <Route name="notifications" path="/conversations" component={ChatThreadsPage}/>
                        <Route name="messages" path="/conversations/:slug" component={ChatMessagesPage}/>
                        <Route name="interests" path="/interests" component={InterestsPage}/>
                        <Route name="other-interests" path="/users/:slug/other-interests" component={OtherInterestsPage}/>
                        <Route name="gallery" path="/gallery" component={GalleryPage}/>
                        <Route name="other-gallery" path="/users/:slug/other-gallery/:photoId" component={OtherGalleryPage}/>
                        <Route name="gallery-photo" path="/gallery-photo" component={GalleryPhotoPage}/>
                        <Route name="other-gallery-photo" path="/users/:userId/other-gallery-photo" component={OtherGalleryPhotoPage}/>
                        <Route name="gallery-profile-photo" path="/gallery-profile-photo" component={GalleryProfilePhotoPage}/>
                        <Route name="gallery-albums" path="/gallery-albums" component={GalleryAlbumsPage}/>
                        <Route name="gallery-album-photos" path="/gallery-album-photos" component={GalleryAlbumPhotosPage}/>
                        <Route name="questions" path="/questions" component={QuestionsPage}/>
                        <Route name="other-questions" path="/users/:slug/other-questions" component={OtherQuestionsPage}/>
                        <Route name="answer-question" path="/answer-question/:questionId/:from" component={AnswerQuestionPage}/>
                        <Route name="answer-question-next" path="/answer-question/next" component={AnswerNextQuestionPage}/>
                        <Route name="answer-other-question-next" path="/answer-other-question/:slug/next" component={AnswerNextOtherQuestionPage}/>
                        <Route name="question-stats" path="/question-stats" component={QuestionStatsPage}/>
                        <Route name="question-stats-from" path="/question-stats/:from" component={QuestionEditedStatsPage}/>
                        <Route name="question-stats-other" path="/question-other-stats/:slug" component={QuestionOtherStatsPage}/>
                        <Route name="invitations" path="/invitations" component={InvitationsPage}/>
                        <Route name="discover" path="/discover" component={DiscoverPage}/>
                        <Route name="recommendations" path="/recommendations/:threadId" component={RecommendationPage}/>
                        <Route name="social-networks-on-sign-up" path="/social-networks-on-sign-up" component={ConnectSocialNetworksOnSignUpPage}/>
                        <Route name="social-networks" path="/social-networks" component={ConnectSocialNetworksPage}/>
                        <Route name="create-thread" path="/create-thread" component={CreateThreadPage}/>
                        <Route name="edit-thread" path="/edit-thread/:threadId" component={EditThreadLitePage}/>
                        <Route name="groups" path="/badges" component={GroupPage}/>
                        <Route name="group-discover" path="/badges/:groupId/discover" component={DiscoverPage}/>
                        {/*<Route name="group-stats" path="/badges/:groupId" component={GroupStatsPage}/>
                        <Route name="group-members" path="/badges/:groupId/members" component={GroupMembersPage}/>
                        <Route name="group-contents" path="/badges/:groupId/contents" component={GroupContentsPage}/>*/}
                        <Route name="settings" path="/settings" component={SettingsPage}/>
                    </Route>
                </Route>
            </Router>
        );
    }
}