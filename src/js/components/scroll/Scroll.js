import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import LoadingSpinnerCSS from '../ui/LoadingSpinnerCSS';

export default class Scroll extends Component {

    static propTypes = {
        containerId: PropTypes.string.isRequired,
        firstItems : PropTypes.array,
        items      : PropTypes.array,
        columns    : PropTypes.number,
        onLoad     : PropTypes.func,
        loading    : PropTypes.bool,
        useSpinner : PropTypes.bool,
    };

    static contextTypes = {
        scrollBehavior: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onLoad = this.onLoad.bind(this);
        this.getHeight = this.getHeight.bind(this);
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
        this.onLoad();

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

    onLoad() {
        this.props.onLoad();
    }

    getLoadingGif() {
        const {loading, useSpinner} = this.props;
        return loading ? useSpinner ? <LoadingSpinnerCSS/> : <div className="loading-gif"></div> : '';
    }

    handleScroll() {
        const scrollBehavior = this.context.scrollBehavior.scrollBehavior;
        const containerId = this.props.containerId;

        scrollBehavior._saveElementPosition(containerId);

        this.isAtBottom() && !this.props.loading ? this.onLoad() : null;
    }

    isAtBottom() {
        const scrollElem = document.getElementById('infinite-scroll');
        const scrollHeight = scrollElem.children[0].clientHeight - scrollElem.clientHeight;
        const scrollPosition = scrollElem.scrollTop;

        return scrollPosition >= scrollHeight - 20;
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
                <div key={index}>
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
        const {containerId, items, loading} = this.props;
        return <ScrollContainer scrollKey={containerId}>
            <div>
                {this.getList()}
                {loading && items.length > 1 ?
                    <div key="loading-gif">{this.getLoadingGif()}</div> : null
                }
            </div>
        </ScrollContainer>
    }

    render() {
        const {mustRender} = this.state;

        return mustRender ?
            <div id="infinite-scroll" onScroll={this.handleScroll} style={{overflowY: "scroll", height: this.getHeight()}}>
                {this.renderScroll()}
            </div>
            : null;
    }
}

Scroll.defaultProps = {
    onLoad    : () => {
    },
    firstItems: [],
    items     : [],
    itemHeight: 360,
    columns   : 1,
    loading   : false,
};
