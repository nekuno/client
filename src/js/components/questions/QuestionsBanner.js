import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../../constants/Constants';
import { Link } from 'react-router';
import translate from '../../i18n/Translate';

@translate('QuestionsBanner')
export default class QuestionsBanner extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        user: PropTypes.object.isRequired,
        questionsTotal: PropTypes.number.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {

        const {strings, questionsTotal, user} = this.props;
        const ownBigPicture = user && user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="answer-questions-link-container">
                <Link to="/answer-question/next">
                    <div className="title answer-questions-link-title">{strings.title}</div>
                    <div className="answer-questions-link-text">{strings.text}</div>
                    <div className="answer-questions-link-stats">
                        <p>{questionsTotal}</p>
                        <p>{strings.completed}</p>
                    </div>
                    <div className="answer-questions-link-picture">
                        <img src={ownBigPicture}/>
                    </div>
                </Link>
            </div>
        );
    }
}

QuestionsBanner.defaultProps = {
    strings: {
        title    : 'Do you want us to walk a fine line?',
        text     : 'Answer more test questions',
        completed: 'completed questions'
    }
};