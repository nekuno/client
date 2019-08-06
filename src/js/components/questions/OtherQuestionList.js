import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';
import EmptyMessage from '../ui/EmptyMessage';
import OtherQuestion from './OtherQuestion';
import OtherNotAnsweredQuestion from './OtherNotAnsweredQuestion';
import Scroll from "../scroll/Scroll";
import translate from '../../i18n/Translate';

@translate('OtherQuestionList')
export default class OtherQuestionList extends Component {
    static propTypes = {
        questions                    : PropTypes.object.isRequired,
        otherQuestions               : PropTypes.object.isRequired,
        otherNotAnsweredQuestions    : PropTypes.object.isRequired,
        otherSameAnswerQuestions     : PropTypes.object.isRequired,
        otherDifferentAnswerQuestions: PropTypes.object.isRequired,
        otherNotAnsweredCount        : PropTypes.number,
        otherDifferentAnswerCount    : PropTypes.number,
        otherSameAnswerCount         : PropTypes.number,
        ownPicture                   : PropTypes.string,
        otherPicture                 : PropTypes.string.isRequired,
        otherUserSlug                : PropTypes.string.isRequired,
        onTimerEnd                   : PropTypes.func,
        isLoadingComparedQuestions   : PropTypes.bool,
        // Injected by @translate:
        strings                      : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.getOtherQuestions = this.getOtherQuestions.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);

        this.state = {
            matchingType: 'agree',
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const hasChangedType = prevState.matchingType !== this.state.matchingType;
        const noQuestionsReceived = Object.keys(this.props.questions).length === 0;

        if (hasChangedType && noQuestionsReceived) {
            console.log('on bottom scroll inside question list');
            this.onBottomScroll();
        }
    }

    getOtherQuestions() {
        const {otherNotAnsweredQuestions, otherSameAnswerQuestions, otherDifferentAnswerQuestions, isLoadingComparedQuestions, strings} = this.props;

        let chosenQuestionsProp;
        switch (this.state.matchingType) {
            case 'explore':
                chosenQuestionsProp = otherNotAnsweredQuestions || {};
                break;
            case 'agree':
                chosenQuestionsProp = otherSameAnswerQuestions || {};
                break;
            case 'disagree':
                chosenQuestionsProp = otherDifferentAnswerQuestions || {};
                break;
        }

        if (Object.keys(chosenQuestionsProp).length === 0) {
            return [];
        }

        // const otherUserQuestions = chosenQuestionsProp.otherQuestions.questions;
        // const ownUserQuestions = chosenQuestionsProp.ownQuestions.questions;

        // const renderedQuestions = Object.keys(otherUserQuestions).map((questionId) =>
        //     <div key={questionId} className="question-list not-answered">
        //         <OtherQuestion otherUserSlug={otherUserSlug}
        //                        ownPicture={ownPicture}
        //                        otherPicture={otherPicture}
        //                        accessibleKey={questionId}
        //                        question={otherUserQuestions[questionId]}
        //                        onTimerEnd={onTimerEnd}
        //                        ownUserAnswer={ownUserQuestions[questionId].userAnswer}
        //         />
        //     </div>);

        const renderedQuestions = this.getRenderedQuestions(chosenQuestionsProp, this.state.matchingType);

        return renderedQuestions.length > 0 ? renderedQuestions
            : isLoadingComparedQuestions ? [<div key={'empty-message'}><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
                : [<div key={'empty-message'}><EmptyMessage text={strings.empty} loadingGif={false}/></div>]
    }

    getRenderedQuestions(questionsProp, type) {
        const {otherUserSlug, ownPicture, otherPicture, onTimerEnd} = this.props;

        const otherUserQuestions = type === 'explore' ? questionsProp : questionsProp.otherQuestions.questions;
        const ownUserQuestions = type === 'explore' ? {} : questionsProp.ownQuestions.questions;
        let rendered;
        if (type === 'explore') {
            rendered = Object.keys(otherUserQuestions).map((questionId) => {
                return <div key={questionId} className="question-list not-answered">
                    <OtherNotAnsweredQuestion otherUserSlug={otherUserSlug}
                                              question={otherUserQuestions[questionId]}
                    />
                </div>
            });
        } else {
            rendered = Object.keys(otherUserQuestions).map(questionId =>
                <div key={questionId} className="question-list not-answered">
                    <OtherQuestion otherUserSlug={otherUserSlug}
                                   ownPicture={ownPicture}
                                   otherPicture={otherPicture}
                                   accessibleKey={questionId}
                                   question={otherUserQuestions[questionId]}
                                   onTimerEnd={onTimerEnd}
                                   ownUserAnswer={ownUserQuestions[questionId].userAnswer}
                    />
                </div>
            )
        }

        return rendered;
    };

    getSelectorButton(type, icon, count) {
        return (
            <button className={`type ${type}` + (this.state.matchingType === type ? ' selected' : '')}
                    onClick={() => this.setState({matchingType: type})}>
                <span className="label">{this.props.strings[`${type}Matching`]}</span>
                <span className={`icon mdi mdi-${icon}`}></span>
                <span className="count">{this.props.isLoadingComparedQuestions ? '-' : `${count}`}</span>
            </button>
        )
    }

    onBottomScroll() {
        const {onBottomScroll} = this.props;
        const {matchingType} = this.state;

        return onBottomScroll(matchingType);
    }

    render() {
        const {otherNotAnsweredCount, otherDifferentAnswerCount, otherSameAnswerCount} = this.props;
        const selector =
            <div key="matching-type" className="matching-type">
                {this.getSelectorButton('agree', 'thumb-up', otherSameAnswerCount)}
                {this.getSelectorButton('disagree', 'thumb-down', otherDifferentAnswerCount)}
                {this.getSelectorButton('explore', 'plus-circle', otherNotAnsweredCount)}
            </div>;

        return (
            <Scroll
                items={this.getOtherQuestions()}
                firstItems={this.props.firstItems.concat([selector])}
                onLoad={this.onBottomScroll}
                containerId="questions-view-main"
                loading={this.props.isLoadingComparedQuestions}
                columns={1}
            />
        );
    }
}

OtherQuestionList.defaultProps = {
    strings                   : {
        loading    : 'Loading questions',
        empty      : 'No questions',
        notAnswered: 'Other questions that user answered',
        answer     : 'Answer and find out if you both agree!'
    },
    isLoadingComparedQuestions: false,
    onTimerEnd                : () => {
    },
    ownPicture                : '',
    otherDifferentAnswerCount : 0,
    otherSameAnswerCount      : 0,
    otherNotAnsweredCount     : 0
};
