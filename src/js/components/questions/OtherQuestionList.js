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
        questions                 : PropTypes.object.isRequired,
        otherQuestions            : PropTypes.object.isRequired,
        otherNotAnsweredQuestions : PropTypes.object.isRequired,
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
        
        this.state = {
            matchingType: 'agree',
        };
    }
    
    getQuestionsData() { // FIXME: should be done in server!
        const {questions, otherQuestions} = this.props;
        return Object.keys(otherQuestions).map(idx => otherQuestions[idx])
            .map((question, p) => ({ question, p, data: questions[question.question.questionId] }))
            .map(x => ({...x, matches: true}));
    }

    getOtherQuestions(questionsData) {
        const {otherNotAnsweredQuestions, otherUserSlug, ownPicture, otherPicture, onTimerEnd, isLoadingComparedQuestions, strings} = this.props;

        const renderedQuestions = this.state.matchingType === 'explore' ?
            Object.keys(otherNotAnsweredQuestions || {}).map((index) =>
                <div key={index} className="question-list not-answered">
                    <OtherQuestion otherUserSlug={otherUserSlug}
                                   ownPicture={ownPicture}
                                   otherPicture={otherPicture}
                                   accessibleKey={index}
                                   question={{ question: otherNotAnsweredQuestions[index] }}
                                   onTimerEnd={onTimerEnd}
                    />
                </div>)
            :
            questionsData.filter(({matches}) => matches === (this.state.matchingType === 'agree'))
                .map(({question, data, p}) => <div key={p} className="question-list">
                    <OtherQuestion otherUserSlug={otherUserSlug}
                                   userAnswer={selectn('userAnswer', data)}
                                   ownPicture={ownPicture}
                                   otherPicture={otherPicture}
                                   accessibleKey={p}
                                   question={question}
                                   onTimerEnd={onTimerEnd}
                    />
                </div>);

        return renderedQuestions.length > 0 ? renderedQuestions
            : isLoadingComparedQuestions ? [<div key={'empty-message'}><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
                : [<div key={'empty-message'}><EmptyMessage text={strings.empty} loadingGif={false}/></div>]
    }

    getSelectorButton(type, icon, count) {
        return (
            <button className={`type ${type}` + (this.state.matchingType === type ? ' selected' : '')}
                    onClick={() => this.setState({ matchingType: type })}>
                <span className="label">{this.props.strings[`${type}Matching`]}</span>
                <span className={`icon mdi mdi-${icon}`}></span>
                <span className="count">{this.props.isLoadingComparedQuestions ? '-' : `${count}`}</span>
            </button>
        )
    }

    render() {
        const questionsData = this.getQuestionsData();

        const matchCount = questionsData.filter(x => x.matches).length;
        const exploreCount = Object.keys(this.props.otherNotAnsweredQuestions).length;
        const selector = 
            <div key="matching-type" className="matching-type">
                {this.getSelectorButton('agree', 'thumb-up', matchCount)}
                {this.getSelectorButton('disagree', 'thumb-down', questionsData.length - matchCount)}
                {this.getSelectorButton('explore', 'plus-circle', exploreCount)}
            </div>;

        return (
            <Scroll
                items={this.getOtherQuestions(questionsData)}
                firstItems={this.props.firstItems.concat([selector])}
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
        loading    : 'Loading questions',
        empty      : 'No questions',
        notAnswered: 'Other questions that user answered',
        answer     : 'Answer and find out if you both agree!'
    },
    isLoadingComparedQuestions: false,
    onTimerEnd                : () => {
    },
    ownPicture                : '',
};
