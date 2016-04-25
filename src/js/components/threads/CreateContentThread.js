import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import ThreadFilterList from './filters/ThreadFilterList';
import MultipleChoicesFilter from './filters/MultipleChoicesFilter';
import TagFilter from './filters/TagFilter';
import FullWidthButton from '../ui/FullWidthButton';

export default class CreateContentThread extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        userId: PropTypes.number.isRequired,
        defaultFilters: PropTypes.object.isRequired,
        threadName: PropTypes.string
        // TODO: tagSuggestions should be a prop
    };

    constructor(props) {
        super(props);

        this.handleClickAddFilter = this.handleClickAddFilter.bind(this);
        this.handleClickFilterOnList = this.handleClickFilterOnList.bind(this);
        this.renderActiveFilters = this.renderActiveFilters.bind(this);
        this.renderMultipleChoicesFilter = this.renderMultipleChoicesFilter.bind(this);
        this.renderTagFilter = this.renderTagFilter.bind(this);
        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeFilterAndUnSelect = this.handleChangeFilterAndUnSelect.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.createThread = this.createThread.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.state = {
            selectFilter: false,
            selectedFilter: {},
            filters: {},
            tagSuggestions: []
        }
    }

    componentDidMount () {
        window.nekunoContainer.addEventListener('click', this.handleClickOutside)
    }

    componentWillUnmount () {
        window.nekunoContainer.removeEventListener('click', this.handleClickOutside)
    }

    handleClickAddFilter() {
        this.setState({
            selectFilter: true
        })
    }

    handleClickFilterOnList(checked, value) {
        let filters = this.state.filters;
        let filterData = Object.keys(filters).find(key => key === value) || null;

        if (checked) {
            filters[value] = filterData;
            this.setState({
                selectFilter: false,
                selectedFilter: value,
                filters: filters
            });
            this.scrollToFilter();
        } else {
            delete filters[value];
            this.setState({
                filters: filters,
                selectedFilter: null
            });
        }
    }

    renderActiveFilters() {
        const defaultFilters = Object.assign({}, this.props.defaultFilters);
        const {filters} = this.state;
        return (
            Object.keys(filters).map(key => {
                const selected = this.state.selectedFilter === key;
                switch (defaultFilters[key].type) {
                    case 'multiple_choices':
                        return this.renderMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected);
                    case 'tags':
                        return this.renderTagFilter(defaultFilters[key], key, filters[key], selected);
                }
            })
        );
    }

    renderMultipleChoicesFilter(filter, key, data, selected) {
        return (
            <MultipleChoicesFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                                   filter={filter}
                                   data={data}
                                   selected={selected}
                                   handleClickRemoveFilter={this.handleClickRemoveFilter}
                                   handleChangeFilter={this.handleChangeFilter}
                                   handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderTagFilter(filter, key, data, selected) {
        return (
            <TagFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                       filter={filter}
                       data={data}
                       selected={selected}
                       handleClickRemoveFilter={this.handleClickRemoveFilter}
                       handleChangeFilter={this.handleChangeFilterAndUnSelect}
                       handleClickFilter={this.handleClickFilter}
            />
        );
    }

    handleChangeFilter(key, data) {
        let {filters} = this.state;
        filters[key] = data;
        this.setState({
            filters: filters,
            selectedFilter: key
        });
    }

    handleChangeFilterAndUnSelect(key, data) {
        let {filters} = this.state;
        filters[key] = data;
        this.setState({
            filters: filters,
            selectedFilter: null
        });
    }

    handleClickFilter(key) {
        let {filters} = this.state;
        filters[key] = filters[key] || null;
        this.setState({
            selectedFilter: key,
            filters: filters
        });
    }

    handleClickRemoveFilter() {
        let {filters, selectedFilter} = this.state;
        delete filters[selectedFilter];
        this.setState({
            filters: filters,
            selectedFilter: null
        })
    }

    handleClickOutside(e) {
        const selectedFilter = this.refs.selectedFilter;
        if (selectedFilter && selectedFilter.getSelectedFilter() && !selectedFilter.selectedFilterContains(e.target)) {
            this.setState({selectedFilter: null});
        }
    }

    scrollToFilter() {
        clearTimeout(this.selectFilterTimeout);
        this.selectFilterTimeout = setTimeout(() => {
            let selectedFilterElem = this.refs.selectedFilter;
            if (selectedFilterElem) {
                selectedFilterElem.getSelectedFilter().scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }
        }, 0);
    }

    createThread() {
        let data = {
            name: this.props.threadName,
            filters: {contentFilters: this.state.filters},
            category: 'ThreadContent'
        };

        let history = this.context.history;
        UserActionCreators.createThread(this.props.userId, data)
            .then(function(){
                history.pushState(null, `threads`);
            });
    }

    render() {
        let defaultFilters = Object.assign({}, this.props.defaultFilters);
        const data = this.state.filters || {};
        let filterKeys = Object.keys(defaultFilters).filter(key => Object.keys(data).some(dataKey => dataKey === key));
        let filters = {};
        filterKeys.forEach(key => { if (typeof data[key] !== 'undefined') { filters[key] = defaultFilters[key] } });
        return (
            this.state.selectFilter ?
                <div className="select-filter">
                    <div className="title">Selecciona un filtro</div>
                    <ThreadFilterList filters={filters}
                                      filtersMetadata={defaultFilters}
                                      handleClickFilterOnList={this.handleClickFilterOnList}
                    />
                </div>
                    :
                <div className="content-filters-wrapper">
                    <div className="table-row"></div>
                    {this.renderActiveFilters()}
                    <div className="table-row"></div>
                    <div className="thread-filter add-filter">
                        <div className="thread-filter-dot">
                            <span className="icon-plus active"></span>
                        </div>
                        <div className="users-opposite-vertical-line"></div>
                        <div className="add-filter-button-wrapper" onClick={this.handleClickAddFilter}>
                            <div className="add-filter-button">
                                <span className="add-filter-button-text">Añadir filtro</span>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <FullWidthButton onClick={this.createThread}>Crear hilo</FullWidthButton>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
        )
    }
}
