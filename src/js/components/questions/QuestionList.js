import React, { PropTypes, Component } from 'react';
import Question from './Question';
import InfiniteScroll from "../scroll/InfiniteScroll";

export default class QuestionList extends Component {
    static propTypes = {
        questions            : PropTypes.object.isRequired,
        ownPicture           : PropTypes.string.isRequired,
        defaultPicture       : PropTypes.string.isRequired,
        userSlug             : PropTypes.string.isRequired,
        onTimerEnd           : PropTypes.func,
        isLoadingOwnQuestions: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);

        this.state = {
            graphDisplayQuestionId: null
        };
    }

    onClickHandler(questionId) {
        this.setState({
            graphDisplayQuestionId: questionId
        });
    }

    getQuestions() {
        const {questions, userSlug, ownPicture, defaultPicture, onTimerEnd} = this.props;

        const questionComponents = Object.keys(questions).map((questionId, index) =>
            <Question userSlug={userSlug}
                      userAnswer={questions[questionId].userAnswer}
                      ownPicture={ownPicture}
                      defaultPicture={defaultPicture}
                      key={index}
                      accessibleKey={index}
                      question={questions[questionId]}
                      last={index == questions.length}
                      onClickHandler={this.onClickHandler}
                      onTimerEnd={onTimerEnd}
                      graphActive={this.state.graphDisplayQuestionId == questionId}
            />);
        return <div className="question-list">
            {questionComponents}
        </div>
            ;
    }

    getItems() {
        const firstItems = this.props.firstItems;
        const questions = this.getQuestions.bind(this)();
        return [
            ...firstItems,
            questions
        ];
    }

    render() {
        return (
            <InfiniteScroll
                list={this.getItems()}
                // preloadAdditionalHeight={window.innerHeight*2}
                // useWindowAsScrollContainer
                onInfiniteLoad={this.props.onBottomScroll}
                containerId="questions-view-main"
                loading={this.props.isLoadingOwnQuestions}
            />
        );
    }
}
