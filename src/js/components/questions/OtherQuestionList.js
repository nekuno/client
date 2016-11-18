import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import OtherQuestion from './OtherQuestion';

export default class OtherQuestionList extends Component {
    static propTypes = {
        questions     : PropTypes.object.isRequired,
        otherQuestions: PropTypes.object.isRequired,
        ownPicture    : PropTypes.string,
        otherPicture  : PropTypes.string.isRequired,
        userId        : PropTypes.number.isRequired
    };

    render() {
        const {questions, otherQuestions, userId, ownPicture, otherPicture} = this.props;
        return (
            <div className="question-list">
                {Object.keys(otherQuestions).map((questionId, index) =>
                    <OtherQuestion userId={userId}
                                   userAnswer={selectn('userAnswer', questions[questionId])}
                                   ownPicture={ownPicture}
                                   otherPicture={otherPicture}
                                   key={index}
                                   accessibleKey={index}
                                   question={otherQuestions[questionId]}
                    />
                )}
            </div>
        );
    }
}
