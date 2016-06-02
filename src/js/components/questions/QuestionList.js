import React, { PropTypes, Component } from 'react';
import Question from './Question';

export default class QuestionList extends Component {
    static propTypes = {
        questions     : PropTypes.object.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userId        : PropTypes.number.isRequired
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
        const {questions, userId, ownPicture, defaultPicture} = this.props;
        return (
            <div className="question-list">
                {Object.keys(questions).map((questionId, index) =>
                    <Question userId={userId} 
                              userAnswer={questions[questionId].userAnswer} 
                              ownPicture={ownPicture} 
                              defaultPicture={defaultPicture} 
                              key={index} 
                              accessibleKey={index} 
                              question={questions[questionId]} 
                              last={index == questions.length} 
                              onClickHandler={this.onClickHandler}
                              graphActive={this.state.graphDisplayQuestionId == questionId}
                    />
                )}
            </div>
        );
    }
}
