import React, { PropTypes, Component } from 'react';
import InfiniteAnyHeight from './InfiniteAnyHeight.jsx';

export default class InfiniteScroll extends Component {

    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            'firstTimeTried': false,
            'loading'       : undefined,
        };

        this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    }

    _setLoadingState(bool) {
        this.setState({
            'loading': bool
        })
    }

    _setFirstRequestTried(bool) {
        this.setState({
            'firstTimeTried': bool
        })
    }

    onInfiniteLoad() {
        if (this.state.firstTimeTried) {
            this._setLoadingState(true);
            // setTimeout(this.props.onInfiniteLoad().then(() => {
            //     this._setLoadingState(false)
            // }), 0);
            this.props.onInfiniteLoad().then(() => {
                this._setLoadingState(false)
            });

        } else {
            this._setFirstRequestTried(true);
        }
    }

    getLoadingGif() {
        return <div className="loading-gif"></div>
    }

    handleScroll() {
    }

    render() {
        const isInfiniteLoading = this.state.loading;
        const scrollContainer = this.props.scrollContainer ? this.props.scrollContainer : window ;
        const containerHeight = this.props.scrollContainer ? scrollContainer.clientHeight : window.innerHeight;

        return (
            <div className="user-list" onScroll={this.handleScroll} id="user-list">
                <InfiniteAnyHeight
                    isInfiniteLoading={isInfiniteLoading}
                    infiniteLoadBeginEdgeOffset={10}
                    loadingSpinnerDelegate={this.getLoadingGif()}
                    // useWindowAsScrollContainer
                    handleScroll = {this.handleScroll}
                    scrollContainer={scrollContainer}
                    containerHeight={containerHeight}
                    // preloadAdditionalHeight={window.innerHeight*2}
                    {...this.props}
                    onInfiniteLoad={this.onInfiniteLoad}
                    preloadBatchSize={10} //small values can cause infinite loop https://github.com/seatgeek/react-infinite/pull/48
                />
            </div>
        );
    }
}

InfiniteScroll.defaultProps = {
    'onInfiniteLoad': () => {
        return Promise.resolve()
    }
};
