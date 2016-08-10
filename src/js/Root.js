import React, { PropTypes, Component } from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import HomePage from './pages/HomePage';
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
import QuestionStatsPage from './pages/QuestionStatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterQuestionsLandingPage from './pages/RegisterQuestionLandingPage';
import AnswerUserFieldPage from './pages/AnswerUserFieldPage';
import AnswerProfileFieldPage from './pages/AnswerProfileFieldPage';
import UserPage from './pages/UserPage';
import EditProfilePage from './pages/EditProfilePage';
import OtherUserPage from './pages/OtherUserPage';
import ThreadPage from './pages/ThreadPage';
import RecommendationPage from './pages/RecommendationPage';
import InvitationsPage from './pages/InvitationsPage';
import ConnectSocialNetworksOnSignUpPage from './pages/ConnectSocialNetworksOnSignUpPage';
import ConnectSocialNetworksPage from './pages/ConnectSocialNetworksPage';
import CreateThreadPage from './pages/CreateThreadPage';
import EditThreadPage from './pages/EditThreadPage';
import RouterActionCreators from './actions/RouterActionCreators';
import LoginStore from './stores/LoginStore';

function requireAuth(nextState, replaceState) {

    if (!LoginStore.isLoggedIn()) {
        let transitionPath = nextState.location.pathname;
        RouterActionCreators.storeRouterTransitionPath(transitionPath);
        console.log('Unauthorized path ', transitionPath, ' stored, redirecting to login now...');
        replaceState({nextPathname: nextState.location.pathname}, '/login')
    }
}

export default class Root extends Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    render() {
        const {history} = this.props;
        return (
            <Router history={history}>
                <Route name="home" path="/" component={App}>

                    <Route name="splash" path="/splash" component={HomePage}/>
                    <Route name="login" path="/login" component={LoginPage}/>
                    <Route name="register" path="/register" component={RegisterPage}/>

                    <Route onEnter={requireAuth}>
                        <Route name="register-questions-landing" path="/register-questions-landing" component={RegisterQuestionsLandingPage}/>
                        <Route name="answer-user-fields" path="/answer-user-fields" component={AnswerUserFieldPage}/>
                        <Route name="answer-profile-fields" path="/answer-profile-fields" component={AnswerProfileFieldPage}/>
                        <Route name="notifications" path="/conversations" component={ChatThreadsPage}/>
                        <Route name="messages" path="/conversations/:userId" component={ChatMessagesPage}/>
                        <Route name="interests" path="/interests" component={InterestsPage}/>
                        <Route name="other-interests" path="/users/:userId/other-interests" component={OtherInterestsPage}/>
                        <Route name="gallery" path="/gallery" component={GalleryPage}/>
                        <Route name="other-gallery" path="/users/:userId/other-gallery" component={OtherGalleryPage}/>
                        <Route name="gallery-photo" path="/gallery-photo" component={GalleryPhotoPage}/>
                        <Route name="other-gallery-photo" path="/users/:userId/other-gallery-photo" component={OtherGalleryPhotoPage}/>
                        <Route name="gallery-profile-photo" path="/gallery-profile-photo" component={GalleryProfilePhotoPage}/>
                        <Route name="gallery-albums" path="/gallery-albums" component={GalleryAlbumsPage}/>
                        <Route name="gallery-album-photos" path="/gallery-album-photos" component={GalleryAlbumPhotosPage}/>
                        <Route name="questions" path="/questions" component={QuestionsPage}/>
                        <Route name="other-questions" path="/users/:userId/other-questions" component={OtherQuestionsPage}/>
                        <Route name="answer-question" path="/answer-question/:questionId" component={AnswerQuestionPage}/>
                        <Route name="answer-question-next" path="/answer-question/next" component={AnswerQuestionPage}/>
                        <Route name="question-stats" path="/question-stats" component={QuestionStatsPage}/>
                        <Route name="profile" path="/profile" component={UserPage}/>
                        <Route name="edit-profile" path="/edit-profile" component={EditProfilePage}/>
                        <Route name="other-profile" path="/profile/:userId" component={OtherUserPage}/>
                        <Route name="invitations" path="/invitations" component={InvitationsPage}/>
                        <Route name="threads" path="/threads" component={ThreadPage}/>
                        <Route name="recommendations" path="/users/:userId/recommendations/:threadId" component={RecommendationPage}/>
                        <Route name="social-networks-on-sign-up" path="/social-networks-on-sign-up" component={ConnectSocialNetworksOnSignUpPage}/>
                        <Route name="social-networks" path="/social-networks" component={ConnectSocialNetworksPage}/>
                        <Route name="create-thread" path="/create-thread" component={CreateThreadPage}/>
                        <Route name="edit-thread" path="/edit-thread/:threadId" component={EditThreadPage}/>
                    </Route>
                </Route>
            </Router>
        );
    }
}