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
        category: PropTypes.string,
        recommendation: PropTypes.object,
        like: PropTypes.func,
        dislike: PropTypes.func,
        ignore: PropTypes.func,
        share: PropTypes.func,
        // Injected by @connectToStores:
        isGuest        : PropTypes.bool
    };

    constructor() {
        super();

        this.ignore = this.ignore.bind(this);
        this.dislike = this.dislike.bind(this);
        this.like = this.like.bind(this);
        this.share = this.share.bind(this);
    }

    ignore() {
        this.props.ignore();
    }

    dislike() {
        this.props.dislike();
    }

    like() {
        this.props.like();
    }

    share() {
        this.props.share();
    }

    render() {
        const {recommendation, category, isGuest} = this.props;
        const className = isGuest ? "thread-toolbar-guest" : "";
        let liked, disliked, saving = null;
        if (category === 'ThreadContent') {
            liked = recommendation && recommendation.rate === 1;
            disliked = recommendation && recommendation.rate === -1;
            saving = recommendation && recommendation.rate === null;
        } else if (category === 'ThreadUsers') {
            liked = recommendation && recommendation.like === 1;
            disliked = recommendation && recommendation.like === -1;
            saving = recommendation && recommendation.like === null;
        }

        return (
            <div id="thread-toolbar" className={className}>
                <div className="thread-toolbar-inner">
                    <div className="thread-toolbar-items center">
                        <div className="thread-toolbar-item left" onClick={saving ? null : this.dislike}>
                            <span className={saving ? "icon-spinner" : disliked ? "icon-thumbs-down active" : "icon-thumbs-down"}></span>
                        </div>
                        <div className="thread-toolbar-item center" onClick={this.ignore}>
                            <div className="icon-wrapper">
                                <span className="icon-nekuno"></span>
                            </div>
                        </div>
                        <div className="thread-toolbar-item right" onClick={saving ? null : this.like}>
                            <span className={saving ? "icon-spinner" : liked ? "icon-thumbs-up active" : "icon-thumbs-up"}></span>
                        </div>
                    </div>
                    {category === 'ThreadContent' ?
                        <div className="thread-toolbar-items right" onClick={this.share}>
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
