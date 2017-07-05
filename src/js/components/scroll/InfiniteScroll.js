import React, { PropTypes, Component } from 'react';
import { isDispatching } from '../../dispatcher/Dispatcher';
import InfiniteAnyHeight from './InfiniteAnyHeight.jsx';
import Infinite from 'react-infinite';
import { ScrollContainer } from 'react-router-scroll';

export default class InfiniteScroll extends Component {

    static propTypes = {
        containerId   : PropTypes.string.isRequired,
        firstItems    : PropTypes.array,
        items         : PropTypes.array,
        columns       : PropTypes.number,
        onInfiniteLoad: PropTypes.func,
        loading       : PropTypes.bool,
    };

    static contextTypes = {
        scrollBehavior: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            'mustRender': false,
        };

        this.checkMustRender = this.checkMustRender.bind(this);
        this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
        this.getHeight = this.getHeight.bind(this);
        this.getScrollContainer = this.getScrollContainer.bind(this);
        this.updateStateHeight = this.updateStateHeight.bind(this);
        this.getLoadingGif = this.getLoadingGif.bind(this);
    }

    componentWillMount() {
        this.updateStateHeight();
    }

    componentDidMount() {
        this.checkMustRender();
        window.addEventListener('resize', this.updateStateHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateStateHeight);
    }

    componentDidUpdate() {
        const scrollBehavior = this.context.scrollBehavior.scrollBehavior;
        scrollBehavior.updateScroll(this.context, this.context);
    }

    checkMustRender() {
        if (!this.state.mustRender && this.getScrollContainer()) {
            this._setMustRender(true);
        }
    }

    _setMustRender(bool) {
        this.setState({
            'mustRender': bool
        })
    }

    onInfiniteLoad() {
        if (!isDispatching()) {
            return this.props.onInfiniteLoad();
        }
    }

    getLoadingGif() {
        return this.props.loading ? <div className="loading-gif"></div> : '';
    }

    handleScroll() {
        const scrollBehavior = this.context.scrollBehavior.scrollBehavior;
        const containerId = this.props.containerId;

        scrollBehavior._saveElementPosition(containerId);
    }

    updateStateHeight() {
        const scrollHeight = this.getHeight();
        this.setState({
            'height': scrollHeight
        });
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
        if (columns === 1) {
            return items;
        }

        let savedItem = null;
        let wrappedItems = [];

        items.forEach((item) => {

            if (savedItem === null) {
                savedItem = item;
            } else {
                wrappedItems.push(this.buildWrapper(savedItem, item));
                savedItem = null;
            }
        });

        if (savedItem !== null) {
            wrappedItems.push(this.buildWrapper(savedItem));
            savedItem = null;
        }

        return wrappedItems;
    }

    buildWrapper(card1, card2) {
        let cards = [Object.assign({}, card1)];
        if (card2 instanceof Object) {
            cards.push(Object.assign({}, card2));
        }

        const wrapper = <div>
            {cards}
        </div>;

        card1 = null;

        return wrapper;
    }

    getList() {
        const {firstItems, items, columns} = this.props;
        const wrappedItems = this.wrap(items, columns);
        const list = [...firstItems, ...wrappedItems];
        return list.slice(0);
    }

    renderScroll() {
        const height = this.getHeight();
        const scrollContainer = this.getScrollContainer();
        const containerId = this.props.containerId;
        return <ScrollContainer scrollKey={containerId}>
            <InfiniteAnyHeight
                isInfiniteLoading={this.props.loading}
                infiniteLoadBeginEdgeOffset={10}
                loadingSpinnerDelegate={this.getLoadingGif()}
                // useWindowAsScrollContainer
                handleScroll={this.handleScroll.bind(this)}
                scrollContainer={scrollContainer}
                containerHeight={height}
                list={this.getList()}
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
    },
    'firstItems'    : [],
    'items'         : [],
    'columns'       : 1,
    loading         : false,
};
