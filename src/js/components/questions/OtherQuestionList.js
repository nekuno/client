import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import EmptyMessage from '../ui/EmptyMessage';
import OtherQuestion from './OtherQuestion';
import InfiniteScroll from "../scroll/InfiniteScroll";
import translate from '../../i18n/Translate';

@translate('OtherQuestionList')
export default class OtherQuestionList extends Component {
    static propTypes = {
        questions                 : PropTypes.object.isRequired,
        otherQuestions            : PropTypes.object.isRequired,
        ownPicture                : PropTypes.string,
        otherPicture              : PropTypes.string.isRequired,
        otherUserSlug             : PropTypes.string.isRequired,
        onTimerEnd                : PropTypes.func,
        isLoadingComparedQuestions: PropTypes.bool,
        // Injected by @translate:
        strings                   : PropTypes.object
    };

    getOtherQuestions() {
        const {questions, otherQuestions, otherUserSlug, ownPicture, otherPicture, onTimerEnd, isLoadingComparedQuestions, strings} = this.props;

        const questionComponents = Object.keys(otherQuestions).map((questionId, index) =>
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

        return !isLoadingComparedQuestions ?
            <div className="question-list">
                {questionComponents}
            </div>
            : <EmptyMessage text={strings.loading} loadingGif={true}/>
    }

    getItems() {
        const firstItems = this.props.firstItems;
        const questions = this.getOtherQuestions.bind(this)();
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
            />
        );
    }
}

OtherQuestionList.defaultProps = {
    strings: {
        loading: 'Loading questions'
    }
};
