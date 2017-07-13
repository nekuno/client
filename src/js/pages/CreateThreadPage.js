import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import FilterStore from '../stores/FilterStore';
import ThreadStore from '../stores/ThreadStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import TextRadios from '../components/ui/TextRadios';
import CreateContentThread from '../components/threads/CreateContentThread';
import CreateUsersThread from '../components/threads/CreateUsersThread';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const categories = ThreadStore.getCategories();
    const filters = FilterStore.filters;
    const tags = TagSuggestionsStore.tags;
    const errors = ThreadStore.getErrors();

    return {
        categories,
        filters,
        tags,
        errors
    };
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    ThreadActionCreators.requestFilters(userId);
}

@AuthenticatedComponent
@translate('CreateThreadPage')
@connectToStores([FilterStore, TagSuggestionsStore, ThreadStore], getState)
export default class CreateThreadPage extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        categories: PropTypes.array,
        filters   : PropTypes.object,
        tags      : PropTypes.array,
        errors    : PropTypes.string,
        // Injected by @AuthenticatedComponent
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickCategory = this.handleClickCategory.bind(this);
        this.onCreate = this.onCreate.bind(this);

        this.state = {
            category: null,
            creating: false,
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            nekunoApp.alert(nextProps.errors);
        }
    }

    handleClickCategory(category) {
        this.setState({
            category: category
        });
    }

    onCreate(data) {
        ThreadActionCreators.createThread(this.props.user.id, data)
            .then((createdThread) => {
                ThreadActionCreators.requestRecommendations(createdThread.id);
                this.setState({creating: false});
                this.context.router.push(`threads`);
            }, () => {
                this.setState({creating: false});
            });
        this.setState({creating: true});
    }

    render() {
        const {user, categories, filters, tags, strings} = this.props;
        const {category, creating} = this.state;
        return (
            <div className="views">
                <TopNavBar centerText={strings.create} leftText={strings.cancel}/>
                <div className="view view-main">
                    <div className="page create-thread-page">
                        <div id="page-content">
                            {creating ? <EmptyMessage text={strings.creating} loadingGif={true}/> :
                                categories && filters ?
                                    <div>
                                        <div className="thread-title title">
                                            {strings.title}
                                        </div>
                                        <div key={1} className={category + '-first-vertical-line'}></div>
                                        <div key={2} className={category + '-last-vertical-line'}></div>
                                        <div className="main-filter-wprapper">
                                            <div className="thread-filter radio-filter">
                                                <div className="thread-filter-dot">
                                                    <span className={category ? "icon-circle active" : "icon-circle"}></span>
                                                </div>
                                                <TextRadios labels={[{key: 'persons', text: strings.people}, {key: 'contents', text: strings.contents}]} onClickHandler={this.handleClickCategory} value={category} forceTwoLines={true}/>
                                            </div>
                                        </div>
                                        {category === 'contents' ? <CreateContentThread userId={user.id} defaultFilters={filters.contentFilters} tags={tags} onSave={this.onCreate}/> : ''}
                                        {category === 'persons' ? <CreateUsersThread userId={user.id} defaultFilters={filters.userFilters} tags={tags} categories={categories} onSave={this.onCreate}/> : ''}
                                    </div>
                                    : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateThreadPage.defaultProps = {
    strings: {
        create  : 'Create yarn',
        title   : 'What do you want to discover in this new yarn?',
        cancel  : 'Cancel',
        people  : 'Users of Nekuno',
        contents: 'Links of Internet',
        creating: 'Creating yarn',
    }
};