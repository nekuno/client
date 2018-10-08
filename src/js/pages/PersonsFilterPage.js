import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import FrameCollapsible from '../components/ui/FrameCollapsible/FrameCollapsible.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
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

        this.handleChange = this.handleChange.bind(this);
        this.goToPersonsAll = this.goToPersonsAll.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    handleChange(value) {
        // TODO: Edit thread
    }

    goToPersonsAll() {
        this.context.router.push('/persons-all');
    }

    render() {
        const {user, filters, tags, thread, categories, strings} = this.props;
        console.log(categories);
        console.log(filters);

        return (
            <div className="views">
                <div className="view view-main persons-filter-view">
                    <TopNavBar textCenter={strings.title} textSize={'small'} firstIconRight={'x'} boxShadow={true} onRightLinkClickHandler={this.goToPersonsAll}/>
                    <div className="persons-filter-wrapper">
                        {categories ?
                            categories.map((category, index) => <FrameCollapsible key={index} title={category.label}>

                            </FrameCollapsible>)
                            : null
                        }
                    </div>
                </div>
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
        coincidences : 'coincidences'
    }
};