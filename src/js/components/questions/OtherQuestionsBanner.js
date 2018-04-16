import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';

@translate('OtherQuestionsBanner')
export default class OtherQuestionsBanner extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        user: PropTypes.object.isRequired,
        questionsTotal: PropTypes.number.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const {user} = this.props;
        this.context.router.push(`/answer-other-question/${user.slug}/next`);
    }

    render() {

        const {strings, questionsTotal, user} = this.props;
        const otherPicture = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="answer-questions-link-container">
                <a href="javascript:void(0)" onClick={this.onClick}>
                    <div className="title answer-questions-link-title">{strings.title.replace('%username%', user.username)}</div>
                    <div className="answer-questions-link-text">{strings.text}&nbsp;</div>
                    <div className="answer-questions-link-stats">
                        <p>{questionsTotal}</p>
                        <p>{strings.completed}</p>
                    </div>
                    <div className="answer-questions-link-picture">
                        <img src={otherPicture}/>
                    </div>
                </a>
            </div>
        );
    }
}

OtherQuestionsBanner.defaultProps = {
    strings: {
        title    : 'Answer %username%`s questions for improving compatibility calculation',
        text     : '',
        completed: 'Completed questions'
    }
};