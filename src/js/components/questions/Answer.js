import React, { PropTypes, Component } from 'react';

export default class Answer extends Component {
    static propTypes = {
        text          : PropTypes.string.isRequired,
        answered      : PropTypes.bool.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string,
        accepted      : PropTypes.bool
    };

    render() {
        const {text, answered, ownPicture, defaultPicture, accepted} = this.props;

        if (text) {
            if (answered) {
                return (
                    <div className="answer-answered">
                        <div className="answer-answered-picture">
                            <img src={ownPicture}/>
                        </div>
                        <div className="answer-answered-text" style={accepted ? {} : {textDecoration: "line-through"}}>
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
                        <div className="answer-not-answered-text" style={accepted ? {} : {textDecoration: "line-through"}}>
                            {text}
                        </div>
                    </div>
                );
            }
        }
    }
}
