import React, { PropTypes, Component } from 'react';
import FullWidthButton from '../ui/FullWidthButton';
import SetThreadTitlePopup from './SetThreadTitlePopup';
import ThreadCategoryFilterList from './filters/ThreadCategoryFilterList';
import ChoiceFilter from './filters/ChoiceFilter';
import LocationFilter from './filters/LocationFilter';
import IntegerRangeFilter from './filters/IntegerRangeFilter';
import IntegerFilter from './filters/IntegerFilter';
import MultipleChoicesFilter from './filters/MultipleChoicesFilter';
import DoubleMultipleChoicesFilter from './filters/DoubleMultipleChoicesFilter';
import TagFilter from './filters/TagFilter';
import TagsAndMultipleChoicesFilter from './filters/TagsAndMultipleChoicesFilter';
import * as TagSuggestionsActionCreators from '../../actions/TagSuggestionsActionCreators';
import selectn from 'selectn';
import translate from '../../i18n/Translate';
import FilterStore from '../../stores/FilterStore';

@translate('CreateUsersThread')
export default class CreateUsersThread extends Component {

    static propTypes = {
        userId        : PropTypes.number.isRequired,
        defaultFilters: PropTypes.object.isRequired,
        threadName    : PropTypes.string,
        tags          : PropTypes.array.isRequired,
        thread        : PropTypes.object,
        categories    : PropTypes.array,
        onSave        : PropTypes.func.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickAddFilter = this.handleClickAddFilter.bind(this);
        this.handleClickFilterOnList = this.handleClickFilterOnList.bind(this);
        this.renderActiveFilters = this.renderActiveFilters.bind(this);
        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleErrorFilter = this.handleErrorFilter.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.renderChoiceFilter = this.renderChoiceFilter.bind(this);
        this.renderLocationFilter = this.renderLocationFilter.bind(this);
        this.renderMultipleChoicesFilter = this.renderMultipleChoicesFilter.bind(this);
        this.renderDoubleMultipleChoicesFilter = this.renderDoubleMultipleChoicesFilter.bind(this);
        this.renderIntegerRangeFilter = this.renderIntegerRangeFilter.bind(this);
        this.renderIntegerFilter = this.renderIntegerFilter.bind(this);
        this.renderTagFilter = this.renderTagFilter.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeFilterAndUnSelect = this.handleChangeFilterAndUnSelect.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.scrollToFilter = this.scrollToFilter.bind(this);
        this.goToSelectedFilters = this.goToSelectedFilters.bind(this);
        this.editThread = this.editThread.bind(this);
        this.createThread = this.createThread.bind(this);
        this.onSaveTitle = this.onSaveTitle.bind(this);
        this.getDefaultTitle = this.getDefaultTitle.bind(this);
        this.getOrderDefaultFilter = this.getOrderDefaultFilter.bind(this);

        this.state = {
            selectFilter        : false,
            selectedFilter      : null,
            filters             : selectn('thread.filters.userFilters', props) || {},
            displayingTitlePopup: null
        }
    }

    componentDidMount() {
        window.nekunoContainer.addEventListener('click', this.handleClickOutside)
    }

    componentWillUnmount() {
        window.nekunoContainer.removeEventListener('click', this.handleClickOutside)
    }

    handleClickAddFilter() {
        TagSuggestionsActionCreators.resetTagSuggestions();
        this.setState({
            selectFilter: true
        })
    }

    handleClickFilterOnList(checked, value) {
        if (this.props.thread.groupId != null && value === 'groups'){
            return;
        }
        let filters = this.state.filters;
        let filterData = Object.keys(filters).find(key => key === value) || null;

        if (checked) {
            filters[value] = filterData;
            this.setState({
                selectFilter  : false,
                selectedFilter: value,
                filters       : filters
            });
            this.scrollToFilter();
        } else {
            delete filters[value];
            this.setState({
                filters       : filters,
                selectedFilter: null
            });
        }
    }

