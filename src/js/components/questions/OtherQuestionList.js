import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import OtherQuestion from './OtherQuestion';
import InfiniteScroll from "../scroll/InfiniteScroll";

export default class OtherQuestionList extends Component {
    static propTypes = {
        questions     : PropTypes.object.isRequired,
        otherQuestions: PropTypes.object.isRequired,
        ownPicture    : PropTypes.string,
        otherPicture  : PropTypes.string.isRequired,
        otherUserSlug : PropTypes.string.isRequired,
        onTimerEnd    : PropTypes.func
    };

    getOtherQuestions() {
        const {questions, otherQuestions, otherUserSlug, ownPicture, otherPicture, onTimerEnd} = this.props;

        return Object.keys(otherQuestions).map((questionId, index) =>
            <OtherQuestion otherUserSlug={otherUserSlug}
                           userAnswer={selectn('userAnswer', questions[questionId])}
                           ownPicture={ownPicture}
                           otherPicture={otherPicture}
                           key={index}
                           accessibleKey={index}
                           question={otherQuestions[questionId]}
                           onTimerEnd={onTimerEnd}
            />
        );
    }

    getItems() {
        const firstItems = this.props.firstItems;
        const questions = this.getOtherQuestions.bind(this)();
        return [
            ...firstItems,
            ...questions
        ];
    }

    render() {
        return (
            <div className="question-list">
                <InfiniteScroll
                    list={this.getItems()}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    // useWindowAsScrollContainer
                    onInfiniteLoad={this.props.onBottomScroll}
                    scrollContainer={document.getElementById("questions-view-main")}
                />
            </div>
        );
    }
}
