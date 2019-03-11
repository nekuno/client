import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import connectToStores from "../../../utils/connectToStores";
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import ProposalStore from "../../../stores/ProposalStore";
import '../../../../scss/pages/proposals/edit/features-page.scss';
import InputTag from "../../../components/RegisterFields/InputTag/InputTag";
import Frame from "../../../components/ui/Frame/Frame";
import RoundedIcon from "../../../components/ui/RoundedIcon/RoundedIcon";
import * as ThreadActionCreators from "../../../actions/ThreadActionCreators";
import ThreadStore from "../../../stores/ThreadStore";
import FilterStore from "../../../stores/FilterStore";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";
import ChoiceFilter from "../../../components/_threads/filters/ChoiceFilter";
import LocationFilter from "../../../components/Threads/Filters/LocationFilter";
import IntegerRangeFilter from "../../../components/Threads/Filters/IntegerRangeFilter";
import IntegerFilter from "../../../components/Threads/Filters/IntegerFilter";
import MultipleChoicesFilter from "../../../components/Threads/Filters/MultipleChoicesFilter";
import DoubleMultipleChoicesFilter from "../../../components/_threads/filters/DoubleMultipleChoicesFilter";
import ChoiceAndMultipleChoicesFilter from "../../../components/Threads/Filters/ChoiceAndMultipleChoicesFilter";
import TagFilter from "../../../components/Threads/Filters/TagFilter";
import TagsAndMultipleChoicesFilter from "../../../components/Threads/Filters/TagsAndMultipleChoicesFilter";
import FrameCollapsible from "../../../components/ui/FrameCollapsible/FrameCollapsible";

function parseThreadId(thread) {
    return thread && thread.hasOwnProperty('id') ? thread.id : null;
}

