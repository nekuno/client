import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import ChipList from './../ui/ChipList';

export default class ThreadUsers extends Component {
    static propTypes = {
        thread: PropTypes.object.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let thread = this.props.thread;
        thread = this.mergeImagesWithThread(thread);

        return (
            <div className="thread-listed">
                <div className="first-user-image">
                    <img src={thread.cached[0].image} />
                </div>
                <div className="thread-title">
                    {thread.name}
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
