import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import ChipList from './../ui/ChipList';

export default class ThreadUsers extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };
    static propTypes = {
        thread: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.handleGoClickThread = this.handleGoClickThread.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let thread = this.props.thread;
        let last = this.props.last;
        thread = this.mergeImagesWithThread(thread);

        return (
            <div className="thread-listed">
                {last ? '' : <div className="threads-vertical-connection"></div>}
                <div className="thread-first-image">
                    <img src={thread.cached[0].image} />
                </div>
                <div className="thread-info-box">
                    <div className="thread-title">
                        <Link to={`users/1/recommendations/${thread.id}`} onClick={this.handleGoClickThread.bind(this, thread.id)}>
                            {thread.name}
                        </Link>
                    </div>
                    <div className="recommendations-count">
                        {thread.totalResults} Usuarios
                    </div>
                    <div className="thread-images">
                        {thread.cached.map((item, index) => index !== 0 && item.image ?
                            <div className="thread-image"><img src={item.image} /></div> : '')}
                    </div>
                    {/* TODO:Convert filters to simple text
                     <ChipList chips={thread.profileFilters + thread.userFilters + Persons} small={false} />*/}
                    <ChipList chips={[
                        {
                            'label': 'Personas'
                        },
                        {
                            'label': 'Edad: 20-35'
                        }
                    ]} small={false} />
                </div>
            </div>
        );
    }

    handleGoClickThread(threadId) {
        this.context.history.pushState(null, `users/1/recommendations/${threadId}`);
    }

    mergeImagesWithThread(thread) {

        let images = thread.cached.map((item, index) => item.picture ?
                `${IMAGES_ROOT}/media/cache/resolve/profile_picture/user/images/${item.picture}` :
                `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`
            );

        images[0] = thread.cached[0].picture ?
                `${IMAGES_ROOT}/media/cache/user_avatar_180x180/user/images/${thread.cached[0].picture}` :
                `${IMAGES_ROOT}/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        images.forEach((item, index) => {if (thread.cached[index]) { thread.cached[index].image = item }});

        return thread;
    }
}
