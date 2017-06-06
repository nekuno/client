import React, { PropTypes, Component } from 'react';
import InfiniteAnyHeight from './InfiniteAnyHeight.jsx';
import Infinite from 'react-infinite';
import { ScrollContainer } from 'react-router-scroll';

export default class InfiniteScroll extends Component {

    static propTypes = {
        containerId: PropTypes.string.isRequired
    };

    static contextTypes = {
        scrollBehavior: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            'firstTimeTried': false,
            'loading'       : undefined,
            'mustRender'    : undefined,
        };

        this.checkRender = this.checkRender.bind(this);
        this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
        this.getHeight = this.getHeight.bind(this);
        this.getScrollContainer = this.getScrollContainer.bind(this);
    }

    componentWillMount() {
        setTimeout(this.checkRender, 200);
    }

    checkRender() {
        const mustRender = this.state.mustRender;

        if (!mustRender && this.getScrollContainer()) {
            this._setMustRender(true);
        }
    }

    componentDidUpdate() {
        this.checkRender();

        const scrollBehavior = this.context.scrollBehavior.scrollBehavior;
        scrollBehavior.updateScroll(this.context, this.context);
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

    _setMustRender(bool) {
        this.setState({
            'mustRender': bool
        })
    }

    onInfiniteLoad() {
        if (this.state.firstTimeTried) {
            this._setLoadingState(true);
            this.props.onInfiniteLoad().then(() => {
                this._setLoadingState(false)
            }) .catch(() => {
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
        const containerId = this.props.containerId;

        scrollBehavior._saveElementPosition(containerId);
    }

    getHeight() {
        const topMargin = this.getTopMargin();
        const toolbarHeight = this.getToolbarHeight();
        const scrollContainerHeight = this.getScrollContainerHeight.bind(this)();

        return parseInt(scrollContainerHeight - (topMargin + toolbarHeight));
    }

    getTopMargin() {
        const pageContent = document.getElementById('page-content');

        if (!pageContent) {
            return 0;
        }

        const style = window.getComputedStyle(pageContent);
        const property = style.getPropertyValue('margin-top');
        return parseInt(property.slice(0, -2));
    }

    getToolbarHeight() {
        const toolbars = document.getElementsByClassName('toolbar');

        if (toolbars.length === 0) {
            return null;
        }

        const style = window.getComputedStyle(toolbars[0]);
        const property = style.getPropertyValue('height');
        return parseInt(property.slice(0, -2));
    }

    getScrollContainer() {
        return document.getElementById(this.props.containerId);
    }

    getScrollContainerHeight() {
        const scrollContainer = this.getScrollContainer();
        return !scrollContainer ? null :
            scrollContainer.clientHeight ? scrollContainer.clientHeight :
                scrollContainer.offsetHeight ? scrollContainer.offsetHeight : null;
    }

    renderScroll() {
        const isInfiniteLoading = this.state.loading;
        const scrollContainer = this.getScrollContainer();
        const containerHeight = this.getHeight();
        const containerId = this.props.containerId;

        return <ScrollContainer scrollKey={containerId}>
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
                preloadAdditionalHeight={Infinite.containerHeightScaleFactor(5)}
            />
        </ScrollContainer>
    }

    render() {
        return <div id="infinite-scroll">
            { this.state.mustRender ?
                this.renderScroll.bind(this)()
                :
                '' }
        </div>
            ;
    }
}

InfiniteScroll.defaultProps = {
    'onInfiniteLoad': () => {
        return Promise.resolve()
    }
};