function getDisplayedThread(props) {

    if (props.params.groupId) {
        return ThreadStore.getByGroup(props.params.groupId) || {};
    }

    return ThreadStore.getMainDiscoverThread();
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    ThreadActionCreators.requestFilters(userId);
    ThreadActionCreators.requestThreads(userId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const mainThread = getDisplayedThread(props);
    const tags = TagSuggestionsStore.tags;
    const filters = FilterStore.filters;
    const threadId = parseThreadId(mainThread);
    const thread = ThreadStore.get(threadId);
    const categories = ThreadStore.getCategories();
    const errors = ThreadStore.getErrors();

    let proposal;
    let selectedFilters = null;

    if (!CreatingProposalStore.proposal.filters) {
        CreatingProposalStore.proposal.filters = {};
    }
    const proposalId = props.params.proposalId;
    if (proposalId) {
        proposal = ProposalStore.getOwnProposal(proposalId);
        if (proposal) {

            selectedFilters = proposal.filters.userFilters;
            CreatingProposalStore.proposal.filters.userFilters = selectedFilters;

            // CreatingProposalStore.proposal.type = proposal.type;
            // CreatingProposalStore.proposal.fields.title = proposal.fields.title;
            // CreatingProposalStore.proposal.fields.description = proposal.fields.description;
        }
    } else {
        proposal = CreatingProposalStore.proposal;
        // CreatingProposalStore.proposal.type = '';
        // CreatingProposalStore.proposal.fields.title = "";
        // CreatingProposalStore.proposal.fields.description = "";
    }

    return {
        proposal,
        selectedFilters,
        tags,
        filters,
        thread,
        categories,
        errors
    };
}

@AuthenticatedComponent
@translate('ProposalFeaturesPage')
@connectToStores([ProposalStore, CreatingProposalStore, FilterStore, TagSuggestionsStore, ThreadStore], getState)
export default class ProposalFeaturesPage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            proposalId: PropTypes.string
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        proposal    : PropTypes.object,
        selectedFilters : PropTypes.object,
        tags        : PropTypes.array,
        filters     : PropTypes.object,
        thread      : PropTypes.object.isRequired,
        categories  : PropTypes.array,
        errors      : PropTypes.string,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const data = props.thread && props.thread.filters && props.thread.filters.userFilters ? props.thread.filters.userFilters : {};

        this.state = {
            data: CreatingProposalStore.proposal.filters.userFilters ? CreatingProposalStore.proposal.filters.userFilters : data,
        };
        CreatingProposalStore.proposal.filters.userFilters = data;

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);

        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleChangeFilterAndUnSelect = this.handleChangeFilterAndUnSelect.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.handleErrorFilter = this.handleErrorFilter.bind(this);
        this.renderField = this.renderField.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
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
        this.context.router.goBack();
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
        let userFilters = Object.assign({}, this.props.thread.filters.userFilters);
        if (userFilters[field]) {
            userFilters[field] = null;
        }
        this.setState({data: userFilters});
    }

    handleErrorFilter() {

    }

    save(field, filter) {
        const filters = {userFilters: {...this.props.thread.filters.userFilters, ...{[field]: filter}}};

        const allFilters = Object.assign(filters.userFilters, CreatingProposalStore.proposal.filters.userFilters);
        const filterValue = {[field] : filter};

        this.setState({data: filters.userFilters});
        CreatingProposalStore.proposal.filters.userFilters = filters.userFilters;
    }

    hideRenderCategory(categories) {
        if (CreatingProposalStore.proposal.type === ('sports' || 'hobbies' || 'games')) {
            const categoriesToHide = ["sports", "hobbies", "games"];

            if (categories) {
                categories.forEach(function (category, index) {
                    if (JSON.stringify(category.fields) === JSON.stringify(categoriesToHide)) {
                        categories.splice(index, 1);
                    }
                });
            }
        }

        if (CreatingProposalStore.proposal.type === ('shows' || 'restaurants' || 'plans')) {
            const categoriesToHide = ["leisureMoney", "shows", "plans", "restaurants"];

            if (categories) {
                categories.forEach(function (category, index) {
                    if (JSON.stringify(category.fields) === JSON.stringify(categoriesToHide)) {
                        categories.splice(index, 1);
                    }
                });
            }
        }

        if (CreatingProposalStore.proposal.type === 'work') {
            const categoriesToHide = [
                ["profession", "industry"],
                ["alcohol", "smoke", "drugs"]
            ];

            if (categories) {
                categories.forEach(function (category, categoryIndex) {
                    categoriesToHide.forEach(function (categoryToHide, categoryToHideIndex) {
                        if (JSON.stringify(category.fields) === JSON.stringify(categoryToHide)) {
                            categories.splice(categoryIndex, 1);
                        }
                    });
                });
            }
        }
    }

    hideRenderField(categories) {
        if (CreatingProposalStore.proposal.type === 'work') {
            const fieldsToHide = ['religion', 'ideology'];

            if (categories) {
                categories.forEach(function (category, categoryIndex) {
                    fieldsToHide.forEach(function (fieldsToHide, fieldsToHideIndex) {
                        const index = category.fields.indexOf(fieldsToHide);
                        if (index !== -1) category.fields.splice(index, 1);
                    });
                });
            }
        }
    }


    renderField(field) {
        const {tags, filters} = this.props;
        const {data} = this.state;
        // const data = CreatingProposalStore.proposal.filters.userFilters;

        if (filters && filters.userFilters && filters.userFilters[field] && data) {
            const filter = filters.userFilters[field];
            const filterData =  data[field] ? data[field] : null;
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
                            color={this.getHexadecimalColor()}
            />
        );
    }

    renderIntegerRangeFilter(field, filter, data) {
        return (
            <IntegerRangeFilter filterKey={field}
                                filter={filter}
                                data={data}
                                handleChangeFilter={this.handleChangeFilter}
                                color={this.getHexadecimalColor()}
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
                                   color={this.getProposalColor()}
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
                                         color={this.getProposalColor()}
            />
        );
    }

    renderChoiceAndMultipleChoicesFilter(field, filter, data) {
        return (
            <ChoiceAndMultipleChoicesFilter filterKey={field}
                                            filter={filter}
                                            data={data}
                                            handleChangeFilter={this.handleChangeFilter}
                                            color={this.getProposalColor()}
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
                       color={this.getProposalColor()}
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
                                          color={this.getProposalColor()}
            />
        );
    }




    handleStepsBarClick() {
        const {params} = this.props;

        ProposalActionCreators.mergeCreatingProposal(CreatingProposalStore.proposal);

        if (params.proposalId) {
            this.context.router.push('/proposal-preview/' + params.proposalId);
        } else {
            this.context.router.push('/proposal-preview/');
        }
    }

    getProposalColor() {
        let color;

        if (CreatingProposalStore.proposal.selectedType) {
            switch (CreatingProposalStore.proposal.selectedType) {
                case 'leisure':
                    color = 'pink';
                    break;
                case 'experience':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        } else {
            switch (CreatingProposalStore.proposal.type) {
                case 'sports':
                case 'hobbies':
                case 'games':
                    color = 'pink';
                    break;
                case 'shows':
                case 'restaurants':
                case 'plans':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        }

        return color;
    }

    getHexadecimalColor() {
        let color;

        switch (CreatingProposalStore.proposal.type) {
            case 'sports':
            case 'hobbies':
            case 'games':
                color = '#D380D3';
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                color = '#7bd47e';
                break;
            default:
                color = '#63caff';
                break;
        }

        return color;
    }

    render() {
        const {proposal, selectedFilters, user, tags, filters, thread, categories, strings} = this.props;
        const canContinue = true;

        this.hideRenderCategory(categories);
        this.hideRenderField(categories);




        return (
            <div className="views">
                <div className="view view-main proposals-leisure-features-view">
                    <TopNavBar
                        background={'#FBFCFD'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={CreatingProposalStore.proposal.id ? strings.editProposal : strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-leisure-features-wrapper">
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
                                            {this.renderField(field)}
                                        </div>
                                    )}
                                </FrameCollapsible>)
                            : null
                        }
                    </div>
                </div>

                <StepsBar
                    color={this.getProposalColor()}
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

ProposalFeaturesPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        editProposal             : 'Edit proposal',
        title                    : 'Are you looking for people with specific features?',
        filterWarning            : 'This filters only be visible for you and we need to filter users',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'You cannot continue',
    }
};