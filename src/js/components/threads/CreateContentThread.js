import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThreadFilterList from './filters/ThreadFilterList';
import MultipleChoicesFilter from './filters/MultipleChoicesFilter';
import TagFilter from './filters/TagFilter';
import FullWidthButton from '../ui/FullWidthButton';
import SetThreadTitlePopup from './SetThreadTitlePopup';
import selectn from 'selectn';
import translate from '../../i18n/Translate';
import popup from '../Popup';
import FilterStore from '../../stores/FilterStore';
import Framework7Service from '../../services/Framework7Service';

@translate('CreateContentThread')
@popup('popup-set-thread-title')
export default class CreateContentThread extends Component {

    static propTypes = {
        userId         : PropTypes.number.isRequired,
        defaultFilters : PropTypes.object.isRequired,
        threadName     : PropTypes.string,
        tags           : PropTypes.array.isRequired,
        thread         : PropTypes.object,
        onSave         : PropTypes.func.isRequired,
        // Injected by @translate:
        strings        : PropTypes.object,
        // Injected by @popup:
        showPopup      : PropTypes.func,
        closePopup     : PropTypes.func,
        popupContentRef: PropTypes.func,
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
        this.onSaveTitle = this.onSaveTitle.bind(this);
        this.editThread = this.editThread.bind(this);
        this.goToSelectedFilters = this.goToSelectedFilters.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.getDefaultTitle = this.getDefaultTitle.bind(this);

        this.state = {
            selectFilter        : false,
            selectedFilter      : {},
            filters             : selectn('thread.filters.contentFilters', props) || {},
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
        const {tags} = this.props;
        const {filters} = this.state;
        return (
            Object.keys(filters).map(key => {
                const selected = this.state.selectedFilter === key;
                let filter = null;
                switch (defaultFilters[key].type) {
                    case 'multiple_choices':
                        filter = this.renderMultipleChoicesFilter(defaultFilters[key], key, filters[key], selected);
                        break;
                    case 'tags':
                        filter = this.renderTagFilter(defaultFilters[key], key, filters[key], selected, tags);
                        break;
                }
                return <div key={key} ref={selected ? 'selectedFilter' : ''}>{filter}</div>;
            })
        );
    }

    renderMultipleChoicesFilter(filter, key, data, selected) {
        return (
            <MultipleChoicesFilter filterKey={key}
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
        let {filters} = this.state;
        filters[key] = filters[key] || null;
        this.setState({
            selectedFilter: key,
            filters       : filters
        });
    }

    handleClickRemoveFilter() {
        let {filters, selectedFilter} = this.state;
        delete filters[selectedFilter];
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
                this.props.showPopup();
                document.getElementsByClassName('view')[0].scrollTop = 0;
                window.setTimeout(() => {
                    this.setState({'displayingTitlePopup': true})
                }, 200);
            }, 0);
        } else {
            Framework7Service.nekunoApp().alert(this.props.strings.addFilters);
        }
    }

    onSaveTitle(title) {
        let data = {
            name    : title,
            filters : {contentFilters: this.state.filters},
            category: 'ThreadContent'
        };

        this.props.onSave(data);
    }

    editThread() {
        let data = {
            name    : this.props.threadName,
            filters : {contentFilters: this.state.filters},
            category: 'ThreadContent'
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
            return FilterStore.getFilterLabel(defaultFilters[firstFilterIndex], filters[firstFilterIndex]);
        }

        return null;
    }

    render() {
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
                    <ThreadFilterList filters={filters} filtersMetadata={defaultFilters} handleClickFilterOnList={this.handleClickFilterOnList}/>
                </div>
                :
                <div className="content-filters-wrapper">
                    <div className="table-row"></div>
                    {this.renderActiveFilters()}
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
                    {this.getDefaultTitle() ? <SetThreadTitlePopup displaying={this.state.displayingTitlePopup} onClick={this.onSaveTitle} defaultTitle={this.getDefaultTitle()} contentRef={this.props.popupContentRef}/> : null}
                </div>
        )
    }
}

CreateContentThread.defaultProps = {
    strings: {
        back          : 'Back',
        selectFilter  : 'Select filter',
        addFilterTitle: 'You can add filters to be more specific',
        addFilter     : 'Add filter',
        save          : 'Save',
        create        : 'Create',
        addFilters    : 'Add a filter first'
    }
};