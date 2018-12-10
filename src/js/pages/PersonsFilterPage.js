import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import FrameCollapsible from '../components/ui/FrameCollapsible/FrameCollapsible.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import ChoiceFilter from '../components/_threads/filters/ChoiceFilter';
import LocationFilter from '../components/Threads/Filters/LocationFilter';
import IntegerRangeFilter from '../components/Threads/Filters/IntegerRangeFilter';
import IntegerFilter from '../components/Threads/Filters/IntegerFilter';
import MultipleChoicesFilter from '../components/Threads/Filters/MultipleChoicesFilter';
import DoubleMultipleChoicesFilter from '../components/_threads/filters/DoubleMultipleChoicesFilter';
import ChoiceAndMultipleChoicesFilter from '../components/Threads/Filters/ChoiceAndMultipleChoicesFilter';
import StepsBar from '../components/ui/StepsBar/StepsBar.js';
import TagFilter from '../components/Threads/Filters/TagFilter';
import TagsAndMultipleChoicesFilter from '../components/Threads/Filters/TagsAndMultipleChoicesFilter';
import FilterStore from '../stores/FilterStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import ThreadStore from '../stores/ThreadStore';
import '../../scss/pages/persons-filter.scss';

function parseThreadId(params) {
    return params.threadId;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    ThreadActionCreators.requestFilters(userId);
    ThreadActionCreators.requestThreads(userId);
}

function getState(props) {
    const filters = FilterStore.filters;
    const tags = TagSuggestionsStore.tags;
    const threadId = parseThreadId(props.params);
    const thread = ThreadStore.get(threadId);
    const categories = ThreadStore.getCategories();
    const errors = ThreadStore.getErrors();

    return {
        tags,
        filters,
        thread,
        categories,
        errors
    };
}

