import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import FullWidthButton from '../ui/FullWidthButton';
import ThreadFilterList from './filters/ThreadFilterList';
import LocationFilter from './filters/LocationFilter';
import IntegerRangeFilter from './filters/IntegerRangeFilter';
import ChoiceFilter from './filters/ChoiceFilter';
import DoubleChoiceFilter from './filters/DoubleChoiceFilter';
import MultipleChoicesFilter from './filters/MultipleChoicesFilter';
import TagFilter from './filters/TagFilter';
import TagsAndChoiceFilter from './filters/TagsAndChoiceFilter';
import selectn from 'selectn';

export default class CreateUsersThread extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        userId: PropTypes.number.isRequired,
        filters: PropTypes.object.isRequired,
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
        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
        this.renderChoiceFilter = this.renderChoiceFilter.bind(this);
        this.renderDoubleChoiceFilter = this.renderDoubleChoiceFilter.bind(this);
        this.renderMultipleChoicesFilter = this.renderMultipleChoicesFilter.bind(this);
        this.renderIntegerRangeFilter = this.renderIntegerRangeFilter.bind(this);
        this.renderTagFilter = this.renderTagFilter.bind(this);
        this.renderTagAndChoiceFilter = this.renderTagAndChoiceFilter.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickDoubleChoiceChoice = this.handleClickDoubleChoiceChoice.bind(this);
        this.handleClickDoubleChoiceDetail = this.handleClickDoubleChoiceDetail.bind(this);
        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
        this.handleClickRemoveTagsAndChoice = this.handleClickRemoveTagsAndChoice.bind(this);
        this.handleClickTagAndChoiceChoice = this.handleClickTagAndChoiceChoice.bind(this);
        this.handleClickTagAndChoiceTagSuggestion = this.handleClickTagAndChoiceTagSuggestion.bind(this);
        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.createThread = this.createThread.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.findSelectedFilterIndex = this.findSelectedFilterIndex.bind(this);

        this.state = {
            selectFilter: false,
            selectedFilter: {},
            filters: []
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
        let filter = filters.find(key => key === value);
        if (typeof filter == 'undefined') {
            let defaultFilters = Object.assign({}, this.props.filters);
            filter = Object.keys(defaultFilters).map(key => defaultFilters[key]).find(function (defaultFilter) {
                return defaultFilter.key === value;
            });
        }
        if (checked) {
            filters.push(filter);
            this.setState({
                selectFilter: false,
                selectedFilter: filter,
                filters: filters
            });
            clearTimeout(this.selectFilterTimeout);
            this.selectFilterTimeout = setTimeout(() => {
                let selectedFilterElem = this.refs.selectedFilter;
                if (selectedFilterElem) {
                    selectedFilterElem.getSelectedFilter().scrollIntoView();
                    document.getElementsByClassName('view')[0].scrollTop -= 100;
                }
            })
        } else {
            let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
            filters.splice(index, 1);
            this.setState({
                filters: filters,
                selectedFilter: {}
            });
        }
    }

    renderActiveFilters() {
        let filters = this.state.filters;
        return (
            filters.map((filter, index) => {
                const selected = this.state.selectedFilter && this.state.selectedFilter.key === filter.key;
                switch (filter.type) {
                    case 'location_distance':
                        return this.renderLocationFilter(filter, index, selected);
                        break;
                    case 'integer_range':
                        return this.renderIntegerRangeFilter(filter, index, selected);
                        break;
                    case 'choice':
                        return this.renderChoiceFilter(filter, index, selected);
                        break;
                    case 'double_choice':
                        return this.renderDoubleChoiceFilter(filter, index, selected);
                        break;
                    case 'multiple_choices':
                        return this.renderMultipleChoicesFilter(filter, index, selected);
                        break;
                    case 'tags_and_choice':
                        return this.renderTagAndChoiceFilter(filter, index, selected);
                        break;
                    case 'tags':
                        return this.renderTagFilter(filter, index, selected);
                }
            })
        );
    }

    renderLocationFilter(filter, index, selected) {
        return (
            <LocationFilter key={index} ref={selected ? 'selectedFilter' : ''}
                            filter={filter}
                            selected={selected}
                            handleClickRemoveFilter={this.handleClickRemoveFilter}
                            handleClickLocationSuggestion={this.handleClickLocationSuggestion}
                            handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderIntegerRangeFilter(filter, index, selected) {
        return(
            <IntegerRangeFilter key={index} ref={selected ? 'selectedFilter' : ''}
                           filter={filter}
                           selected={selected}
                           handleClickRemoveFilter={this.handleClickRemoveFilter} 
                           handleChangeIntegerInput={this.handleChangeIntegerInput}
                           handleClickFilter={this.handleClickFilter}
            />
        )
    }

    renderChoiceFilter(filter, index, selected) {
        return (
            <ChoiceFilter key={index} ref={selected ? 'selectedFilter' : ''}
                          filter={filter}
                          selected={selected}
                          handleClickRemoveFilter={this.handleClickRemoveFilter}
                          handleClickChoice={this.handleClickChoice}
                          handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderDoubleChoiceFilter(filter, index, selected) {
        return (
            <DoubleChoiceFilter key={index} ref={selected ? 'selectedFilter' : ''}
                                filter={filter}
                                selected={selected}
                                handleClickRemoveFilter={this.handleClickRemoveFilter}
                                handleClickDoubleChoiceChoice={this.handleClickDoubleChoiceChoice}
                                handleClickDoubleChoiceDetail={this.handleClickDoubleChoiceDetail}
                                handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderMultipleChoicesFilter(filter, index, selected) {
        return (
            <MultipleChoicesFilter key={index} ref={selected ? 'selectedFilter' : ''}
                                   filter={filter}
                                   selected={selected}
                                   handleClickRemoveFilter={this.handleClickRemoveFilter}
                                   handleClickMultipleChoice={this.handleClickMultipleChoice}
                                   handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderTagFilter(filter, index, selected) {
        return (
            <TagFilter key={index} ref={selected ? 'selectedFilter' : ''}
                       filter={filter}
                       selected={selected}
                       handleClickRemoveFilter={this.handleClickRemoveFilter}
                       handleClickTagSuggestion={this.handleClickTagSuggestion}
                       handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderTagAndChoiceFilter(filter, index, selected) {
        return (
            <TagsAndChoiceFilter key={index} ref={selected ? 'selectedFilter' : ''}
                                 filter={filter}
                                 selected={selected}
                                 handleClickRemoveFilter={this.handleClickRemoveFilter}
                                 handleClickTagAndChoiceTagSuggestion={this.handleClickTagAndChoiceTagSuggestion}
                                 handleClickTagAndChoiceChoice={this.handleClickTagAndChoiceChoice}
                                 handleClickRemoveTagsAndChoice={this.handleClickRemoveTagsAndChoice}
                                 handleClickTagAndChoiceTag={this.handleClickTagAndChoiceTag}
                                 handleClickFilter={this.handleClickFilter}
            />
        );
    }
    
    handleClickLocationSuggestion(location) {
        let {filters, selectedFilter} = this.state;
        filters[this.findSelectedFilterIndex()] = this.refs.selectedFilter.updateFilterLocation(selectedFilter, location);
        this.setState({
            filters: filters,
            selectedFilter: {}
        });
    }

    handleChangeIntegerInput(value, minOrMax) {
        let {filters, selectedFilter} = this.state;
        let filter = this.refs.selectedFilter.updateFilterInteger(selectedFilter, value, minOrMax)
        filters[this.findSelectedFilterIndex()] = filter;
        this.setState({
            selectedFilter: filter,
            filters: filters
        });
    }

    handleClickChoice(choice) {
        let {filters, selectedFilter} = this.state;
        let filter = this.refs.selectedFilter.updateFilterChoice(selectedFilter, choice);
        filters[this.findSelectedFilterIndex()] = filter;
        this.setState({
            filters: filters,
            selectedFilter: filter
        });
    }

    handleClickDoubleChoiceChoice(choice) {
        let {filters, selectedFilter} = this.state;
        let filter = this.refs.selectedFilter.updateFilterChoice(selectedFilter, choice);
        filters[this.findSelectedFilterIndex()] = filter;
        this.setState({
            filters: filters,
            selectedFilter: filter
        });
    }

    handleClickDoubleChoiceDetail(detail) {
        let {filters, selectedFilter} = this.state;
        let filter = this.refs.selectedFilter.updateFilterDetail(selectedFilter, detail);
        filters[this.findSelectedFilterIndex()] = filter;
        this.setState({
            filters: filters,
            selectedFilter: filter
        });
    }

    handleClickMultipleChoice(choice) {
        let {filters, selectedFilter} = this.state;
        let filter = this.refs.selectedFilter.updateFilterChoice(selectedFilter, choice);
        filters[this.findSelectedFilterIndex()] = filter;
        this.setState({
            filters: filters,
            selectedFilter: filter
        });
    }

    handleClickRemoveTagsAndChoice(tagAndChoiceIndex) {
        let {filters, selectedFilter} = this.state;
        let filter = this.refs.selectedFilter.removeTagAndChoice(selectedFilter, tagAndChoiceIndex);
        filters[this.findSelectedFilterIndex()] = filter;
        this.setState({
            filters: filters,
            selectedFilter: filter
        });
    }

    handleClickTagSuggestion(tagString) {
        let {filters, selectedFilter} = this.state;
        filters[this.findSelectedFilterIndex()] = this.refs.selectedFilter.updateFilterTag(selectedFilter, tagString);
        this.setState({
            filters: filters,
            selectedFilter: {}
        });
    }

    handleClickTagAndChoiceTagSuggestion(tagString) {
        let {filters, selectedFilter} = this.state;
        filters[this.findSelectedFilterIndex()] = this.refs.selectedFilter.updateFilterTag(selectedFilter, tagString);
        this.setState({
            filters: filters
        });
    }

    handleClickTagAndChoiceChoice(choice, selectedTag) {
        let {filters, selectedFilter} = this.state;
        let filter = this.refs.selectedFilter.updateFilterChoice(selectedFilter, choice, selectedTag);
        filters[this.findSelectedFilterIndex()] = filter;
        this.setState({
            filters: filters,
            selectedFilter: filter
        });
    }

    handleClickFilter(key) {
        let filters = this.state.filters;
        this.setState({
            selectedFilter: filters.find(filter => filter.key === key)
        });
    }

    handleClickRemoveFilter() {
        let filters = this.state.filters;
        filters.splice(this.findSelectedFilterIndex(), 1);
        this.setState({
            filters: filters,
            selectedFilter: {}
        })
    }

    handleClickOutside(e) {
        const selectedFilter = this.refs.selectedFilter;
        if (selectedFilter && selectedFilter.getSelectedFilter() && !selectedFilter.selectedFilterContains(e.target)) {
            this.setState({selectedFilter: {}});
        }
    }
    
    findSelectedFilterIndex() {
        let {filters, selectedFilter} = this.state;
        let index = filters.findIndex(savedFilter => savedFilter.key === selectedFilter.key);
        
        return index > -1 ? index : null;
    }

    createThread() {
        let data = {
            name: this.props.threadName,
            filters: {profileFilters: {}, userFilters: {}},
            category: 'ThreadUsers'
        };

        let stateFilters = this.state.filters;

        for (let stateFilter of stateFilters) {
            //TODO: Improve reading from metadata
            let box = 'profileFilters';
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
                case 'double_choice':
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['choice'] = stateFilter.choice;
                    data.filters[box][stateFilter.key]['detail'] = stateFilter.detail;
                    break;
                case 'multiple_choices':
                    data.filters[box][stateFilter.key] = stateFilter.values;
                    break;
                case 'integer_range':
                    if (stateFilter.key == 'similarity' || stateFilter.key == 'compatibility'){
                        box = 'userFilters';
                    }
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['min'] = selectn('value_min', stateFilter)? stateFilter.value_min : stateFilter.min;
                    data.filters[box][stateFilter.key]['max'] = selectn('value_max', stateFilter)? stateFilter.value_max : stateFilter.max;
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
        let filtersMetadata = Object.assign({}, this.props.filters);
        Object.keys(filtersMetadata).forEach(key => filtersMetadata[key].key = key);
        return (
            this.state.selectFilter ?
                <div className="select-filter">
                    <div className="title">Selecciona un filtro</div>
                    <ThreadFilterList filters={this.state.filters}
                                      filtersMetadata={filtersMetadata}
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
