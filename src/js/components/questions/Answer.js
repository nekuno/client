import React, { PropTypes, Component } from 'react';

export default class Answer extends Component {
    static propTypes = {
        text          : PropTypes.string.isRequired,
        answered      : PropTypes.bool.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string
    };

    render() {

        let text = this.props.text;
        let answered = this.props.answered;
        let ownPicture = this.props.ownPicture;
        let defaultPicture = this.props.defaultPicture;

        if (text) {
            if (answered) {
                return (
                    <div className="answer-answered">
                        <div className="answer-answered-picture">
                            <img src={ownPicture}/>
                        </div>
                        <div className="answer-answered-text">
                            {text}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="answer-not-answered">
                        <div className="answer-not-answered-picture">
                            <img src={defaultPicture}/>
                        </div>
                        <div className="answer-not-answered-text">
                            {text}
                        </div>
                    </div>
                );
            }
        }
    }
}
