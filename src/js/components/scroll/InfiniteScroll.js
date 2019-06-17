import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import ReactInfinite from 'react-infinite';

export default class InfiniteScroll extends Component {

    static propTypes = {
        containerId   : PropTypes.string.isRequired,
        firstItems    : PropTypes.array,
        items         : PropTypes.array,
        itemHeight    : PropTypes.number,
        onResize      : PropTypes.func,
        columns       : PropTypes.number,
        onInfiniteLoad: PropTypes.func,
        loading       : PropTypes.bool,
    };

    static contextTypes = {
        scrollBehavior: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
        this.getHeight = this.getHeight.bind(this);
        this.getHeightList = this.getHeightList.bind(this);
        this.getScrollContainer = this.getScrollContainer.bind(this);
        this.getLoadingGif = this.getLoadingGif.bind(this);
        this.applyScroll = this.applyScroll.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.renderScroll = this.renderScroll.bind(this);

        this.state = {
            mustRender: null,
        }
    }

    componentDidMount() {
        this.checkMustRender();
        window.addEventListener('resize', this.props.onResize);

        this.applyScroll();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.props.onResize);
    }

    componentDidUpdate() {
        this.checkMustRender();
        this.applyScroll();
    }

    applyScroll() {
        const scrollBehavior = this.context.scrollBehavior.scrollBehavior;
        setTimeout(() => scrollBehavior.updateScroll(this.context, this.context), 0);
    }

    checkMustRender() {
        if (!this.state.mustRender && this.getScrollContainer()) {
            this._setMustRender();
        }
    }

    _setMustRender() {
        this.setState({
            mustRender: true
        })
    }

    onInfiniteLoad() {
        this.props.onInfiniteLoad();
    }

    getLoadingGif() {
        return this.props.loading ? <div className="loading-gif"></div> : '';
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

    getHeightList() {
        const {firstItems, items, columns, itemHeight} = this.props;

        const topMargin = this.getTopMargin();
        const firstItemsHeight = topMargin / firstItems.length;
        let itemsHeights = firstItems.map(item => firstItemsHeight);
        const scrollItemsLength = Math.ceil(items.length/columns);
        for (let i=0; i<scrollItemsLength; i++) {
            itemsHeights.push(itemHeight);
        }

        return itemsHeights;
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

    wrap(items, columns) {
        let wrappedItems = [];
        let index = 0;
        while (index < items.length) {
            const wrappedItemsNextIndex = index + columns;
            wrappedItems.push(items.slice(index, wrappedItemsNextIndex));
            index = wrappedItemsNextIndex;
        }

        return wrappedItems.map((wrappedItem, index) => {
            return (
                <div className="infinite-column" key={index}>
                    {wrappedItem}
                </div>
            );
        });
    }

    getList() {
        const {firstItems, items, columns} = this.props;
        const wrappedItems = this.wrap(items, columns);
        const list = [...firstItems, ...wrappedItems];
        return list.slice(0);
    }

    renderScroll() {
        const height = this.getHeight();
        const containerId = this.props.containerId;

        return <ScrollContainer scrollKey={containerId}>
            <ReactInfinite
                elementHeight={this.getHeightList()}
                isInfiniteLoading={this.props.loading}
                infiniteLoadBeginEdgeOffset={700}
                loadingSpinnerDelegate={this.getLoadingGif()}
                handleScroll={this.handleScroll}
                containerHeight={height}
                className='react-infinite-div'
                onInfiniteLoad={this.onInfiniteLoad}
                preloadBatchSize={100} //small values can cause infinite loop https://github.com/seatgeek/react-infinite/pull/48
                preloadAdditionalHeight={ReactInfinite.containerHeightScaleFactor(5)}
            >
                {this.getList()}
            </ReactInfinite>
        </ScrollContainer>
    }

    render() {
        const {mustRender} = this.state;

        return mustRender ?
            <div id="infinite-scroll">
                {this.renderScroll()}
            </div>
            : null;
    }
}

InfiniteScroll.defaultProps = {
    onInfiniteLoad: () => {},
    firstItems    : [],
    items         : [],
    itemHeight    : 360,
    columns       : 1,
    loading       : false,
};
