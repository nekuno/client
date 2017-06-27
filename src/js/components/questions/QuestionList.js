import React, { PropTypes, Component } from 'react';
import Question from './Question';
import EmptyMessage from '../ui/EmptyMessage';
import InfiniteScroll from "../scroll/InfiniteScroll";
import translate from '../../i18n/Translate';

@translate('QuestionList')
export default class QuestionList extends Component {
    static propTypes = {
        questions     : PropTypes.object.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userSlug      : PropTypes.string.isRequired,
        onTimerEnd    : PropTypes.func,
        isLoadingOwnQuestions: PropTypes.bool,
        // Injected by @translate:
        strings                   : PropTypes.object
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
        const {questions, userSlug, ownPicture, defaultPicture, onTimerEnd, isLoadingOwnQuestions, strings} = this.props;

        const questionComponents = Object.keys(questions).map((questionId, index) =>
        <div className="question-list">
            <Question userSlug={userSlug}
                      userAnswer={questions[questionId].userAnswer}
                      ownPicture={ownPicture}
                      defaultPicture={defaultPicture}
                      key={index}
                      accessibleKey={index}
                      question={questions[questionId]}
                      last={index === questions.length}
                      onClickHandler={this.onClickHandler}
                      onTimerEnd={onTimerEnd}
                      graphActive={this.state.graphDisplayQuestionId === questionId}
            />
        </div>);
        return !isLoadingOwnQuestions || Object.keys(questions).length !== 0 ?
            questionComponents
            : [<EmptyMessage text={strings.loading} loadingGif={true} shortMarginTop={true}/>];
    }

    render() {
        return (
            <InfiniteScroll
                items={this.getQuestions.bind(this)()}
                firstItems ={this.props.firstItems}
                // preloadAdditionalHeight={window.innerHeight*2}
                // useWindowAsScrollContainer
                onInfiniteLoad={this.props.onBottomScroll}
                containerId="questions-view-main"
            />
        );
    }
}

QuestionList.defaultProps = {
    strings: {
        loading: 'Loading questions'
    }
};