    renderActiveFilters() {
        const defaultFilters = Object.assign({}, this.props.defaultFilters);
        const {filters} = this.state;
        const {tags, thread} = this.props;
        return (
            Object.keys(filters).map(key => {
                const selected = this.state.selectedFilter === key;
                let filter = null;
                if (key == 'order') {
                    return null;
                }
                switch (defaultFilters[key].type) {
                    case 'location_distance':
                        filter = this.renderLocationFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'integer_range':
                        filter = this.renderIntegerRangeFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'birthday_range':
                        filter = this.renderIntegerRangeFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'integer':
                        filter = this.renderIntegerFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'multiple_choices':
                        const cantRemove = thread.groupId != null && key == 'groups';
                        filter = this.renderMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected, cantRemove);
                        break;
                    case 'double_multiple_choices':
                        filter = this.renderDoubleMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'tags_and_multiple_choices':
                        filter = this.renderTagsAndMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected, tags);
                        break;
                    case 'tags':
                        filter = this.renderTagFilter(defaultFilters[key], key, filters[key], selected, tags);
                        break;
                }
                return <div key={key} ref={selected ? 'selectedFilter' : ''}>{filter}</div>;
            })
        );
    }


    renderChoiceFilter(filter, key, data, selected) {
        return (
            <ChoiceFilter filterKey={key}
                          filter={filter}
                          data={data}
                          selected={selected}
                          handleClickRemoveFilter={this.handleClickRemoveFilter}
                          handleChangeFilter={this.handleChangeFilterAndUnSelect}
                          handleClickFilter={this.handleClickFilter}
                          cantRemove={key === 'order'}
            />
        );
    }

    renderLocationFilter(filter, key, data, selected) {
        return (
            <LocationFilter filterKey={key}
                            filter={filter}
                            data={data}
                            selected={selected}
                            handleClickRemoveFilter={this.handleClickRemoveFilter}
                            handleChangeFilter={this.handleChangeFilter}
                            handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderIntegerRangeFilter(filter, key, data, selected) {
        return (
            <IntegerRangeFilter filterKey={key}
                                filter={filter}
                                data={data}
                                selected={selected}
                                handleClickRemoveFilter={this.handleClickRemoveFilter}
                                handleChangeFilter={this.handleChangeFilterAndUnSelect}
                                handleClickFilter={this.handleClickFilter}
                                handleErrorFilter={this.handleErrorFilter}
            />
        )
    }

    renderIntegerFilter(filter, key, data, selected) {
        return (
            <IntegerFilter filterKey={key}
                           filter={filter}
                           data={data}
                           selected={selected}
                           handleClickRemoveFilter={this.handleClickRemoveFilter}
                           handleChangeFilter={this.handleChangeFilterAndUnSelect}
                           handleClickFilter={this.handleClickFilter}
                           handleErrorFilter={this.handleErrorFilter}
            />
        )
    }

    renderMultipleChoicesFilter(filter, key, data, selected, cantRemove) {
        return (
            <MultipleChoicesFilter filterKey={key}
                                   filter={filter}
                                   data={data}
                                   selected={selected}
                                   cantRemove={cantRemove}
                                   handleClickRemoveFilter={this.handleClickRemoveFilter}
                                   handleChangeFilter={this.handleChangeFilter}
                                   handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderDoubleMultipleChoicesFilter(filter, key, data, selected) {
        return (
            <DoubleMultipleChoicesFilter filterKey={key}
                                         filter={filter}
                                         data={data}
                                         selected={selected}
                                         handleClickRemoveFilter={this.handleClickRemoveFilter}
                                         handleChangeFilter={this.handleChangeFilter}
                                         handleClickFilter={this.handleClickFilter}
            />
        );
    }

    renderTagFilter(filter, key, data, selected, tags) {
        return (
            <TagFilter filterKey={key}
                       filter={filter}
                       data={data}
                       selected={selected}
                       handleClickRemoveFilter={this.handleClickRemoveFilter}
                       handleChangeFilter={this.handleChangeFilterAndUnSelect}
                       handleClickFilter={this.handleClickFilter}
                       tags={tags}
            />
        );
    }

    renderTagsAndMultipleChoicesFilter(filter, key, data, selected, tags) {
        return (
            <TagsAndMultipleChoicesFilter filterKey={key}
                                          filter={filter}
                                          data={data}
                                          selected={selected}
                                          handleClickRemoveFilter={this.handleClickRemoveFilter}
                                          handleChangeFilter={this.handleChangeFilter}
                                          handleClickFilter={this.handleClickFilter}
                                          tags={tags}
            />
        );
    }

    handleErrorFilter(key, error) {
        let {filters} = this.state;
        nekunoApp.alert(error);
        filters[key] = {};
        this.setState({
            selectedFilter: key
        });
    }

    handleChangeFilter(key, data) {
        let {filters} = this.state;
        filters[key] = data;
        this.setState({
            filters       : filters,
            selectedFilter: key
        });
    }

    handleChangeFilterAndUnSelect(key, data) {
        let {filters} = this.state;
        filters[key] = data;
        this.setState({
            filters       : filters,
            selectedFilter: null
        });
    }

    handleClickFilter(key) {
        if (this.props.thread.groupId != null && key=="groups"){
            return;
        }
        let {filters} = this.state;
        filters[key] = filters[key] || null;
        TagSuggestionsActionCreators.resetTagSuggestions();
        this.setState({
            selectedFilter: key,
            filters       : filters
        });
    }

    handleClickRemoveFilter(key) {
        let {filters, selectedFilter} = this.state;
        if (key) {
            delete filters[key];
        } else {
            delete filters[selectedFilter];
        }
        this.setState({
            filters       : filters,
            selectedFilter: null
        })
    }

    handleClickOutside(e) {
        const selectedFilter = this.refs.selectedFilter;
        if (selectedFilter && !selectedFilter.contains(e.target)) {
            this.setState({selectedFilter: null});
        }
    }

    scrollToFilter() {
        clearTimeout(this.selectFilterTimeout);
        this.selectFilterTimeout = setTimeout(() => {
            let selectedFilterElem = this.refs.selectedFilter;
            if (selectedFilterElem) {
                selectedFilterElem.scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }
        }, 0);
    }

    createThread() {
        if (this.getDefaultTitle()) {
            window.setTimeout(() => {
                nekunoApp.popup('.popup-set-thread-title');
                document.getElementsByClassName('view')[0].scrollTop = 0;
                window.setTimeout(() => { this.setState({'displayingTitlePopup': true}) }, 200);
            }, 0);
        } else {
            nekunoApp.alert(this.props.strings.addFilters);
        }
    }

    onSaveTitle(title) {
        let data = {
            name    : title,
            filters : {userFilters: this.state.filters},
            category: 'ThreadUsers'
        };

        this.props.onSave(data);
    }

    editThread() {
        let data = {
            name    : this.props.threadName,
            filters : {userFilters: this.state.filters},
            category: 'ThreadUsers'
        };

        this.props.onSave(data);
    }

    goToSelectedFilters() {
        this.setState({
            selectFilter: false
        });
    }

    getDefaultTitle() {
        const {filters} = this.state;
        const {defaultFilters} = this.props;
        const firstFilterIndex = Object.keys(filters).find((filterIndex, index) => index == 0);
        if (firstFilterIndex && FilterStore.isFilterSet(defaultFilters[firstFilterIndex], filters[firstFilterIndex])) {
            if (defaultFilters[firstFilterIndex].type === 'order') {
                defaultFilters[firstFilterIndex] = this.getOrderDefaultFilter();
            }
            return FilterStore.getFilterLabel(defaultFilters[firstFilterIndex], filters[firstFilterIndex]);
        }

        return null;
    }

    getOrderDefaultFilter() {
        const {strings} = this.props;
        return {
            label: strings.order,
            type: 'order',
            choices: [
                {
                    label: strings.matching,
                    value: 'matching'
                },
                {
                    label: strings.similarity,
                    value: 'similarity'
                }
            ]
        }
    }


    render() {
        let categories = this.props.categories;
        let defaultFilters = Object.assign({}, this.props.defaultFilters);
        const data = this.state.filters || {};
        let filterKeys = Object.keys(defaultFilters).filter(key => Object.keys(data).some(dataKey => dataKey === key));
        let filters = {};
        filterKeys.forEach(key => {
            if (typeof data[key] !== 'undefined') {
                filters[key] = defaultFilters[key]
            }
        });
        let strings = this.props.strings;
        return (
            this.state.selectFilter ?
                <div className="select-filter">
                    <span className="back-to-selected-filters" onClick={this.goToSelectedFilters}>{strings.back}</span>
                    <div className="title">{strings.selectFilter}</div>
                    <ThreadCategoryFilterList categories={categories} filters={filters} filtersMetadata={defaultFilters} handleClickFilterOnList={this.handleClickFilterOnList}/>
                </div>
                :
                <div className="users-filters-wrapper">
                    <div className="table-row"></div>
                    {this.renderActiveFilters()}
                    {this.renderChoiceFilter(this.getOrderDefaultFilter(), 'order', data['order'] || 'matching', this.state.selectedFilter === 'order')}
                    <div className="table-row"></div>
                    <div className="add-filter-title">{strings.addFilterTitle}</div>
                    <div className="thread-filter add-filter">
                        <div className="thread-filter-dot">
                            <span className="icon-plus active"></span>
                        </div>
                        <div className="opposite-vertical-line"></div>
                        <div className="add-filter-button-wrapper" onClick={this.handleClickAddFilter}>
                            <div className="add-filter-button">
                                <span className="add-filter-button-text">{strings.addFilter}</span>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <FullWidthButton onClick={this.props.thread ? this.editThread : this.createThread}>{this.props.thread ? strings.save : strings.create}</FullWidthButton>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    {this.getDefaultTitle() ? <SetThreadTitlePopup displaying={this.state.displayingTitlePopup} onClick={this.onSaveTitle} defaultTitle={this.getDefaultTitle()}/> : null}
                </div>
        );
    }
}

CreateUsersThread.defaultProps = {
    strings: {
        back          : 'Back',
        selectFilter  : 'Select filter',
        addFilterTitle: 'You can add filters to be more specific',
        addFilter     : 'Add filter',
        save          : 'Save',
        create        : 'Create',
        addFilters    : 'Add a filter first',
        order         : 'Order',
        matching      : 'Matching',
        similarity    : 'Similarity',
    }
};