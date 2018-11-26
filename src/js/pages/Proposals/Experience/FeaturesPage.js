import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/experience/features.scss';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";
import RoundedIcon from "../../../components/ui/RoundedIcon/RoundedIcon";
import FrameCollapsible from "../../../components/ui/FrameCollapsible/FrameCollapsible";
import ThreadStore from "../../../stores/ThreadStore";
import FilterStore from "../../../stores/FilterStore";
import * as ThreadActionCreators from "../../../actions/ThreadActionCreators";
import ChoiceFilter from "../../../components/_threads/filters/ChoiceFilter";
import LocationFilter from "../../../components/_threads/filters/LocationFilter";
import IntegerRangeFilter from "../../../components/Threads/Filters/IntegerRangeFilter";
import IntegerFilter from "../../../components/Threads/Filters/IntegerFilter";
import MultipleChoicesFilter from "../../../components/Threads/Filters/MultipleChoicesFilter";
import DoubleMultipleChoicesFilter from "../../../components/_threads/filters/DoubleMultipleChoicesFilter";
import ChoiceAndMultipleChoicesFilter from "../../../components/Threads/Filters/ChoiceAndMultipleChoicesFilter";
import TagFilter from "../../../components/Threads/Filters/TagFilter";
import TagsAndMultipleChoicesFilter from "../../../components/Threads/Filters/TagsAndMultipleChoicesFilter";
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";

function parseThreadId(thread) {
    return thread && thread.hasOwnProperty('id') ? thread.id : null;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    ThreadActionCreators.requestFilters(userId);
    ThreadActionCreators.requestThreads(userId);
}

function getDisplayedThread(props) {

    if (props.params.groupId) {
        return ThreadStore.getByGroup(props.params.groupId) || {};
    }

    return ThreadStore.getMainDiscoverThread();
}

function getState(props) {
    const mainThread = getDisplayedThread(props);
    const filters = FilterStore.filters;
    const tags = TagSuggestionsStore.tags;
    const threadId = parseThreadId(mainThread);
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
@translate('ProposalsLeisureFeaturesPage')
@connectToStores([FilterStore, TagSuggestionsStore, ThreadStore], getState)
export default class FeaturesPage extends Component {

    static propTypes = {
        threadId    : PropTypes.string,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        filters     : PropTypes.object,
        tags        : PropTypes.array,
        thread      : PropTypes.object.isRequired,
        categories  : PropTypes.array,
        errors      : PropTypes.string,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);


        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeFilterAndUnSelect = this.handleChangeFilterAndUnSelect.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.handleErrorFilter = this.handleErrorFilter.bind(this);
        this.renderField = this.renderField.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);

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

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-experience-availability');
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.push('/proposals');
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
        // const threadId = this.props.thread.id;
        let userFilters = Object.assign({}, this.props.thread.filters.userFilters);
        if (userFilters[field]) {
            userFilters[field] = null;
        }

        // let data = {
        //     name    : this.props.thread.name,
        //     filters : {userFilters: userFilters},
        //     category: 'ThreadUsers'
        // };

        // ThreadActionCreators.updateThread(threadId, data)
        //     .then(() => {
        //         this.setState({updated: true});
        //     }, () => {
        //         // TODO: Handle error
        //     });
        this.setState({data: userFilters});
    }

    handleErrorFilter() {

    }

    save(field, filter) {
        // const threadId = this.props.thread.id;
        const filters = {userFilters: {...this.props.thread.filters.userFilters, ...{[field]: filter}}};
        // let data = {
        //     name    : this.props.thread.name,
        //     filters : filters,
        //     category: 'ThreadUsers'
        // };

        // ThreadActionCreators.updateThread(threadId, data)
        //     .then(() => {
        //         this.setState({updated: true});
        //     }, () => {
        //         // TODO: Handle error
        //     });
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
            />
        );
    }

    renderIntegerRangeFilter(field, filter, data) {
        return (
            <IntegerRangeFilter filterKey={field}
                                filter={filter}
                                data={data}
                                handleChangeFilter={this.handleChangeFilter}
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
            />
        );
    }

    renderChoiceAndMultipleChoicesFilter(field, filter, data) {
        return (
            <ChoiceAndMultipleChoicesFilter filterKey={field}
                                            filter={filter}
                                            data={data}
                                            handleChangeFilter={this.handleChangeFilter}
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
            />
        );
    }

    handleStepsBarClick() {
        const proposal = {
            filters: {
                userFilters: this.state.data
            }
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-experience-preview');
    }

    render() {
        const {user, tags, thread, categories, strings} = this.props;
        const {updated} = this.state;
        const canContinue = true;

        return (
            <div className="views">
                <div className="view view-main proposals-experience-features-view">
                    <TopNavBar
                        background={'#FBFCFD'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-experience-features-wrapper">
                        <h2>{strings.title}</h2>
                        <div className={'warning-container'}>
                            <div className={'warning-icon-container'}>
                                <RoundedIcon
                                    color={'#818FA1'}
                                    background={'#FBFCFD'}
                                    icon={'eye'}
                                    size={'small'}/>
                            </div>
                            <div>{strings.filterWarning}</div>
                        </div>

                        {categories ?
                            categories.map((category, index) =>
                                <FrameCollapsible
                                    key={index}
                                    title={category.label}>
                                    {category.fields.map((field, index) =>
                                        <div key={index} className="filter">
                                            {/*<div className="remove">*/}
                                                {/*<RoundedIcon*/}
                                                    {/*icon={'delete'}*/}
                                                    {/*size={'small'}*/}
                                                    {/*fontSize={'16px'}*/}
                                                    {/*disabled={field === 'group' && thread.groupId != null}*/}
                                                    {/*onClickHandler={this.handleClickRemoveFilter.bind(this, field)}/>*/}
                                            {/*</div>*/}
                                            {this.renderField(field)}
                                        </div>
                                    )}
                                </FrameCollapsible>)
                            : null
                        }
                    </div>
                </div>

                <StepsBar
                    color={'green'}
                    totalSteps={5}
                    currentStep={4}
                    continueText={strings.stepsBarContinueText}
                    cantContinueText={strings.stepsBarCantContinueText}
                    canContinue={canContinue}
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }
}

FeaturesPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        title                    : 'Are you looking for people with specific features?',
        filterWarning            : 'This filters only be visible for you and we need to filter users',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'You cannot continue',
    }
};