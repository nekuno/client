import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import FullWidthButton from '../ui/FullWidthButton';
import ThreadFilterList from './filters/ThreadFilterList';
import LocationFilter from './filters/LocationFilter';
import IntegerRangeFilter from './filters/IntegerRangeFilter';
import IntegerFilter from './filters/IntegerFilter';
import ChoiceFilter from './filters/ChoiceFilter';
import DoubleChoiceFilter from './filters/DoubleChoiceFilter';
import MultipleChoicesFilter from './filters/MultipleChoicesFilter';
import DoubleMultipleChoicesFilter from './filters/DoubleMultipleChoicesFilter';
import TagFilter from './filters/TagFilter';
import TagsAndChoiceFilter from './filters/TagsAndChoiceFilter';
import TagsAndMultipleChoicesFilter from './filters/TagsAndMultipleChoicesFilter';

export default class CreateUsersThread extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        userId: PropTypes.number.isRequired,
        defaultFilters: PropTypes.object.isRequired,
        threadName: PropTypes.string
        // TODO: defFilters should be a prop
    };
    
    constructor(props) {
        super(props);

        this.handleClickAddFilter = this.handleClickAddFilter.bind(this);
        this.handleClickFilterOnList = this.handleClickFilterOnList.bind(this);
        this.renderActiveFilters = this.renderActiveFilters.bind(this);
        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.renderLocationFilter = this.renderLocationFilter.bind(this);
        this.renderChoiceFilter = this.renderChoiceFilter.bind(this);
        this.renderDoubleChoiceFilter = this.renderDoubleChoiceFilter.bind(this);
        this.renderMultipleChoicesFilter = this.renderMultipleChoicesFilter.bind(this);
        this.renderDoubleMultipleChoicesFilter = this.renderDoubleMultipleChoicesFilter.bind(this);
        this.renderIntegerRangeFilter = this.renderIntegerRangeFilter.bind(this);
        this.renderIntegerFilter = this.renderIntegerFilter.bind(this);
        this.renderTagFilter = this.renderTagFilter.bind(this);
        this.renderTagsAndChoiceFilter = this.renderTagsAndChoiceFilter.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeFilterAndUnSelect = this.handleChangeFilterAndUnSelect.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.scrollToFilter = this.scrollToFilter.bind(this);
        this.createThread = this.createThread.bind(this);

        this.state = {
            selectFilter: false,
            selectedFilter: null,
            filters: {}
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
                    case 'location_distance':
                        return this.renderLocationFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'integer_range':
                        return this.renderIntegerRangeFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'integer':
                        return this.renderIntegerFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'choice':
                        return this.renderChoiceFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'double_choice':
                        return this.renderDoubleChoiceFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'multiple_choices':
                        return this.renderMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'double_multiple_choices':
                        return this.renderDoubleMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'tags_and_choice':
                        return this.renderTagsAndChoiceFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'tags_and_multiple_choices':
                        return this.renderTagsAndMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'tags':
                        return this.renderTagFilter(defaultFilters[key], key, filters[key], selected);
                }
            })
        );
    }

    renderLocationFilter(filter, key, data, selected) {
        return (
            <LocationFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                            filter={filter}
                            data={data}
                            selected={selected}
                            handleClickRemoveFilter={this.handleClickRemoveFilter}
                            handleChangeFilter={this.handleChangeFilterAndUnSelect}
                            handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderIntegerRangeFilter(filter, key, data, selected) {
        return(
            <IntegerRangeFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                                filter={filter}
                                data={data}
                                selected={selected}
                                handleClickRemoveFilter={this.handleClickRemoveFilter} 
                                handleChangeFilter={this.handleChangeFilter}
                                handleClickFilter={this.handleClickFilter}
            />
        )
    }

    renderIntegerFilter(filter, key, data, selected) {
        return(
            <IntegerFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                           filter={filter}
                           data={data}
                           selected={selected}
                           handleClickRemoveFilter={this.handleClickRemoveFilter}
                           handleChangeFilter={this.handleChangeFilter}
                           handleClickFilter={this.handleClickFilter}
            />
        )
    }

    renderChoiceFilter(filter, key, data, selected) {
        return (
            <ChoiceFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                          filter={filter}
                          data={data}
                          selected={selected}
                          handleClickRemoveFilter={this.handleClickRemoveFilter}
                          handleChangeFilter={this.handleChangeFilterAndUnSelect}
                          handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderDoubleChoiceFilter(filter, key, data, selected) {
        return (
            <DoubleChoiceFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                                filter={filter}
                                data={data}
                                selected={selected}
                                handleClickRemoveFilter={this.handleClickRemoveFilter}
                                handleChangeFilter={this.handleChangeFilter}
                                handleClickFilter={this.handleClickFilter}
            />
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

    renderDoubleMultipleChoicesFilter(filter, key, data, selected) {
        return (
            <DoubleMultipleChoicesFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
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

    renderTagsAndChoiceFilter(filter, key, data, selected) {
        return (
            <TagsAndChoiceFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                                 filter={filter}
                                 data={data}
                                 selected={selected}
                                 handleClickRemoveFilter={this.handleClickRemoveFilter}
                                 handleChangeFilter={this.handleChangeFilter}
                                 handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderTagsAndMultipleChoicesFilter(filter, key, data, selected) {
        return (
            <TagsAndMultipleChoicesFilter key={key} filterKey={key} ref={selected ? 'selectedFilter' : ''}
                                          filter={filter}
                                          data={data}
                                          selected={selected}
                                          handleClickRemoveFilter={this.handleClickRemoveFilter}
                                          handleChangeFilter={this.handleChangeFilter}
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
            filters: {userFilters: this.state.filters},
            category: 'ThreadUsers'
        };

        let stateFilters = this.state.filters;

        for (let stateFilter of stateFilters) {
            let box = 'userFilters';
            switch (stateFilter.type) {
                case 'choice':
                    data.filters[box][stateFilter.key] = stateFilter.choice;
                    break;
                case 'location_distance':
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['location'] = stateFilter.value;
                    data.filters[box][stateFilter.key]['distance'] = 50;
                    break;
                case 'tags':
                    data.filters[box][stateFilter.key] = stateFilter.values;
                    break;
                case 'tags_and_choice':
                    data.filters[box][stateFilter.key] = {};
                    stateFilter.values.forEach(function(value, key){
                        data.filters[box][stateFilter.key][key] = {'tag':value.tag, 'choice':value.choice};
                    });
                    break;
                case 'tags_and_multiple_choices':
                    data.filters[box][stateFilter.key] = {};
                    stateFilter.values.forEach(function(value, key){
                        data.filters[box][stateFilter.key][key] = {'tag':value.tag, 'choices':value.choices};
                    });
                    break;
                case 'double_choice':
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['choice'] = stateFilter.choice;
                    data.filters[box][stateFilter.key]['detail'] = stateFilter.detail;
                    break;
                case 'multiple_choices':
                    data.filters[box][stateFilter.key] = stateFilter.values;
                    break;
                case 'double_multiple_choices':
                    data.filters[box][stateFilter.key] = stateFilter.values;
                    break;
                case 'integer_range':
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['min'] = stateFilter.value_min;
                    data.filters[box][stateFilter.key]['max'] = stateFilter.value_max;
                    break;
                case 'integer':
                    data.filters[box][stateFilter.key] = stateFilter.value;
                    break;
                default:
                    break;
            }
        }
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
                <div className="users-filters-wrapper">
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
        );
    }
}
