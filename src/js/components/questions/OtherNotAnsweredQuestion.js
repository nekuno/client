import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chip from '../ui/Chip';
import translate from '../../i18n/Translate';

@translate('OtherNotAnsweredQuestion')
export default class OtherNotAnsweredQuestion extends Component {
    static propTypes = {
        question     : PropTypes.object.isRequired,
        otherUserSlug: PropTypes.string.isRequired,

        // Injected by @translate:
        strings: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToAnswerQuestion = this.goToAnswerQuestion.bind(this);
    }

    goToAnswerQuestion() {
        const {question, otherUserSlug} = this.props;
        this.context.router.push(`/answer-question/${question.questionId}/${otherUserSlug}`);
    }

    render() {
        const {question, strings} = this.props;
        if (!question) {
            return null;
        }

        return (
            <div className="question">
                <div className="question-title">
                    {question.text}
                </div>
                <Chip onClickHandler={this.goToAnswerQuestion}>{strings.answer}</Chip>
                <hr/>
            </div>
        );
    }
}

OtherNotAnsweredQuestion.defaultProps = {
    strings: {
        answer: 'Answer question'
    }
};