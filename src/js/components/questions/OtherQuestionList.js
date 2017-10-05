import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';
import EmptyMessage from '../ui/EmptyMessage';
import OtherQuestion from './OtherQuestion';
import Scroll from "../scroll/Scroll";
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

    constructor(props) {
        super(props);

        this.getOtherQuestions = this.getOtherQuestions.bind(this);
    }

    getOtherQuestions() {
        const {questions, otherQuestions, otherUserSlug, ownPicture, otherPicture, onTimerEnd, isLoadingComparedQuestions, strings} = this.props;

        const questionComponents = Object.keys(otherQuestions).map((position, index) => {
            // const question = Object.keys(otherQuestions).find((index) => {
            //     const otherQuestion = otherQuestions[index];
            //     return otherQuestion.question.questionId === questionId;
            // });
            const question = otherQuestions[position];
            const questionId = question.question.questionId;

            return <div key={index} className="question-list">
                <OtherQuestion otherUserSlug={otherUserSlug}
                               userAnswer={selectn('userAnswer', questions[questionId])}
                               ownPicture={ownPicture}
                               otherPicture={otherPicture}
                               accessibleKey={index}
                               question={question}
                               onTimerEnd={onTimerEnd}
                />
            </div>
        });

        return Object.keys(otherQuestions).length > 0 ?
            questionComponents
            : isLoadingComparedQuestions ? [<div key={'empty-message'}><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
                : [<div key={'empty-message'}><EmptyMessage text={strings.empty} loadingGif={false}/></div>]
    }

    render() {
        return (
            <Scroll
                items={this.getOtherQuestions()}
                firstItems={this.props.firstItems}
                onLoad={this.props.onBottomScroll}
                containerId="questions-view-main"
                loading={this.props.isLoadingComparedQuestions}
                columns={1}
            />
        );
    }
}

OtherQuestionList.defaultProps = {
    strings                   : {
        loading: 'Loading questions',
        empty  : 'No questions',
    },
    isLoadingComparedQuestions: false,
    onTimerEnd                : () => {
    },
    ownPicture                : '',
};
