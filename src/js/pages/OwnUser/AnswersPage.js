import PropTypes from 'prop-types';
import React, { Component } from 'react';
import '../../../scss/pages/own-user/answers.scss';
import translate from '../../i18n/Translate';
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import UserStore from "../../stores/UserStore";
import QuestionStore from "../../stores/QuestionStore";
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import Button from "../../components/ui/Button/Button";
import RoundedImage from "../../components/ui/RoundedImage/RoundedImage";
import * as QuestionActionCreators from "../../actions/QuestionActionCreators";
import Scroll from "../../components/Scroll/Scroll";
import EmptyMessage from "../../components/ui/EmptyMessage/EmptyMessage";
import OwnUserBottomNavBar from "../../components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar";
import RoundedIcon from "../../components/ui/RoundedIcon/RoundedIcon";
import RouterStore from '../../stores/RouterStore';

function requestData(props) {
    const userId = props.user.id;
    const questionsUrl = QuestionStore.getRequestQuestionsUrl(userId);
    QuestionActionCreators.requestQuestions(userId, questionsUrl);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const userQuestions = props.user ? QuestionStore.get(props.user.id) : null;
    const isLoadingOwnQuestions = QuestionStore.isLoadingOwnQuestions();
    const requestQuestionsUrl = QuestionStore.getRequestQuestionsUrl(props.user.id, []);
    const questionsTotal = QuestionStore.ownAnswersLength(props.user.id);

    const routes = RouterStore._routes;

    return {
        userQuestions,
        isLoadingOwnQuestions,
        requestQuestionsUrl,
        questionsTotal,
        routes,
    };
}

@AuthenticatedComponent
@translate('OwnUserAnswersPage')
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswersPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                      : PropTypes.object.isRequired,
        // Injected by React Router:
        params                 : PropTypes.shape({
            slug: PropTypes.string,
        }),
        // Injected by @translate:
        strings                   : PropTypes.object,
        // Injected by @connectToStores:
        userQuestions             : PropTypes.object,
        isLoadingOwnQuestions     : PropTypes.bool,
        requestQuestionsUrl       : PropTypes.string,
        routes   : PropTypes.array,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onAnswerTest = this.onAnswerTest.bind(this);
        this.firstItems = this.firstItems.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    getQuestions() {
        const {user, strings, userQuestions, isLoadingOwnQuestions} = this.props;

        const questionComponents = Object.keys(userQuestions).map((question, questionIndex) =>
            <div key={questionIndex} className="user-question-card">
                <h3>{userQuestions[question].question.text}</h3>
                {userQuestions[question].question.answers.map((answer, answerIndex) =>
                    <div key={answerIndex}>
                        {userQuestions[question].userAnswer.acceptedAnswers.map((acceptedAnswer, acceptedAnswerIndex) =>
                            <div key={acceptedAnswerIndex}>
                                {acceptedAnswer === answer.answerId ?
                                <div className="user-question-card-answer">
                                    <div className="photo">
                                        {userQuestions[question].userAnswer.answerId === answer.answerId ?
                                            <RoundedImage size={'x-small'} url={user.photo.thumbnail.small}/>
                                            :
                                            <div className="icon-nekuno-wrapper">
                                                <RoundedIcon icon={'nekuno'} size={'small'} background={'#615acb'}/>
                                            </div>
                                        }

                                    </div>
                                    <div className="answer">
                                        {answer.text}
                                    </div>
                                </div>
                                : null
                                }
                            </div>
                        )}
                    </div>
                )}
                {userQuestions[question].userAnswer.isEditable ?
                    <div className="edit-answer">{strings.editAnswer}</div>
                    : null
                }
            </div>
        );
        return isLoadingOwnQuestions && questionComponents.length === 0 ?
            [<div key="empty-message"><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
            : questionComponents;
    }

    onAnswerTest() {
        this.context.router.push('/answer-question/next');
    }

    firstItems() {
        const {strings, questionsTotal} = this.props;

        return [
            <div className={"first-items"}>
                <div className="user-answer-presentation-card">
                    <div className="user-answer-presentation-card-title">
                        <img src="https://dummyimage.com/75x75/000/fff"/>
                        <h2>{strings.myAnswersTitle}</h2>
                    </div>
                    <div className="user-answer-presentation-card-description">{strings.myAnswersDescription}</div>
                    <div className="user-answer-presentation-card-button">
                        <Button textAlign={'left'} size={'small'} backgroundColor={'#928bff'} onClickHandler={this.onAnswerTest}>
                            {strings.myAnswersButton}
                        </Button>
                    </div>
                </div>
                <h3>{strings.answeredQuestions.replace("%questionsTotal%", questionsTotal)}</h3>
            </div>
        ]
    }

    onBottomScroll() {
        const {user, requestQuestionsUrl, isLoadingOwnQuestions} = this.props;

        if (isLoadingOwnQuestions || !requestQuestionsUrl) {
            return Promise.resolve();
        }
        return QuestionActionCreators.requestQuestions(user.id, requestQuestionsUrl);
    }

    goBack(routes) {
        const regex = /^(\/p\/.*)*(\/networks)*(\/friends)*(\/answers)*(\/interests)*$/
        const next = routes.reverse().find((route) => {
            return !regex.test(route)
        })

        this.context.router.push(next || '');
    }

    render() {
        const {strings, userQuestions, isLoadingOwnQuestions, routes} = this.props;

        return (
            <div className={"user-answers-view"}>
                <TopNavBar
                    background={'FFFFFF'}
                    iconLeft="arrow-left"
                    onLeftLinkClickHandler={() => this.goBack(routes)}
                    textCenter={strings.topNavBarText}
                    textSize={'small'}/>
                <div id={"user-answers-view"} className={"user-answers-view-wrapper"}>
                    {userQuestions ?
                        <Scroll
                            items={this.getQuestions()}
                            firstItems={this.firstItems()}
                            onLoad={this.onBottomScroll}
                            containerId="user-answers-view"
                            loading={isLoadingOwnQuestions}
                            columns={1}
                        />
                        : null
                    }
                </div>
                <OwnUserBottomNavBar current={"answers"}/>
            </div>
        );
    }
}

AnswersPage.defaultProps = {
    strings: {
        topNavBarText        : 'My answers',
        myAnswersTitle       : 'We want to know you better!',
        myAnswersDescription : 'The more questions about your personality you answer, the better recommendations we can make.',
        myAnswersButton      : 'Answer the test',
        answeredQuestions    : 'You have answered %questionsTotal% of 100 questions',
        editAnswer           : 'Edit answer',
    }
};