@AuthenticatedComponent
@translate('PersonsFilterPage')
@connectToStores([FilterStore, TagSuggestionsStore, ThreadStore], getState)
export default class PersonsFilterPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params    : PropTypes.shape({
            threadId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        filters   : PropTypes.object,
        tags      : PropTypes.array,
        thread    : PropTypes.object.isRequired,
        categories: PropTypes.array,
        errors    : PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.goToPersonsAll = this.goToPersonsAll.bind(this);
        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeFilterAndUnSelect = this.handleChangeFilterAndUnSelect.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.handleErrorFilter = this.handleErrorFilter.bind(this);

        const data = props.thread && props.thread.filters && props.thread.filters.userFilters ? props.thread.filters.userFilters : {};
        this.state = {
            data: data,
        }
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        const {thread} = this.props;
        const {data} = this.state;
        if (Object.keys(data).length === 0 && thread && thread.filters && thread.filters.userFilters && Object.keys(thread.filters.userFilters).length > 0) {
            this.setState({data: thread.filters.userFilters})
        }
    }

    goToPersonsAll() {
        this.context.router.push('/persons-all');
    }

    handleClickFilter(field, filter) {
        this.save(field, filter);
    }

    handleChangeFilter(field, filter) {
        this.save(field, filter);
    }

    handleChangeFilterAndUnSelect(field, filter) {
        this.save(field, filter);
    }

    handleClickRemoveFilter(field) {
        const threadId = this.props.thread.id;
        let userFilters = Object.assign({}, this.props.thread.filters.userFilters);
        if (userFilters[field]) {
            userFilters[field] = null;
        }

        let data = {
            name    : this.props.thread.name,
            filters : {userFilters: userFilters},
            category: 'ThreadUsers'
        };

        ThreadActionCreators.updateThread(threadId, data)
            .then(() => {
                this.setState({updated: true});
            }, () => {
                // TODO: Handle error
            });
        this.setState({data: userFilters});
    }

    handleErrorFilter() {

    }

    save(field, filter) {
        const threadId = this.props.thread.id;
        const filters = {userFilters: {...this.props.thread.filters.userFilters, ...{[field]: filter}}};
        let data = {
            name    : this.props.thread.name,
            filters : filters,
            category: 'ThreadUsers'
        };

        ThreadActionCreators.updateThread(threadId, data)
            .then(() => {
                this.setState({updated: true});
            }, () => {
                // TODO: Handle error
            });
        this.setState({data: filters.userFilters});
    }

    renderField(field) {
        const {tags, filters} = this.props;
        const {data} = this.state;

        if (filters && filters.userFilters && filters.userFilters[field]) {
            const filter = filters.userFilters[field];
            const filterData = data[field] ? data[field] : null;
            switch (filter.type) {
                case 'location_distance':
                    return this.renderLocationFilter(field, filter, filterData);
                    break;
                case 'integer_range':
                    return this.renderIntegerRangeFilter(field, filter, filterData);
                    break;
                case 'birthday_range':
                    return this.renderIntegerRangeFilter(field, filter, filterData);
                    break;
                case 'integer':
                    return this.renderIntegerFilter(field, filter, filterData);
                    break;
                case 'multiple_choices':
                    return this.renderMultipleChoicesFilter(field, filter, filterData);
                    break;
                case 'double_multiple_choices':
                    return this.renderDoubleMultipleChoicesFilter(field, filter, filterData);
                    break;
                case 'choice_and_multiple_choices':
                    return this.renderChoiceAndMultipleChoicesFilter(field, filter, filterData);
                    break;
                case 'tags_and_multiple_choices':
                    return this.renderTagsAndMultipleChoicesFilter(field, filter, filterData, tags);
                    break;
                case 'tags':
                    return this.renderTagFilter(field, filter, filterData, tags);
                    break;
            }
        }
    }

    renderChoiceFilter(field, filter, data) {
        return (
            <ChoiceFilter filter={filter}
                          filterKey={field}
                          data={data}
                          selected={true}
                          handleChangeFilter={this.handleChangeFilterAndUnSelect}
                          cantRemove={key === 'order'}
            />
        );
    }


    renderLocationFilter(field, filter, data) {
        return (
            <LocationFilter filterKey={field}
                            filter={filter}
                            data={data}
                            selected={true}
                            handleClickRemoveFilter={this.handleClickRemoveFilter}
                            handleChangeFilter={this.handleChangeFilter}
                            handleClickFilter={this.handleClickFilter}
                            color={'#615acb'}
            />
        );
    }

    renderIntegerRangeFilter(field, filter, data) {
        return (
            <IntegerRangeFilter filterKey={field}
                                filter={filter}
                                data={data}
                                handleChangeFilter={this.handleChangeFilter}
                                color={'#615acb'}
            />
        )
    }

    renderIntegerFilter(field, filter, data) {
        return (
            <IntegerFilter filterKey={field}
                           filter={filter}
                           data={data}
                           handleChangeFilter={this.handleChangeFilterAndUnSelect}
            />
        )
    }

    renderMultipleChoicesFilter(field, filter, data) {
        return (
            <MultipleChoicesFilter filterKey={field}
                                   filter={filter}
                                   data={data}
                                   handleChangeFilter={this.handleChangeFilter}
                                   color={'purple'}
            />
        );
    }

    renderDoubleMultipleChoicesFilter(field, filter, data) {
        return (
            <DoubleMultipleChoicesFilter filterKey={field}
                                         filter={filter}
                                         data={data}
                                         selected={true}
                                         handleClickRemoveFilter={this.handleClickRemoveFilter}
                                         handleChangeFilter={this.handleChangeFilter}
                                         handleClickFilter={this.handleClickFilter}
                                         color={'purple'}
            />
        );
    }

    renderChoiceAndMultipleChoicesFilter(field, filter, data) {
        return (
            <ChoiceAndMultipleChoicesFilter filterKey={field}
                                            filter={filter}
                                            data={data}
                                            handleChangeFilter={this.handleChangeFilter}
                                            color={'purple'}
            />
        );
    }

    renderTagFilter(field, filter, data, tags) {
        return (
            <TagFilter filterKey={field}
                       filter={filter}
                       data={data}
                       selected={true}
                       handleClickRemoveFilter={this.handleClickRemoveFilter}
                       handleChangeFilter={this.handleChangeFilterAndUnSelect}
                       handleClickFilter={this.handleClickFilter}
                       tags={tags}
                       color={'purple'}
            />
        );
    }

    renderTagsAndMultipleChoicesFilter(field, filter, data, tags) {
        return (
            <TagsAndMultipleChoicesFilter filterKey={field}
                                          filter={filter}
                                          data={data}
                                          selected={true}
                                          handleClickRemoveFilter={this.handleClickRemoveFilter}
                                          handleChangeFilter={this.handleChangeFilter}
                                          handleClickFilter={this.handleClickFilter}
                                          tags={tags}
                                          color={'purple'}
            />
        );
    }

    render() {
        const {user, tags, thread, categories, strings} = this.props;
        const {updated} = this.state;

        return (
            <div className="views">
                <div className="view view-main persons-filter-view">
                    <TopNavBar textCenter={strings.title} textSize={'small'} firstIconRight={'x'} boxShadow={true} onRightLinkClickHandler={this.goToPersonsAll}/>
                    <div className="persons-filter-wrapper">
                        {categories ?
                            categories.map((category, index) => <FrameCollapsible key={index} title={category.label}>
                                {category.fields.map((field, index) =>
                                    <div key={index} className="filter">
                                        {/*<div className="remove">*/}
                                            {/*<RoundedIcon icon={'delete'} size={'small'} fontSize={'16px'} disabled={field === 'group' && thread.groupId != null} onClickHandler={this.handleClickRemoveFilter.bind(this, field)}/>*/}
                                        {/*</div>*/}
                                        {this.renderField(field)}
                                    </div>
                                )}
                            </FrameCollapsible>)
                            : null
                        }
                    </div>
                </div>
                {updated ?
                    <StepsBar canContinue={true} continueText={strings.showResults} currentStep={0} onClickHandler={this.goToPersonsAll}/>
                    : null
                }
            </div>
        );
    }

}

PersonsFilterPage.defaultProps = {
    strings: {
        title        : 'Nekuno People',
        orderedBy    : 'Ordered by',
        compatibility: 'compatibility',
        similarity   : 'similarity',
        coincidences : 'coincidences',
        showResults  : 'Show results'
    }
};