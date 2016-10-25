import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import connectToStores from '../../utils/connectToStores';
import LoginStore from '../../stores/LoginStore';

function getState() {
    const isGuest = LoginStore.isGuest();

    return {isGuest};
}

@connectToStores([LoginStore], getState)
export default class ToolBar extends Component {
    static propTypes = {
        disliked: PropTypes.bool,
        liked: PropTypes.bool,
        skipped: PropTypes.bool,
        category: PropTypes.string,
        recommendation: PropTypes.object,
        like: PropTypes.func,
        dislike: PropTypes.func,
        skip: PropTypes.func,
        // Injected by @connectToStores:
        isGuest        : PropTypes.bool
    };

    constructor() {
        super();

        this.skip = this.skip.bind(this);
        this.dislike = this.dislike.bind(this);
        this.like = this.like.bind(this);

        this.state = {
            liked: false,
            disliked: false,
        };
    }

    skip() {
        this.props.skip();
        this.setState({liked: false, disliked: false});
    }

    dislike() {
        this.props.dislike();
        this.setState({disliked: !this.state.dislike});
    }

    like() {
        this.props.like();
        this.setState({liked: !this.state.liked});
    }

    render() {
        let {skipped, category, recommendation, isGuest} = this.props;
        const {liked, disliked} = this.state;
        let className = isGuest ? "thread-toolbar-guest" : "";
        return (
            <div id="thread-toolbar" className={className}>
                <div className="thread-toolbar-inner">
                    <div className="thread-toolbar-items center">
                        <div className="thread-toolbar-item left" onClick={this.dislike}>
                            <span className={disliked ? "icon-thumbs-down active" : "icon-thumbs-down"}></span>
                        </div>
                        <div className="thread-toolbar-item center" onClick={this.skip}>
                            <div className="icon-wrapper">
                                <span className="icon-nekuno"></span>
                            </div>
                        </div>
                        <div className="thread-toolbar-item right" onClick={this.like}>
                            <span className={liked ? "icon-thumbs-up active" : "icon-thumbs-up"}></span>
                        </div>
                    </div>
                    {category === 'ThreadContent' ?
                        <div className="thread-toolbar-items right">
                            <div className="thread-toolbar-item">
                                <span className={"icon-share"}></span>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}
