import React, { PropTypes, Component } from 'react';
import InfiniteAnyHeight from './InfiniteAnyHeight.jsx';
import { ScrollContainer } from 'react-router-scroll';

export default class InfiniteScroll extends Component {

    static propTypes = {};

    static contextTypes = {
        scrollBehavior: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            'firstTimeTried': false,
            'loading'       : undefined,
        };

        this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
        this.getHeight = this.getHeight.bind(this);
    }

    componentDidUpdate() {
        const scrollBehavior = this.context.scrollBehavior.scrollBehavior;
        const containerId = this.props.scrollContainer ? this.props.scrollContainer.id : 'window';

        scrollBehavior._updateElementScroll(containerId, this.context, this.context);
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
        const scrollBehavior = this.context.scrollBehavior.scrollBehavior;
        const containerId = this.props.scrollContainer ? this.props.scrollContainer.id : 'window';

        scrollBehavior._saveElementPosition(containerId);
    }

    getHeight() {
        return (
            !this.props.scrollContainer ? null :
                this.props.scrollContainer.clientHeight ? this.props.scrollContainer.clientHeight :
                    this.props.scrollContainer.offsetHeight ? this.props.scrollContainer.offsetHeight : null
        );
    }

    render() {
        const isInfiniteLoading = this.state.loading;
        const scrollContainer = this.props.scrollContainer ? this.props.scrollContainer : null;
        const containerHeight = this.getHeight();
        const containerId = this.props.scrollContainer ? this.props.scrollContainer.id : 'window';

        return (<div id="infinite-scroll">
                { scrollContainer !== null && containerHeight !== null ?
                    <ScrollContainer scrollKey={containerId}>
                        <InfiniteAnyHeight
                            isInfiniteLoading={isInfiniteLoading}
                            infiniteLoadBeginEdgeOffset={10}
                            loadingSpinnerDelegate={this.getLoadingGif()}
                            // useWindowAsScrollContainer
                            handleScroll={this.handleScroll.bind(this)}
                            scrollContainer={scrollContainer}
                            containerHeight={containerHeight}
                            // preloadAdditionalHeight={window.innerHeight*2}
                            {...this.props}
                            onInfiniteLoad={this.onInfiniteLoad}
                            preloadBatchSize={100} //small values can cause infinite loop https://github.com/seatgeek/react-infinite/pull/48
                        />
                    </ScrollContainer>

                    :
                    '' }
            </div>
        );
    }
}

InfiniteScroll.defaultProps = {
    'onInfiniteLoad': () => {
        return Promise.resolve()
    }
};
