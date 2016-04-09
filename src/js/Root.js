import React, { PropTypes, Component } from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import HomePage from './pages/HomePage';
import ChatThreadsPage from './pages/ChatThreadsPage';
import ChatMessagesPage from './pages/ChatMessagesPage';
import InterestsPage from './pages/InterestsPage';
import OtherInterestsPage from './pages/OtherInterestsPage';
import QuestionsPage from './pages/QuestionsPage';
import OtherQuestionsPage from './pages/OtherQuestionsPage';
import AnswerQuestionPage from './pages/AnswerQuestionPage';
import QuestionStatsPage from './pages/QuestionStatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterJoinPage from './pages/RegisterJoinPage';
import RegisterQuestionsLandingPage from './pages/RegisterQuestionLandingPage';
import UserPage from './pages/UserPage';
import ThreadPage from './pages/ThreadPage';
import RecommendationPage from './pages/RecommendationPage';
import ConnectSocialNetworksOnSignUpPage from './pages/ConnectSocialNetworksOnSignUpPage';
import ConnectSocialNetworksPage from './pages/ConnectSocialNetworksPage';
import CreateThreadPage from './pages/CreateThreadPage';

export default class Root extends Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    render() {
        const { history } = this.props;
        return (
            <Router history={history}>
                <Route name="home" path="/" component={App}>
                    <Route name="splash" path="/splash" component={HomePage}/>
                    <Route name="notifications" path="/conversations" component={ChatThreadsPage}/>
                    <Route name="messages" path="/conversations/:userId" component={ChatMessagesPage}/>
                    <Route name="interests" path="/interests" component={InterestsPage}/>
                    <Route name="other-interests" path="/users/:userId/other-interests" component={OtherInterestsPage}/>
                    <Route name="questions" path="/questions" component={QuestionsPage}/>
                    <Route name="other-questions" path="/users/:userId/other-questions" component={OtherQuestionsPage}/>
                    <Route name="answer-question" path="/answer-question/:questionId" component={AnswerQuestionPage}/>
                    <Route name="answer-question-next" path="/answer-question/next" component={AnswerQuestionPage}/>
                    <Route name="question-stats" path="/question-stats" component={QuestionStatsPage}/>
                    <Route name="login" path="/login" component={LoginPage}/>
                    <Route name="register" path="/register" component={RegisterPage}/>
                    <Route name="join" path="/join" component={RegisterJoinPage}/>
                    <Route name="register-questions-landing" path="/register-questions-landing" component={RegisterQuestionsLandingPage}/>
                    <Route name="profile" path="/profile/:userId" component={UserPage}/>
                    <Route name="threads" path="/threads/:userId" component={ThreadPage}/>
                    <Route name="recommendations" path="/users/:userId/recommendations/:threadId" component={RecommendationPage}/>
                    <Route name="social-networks-on-sign-up" path="/social-networks-on-sign-up" component={ConnectSocialNetworksOnSignUpPage}/>
                    <Route name="social-networks" path="/social-networks" component={ConnectSocialNetworksPage}/>
                    <Route name="create-thread" path="/create-thread" component={CreateThreadPage}/>
                </Route>
            </Router>
        );
    }
}