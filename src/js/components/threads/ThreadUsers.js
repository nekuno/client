import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import ChipList from './../ui/ChipList';

export default class ThreadUsers extends Component {
    static propTypes = {
        thread: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired
    };

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
                        {thread.name}
                    </div>
                    <div className="recommendations-count">
                    </div>
                    <div className="thread-images">
                        {thread.cached.map((item, index) => index !== 0 && item.image ?
                            <div className="thread-image"><img src={item.image} /></div> : '')}
                    </div>
                    {/* TODO:Convert filters to simple text
                     <ChipList chips={thread.profileFilters} small={false} />*/}
                    <ChipList chips={[
                        {
                            'label': 'Edad: 20-35'
                        },
                        {
                            'label': 'Soltero'
                        }
                    ]} small={false} />
                </div>
            </div>
        );
    }

    mergeImagesWithThread(thread) {

        let images = thread.cached.map((item, index) => item.picture ?
                `https://dev.nekuno.com/media/cache/resolve/profile_picture/user/images/${item.picture}` :
                'https://dev.nekuno.com/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg'
            );

        images[0] = thread.cached[0].picture ?
                `https://dev.nekuno.com/media/cache/user_avatar_180x180/user/images/${thread.cached[0].picture}` :
                'https://dev.nekuno.com/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg';

        images.forEach((item, index) => {if (thread.cached[index]) { thread.cached[index].image = item }});

        return thread;
    }
}
