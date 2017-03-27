import React, { PropTypes, Component } from 'react';
import Question from './Question';

export default class QuestionList extends Component {
    static propTypes = {
        questions     : PropTypes.object.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userSlug      : PropTypes.string.isRequired,
        onTimerEnd    : PropTypes.func
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

    render() {
        const {questions, userSlug, ownPicture, defaultPicture, onTimerEnd} = this.props;
        return (
            <div className="question-list">
                {Object.keys(questions).map((questionId, index) =>
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
                    />
                )}
            </div>
        );
    }
}
