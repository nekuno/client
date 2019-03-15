import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import FilterStore from '../stores/FilterStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import ThreadStore from '../stores/ThreadStore';
import Input from '../components/ui/Input';
import TextRadios from '../components/ui/TextRadios';
import CreateContentThread from '../components/threads/CreateContentThread';
import CreateUsersThread from '../components/threads/CreateUsersThread';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage/EmptyMessage';
import Framework7Service from '../services/Framework7Service';

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

/**
 * Retrieves state from stores for current props.
 */
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
@translate('EditThreadPage')
@connectToStores([ThreadStore, FilterStore, TagSuggestionsStore], getState)
export default class EditThreadPage extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        filters   : PropTypes.object,
        tags      : PropTypes.array,
        thread    : PropTypes.object.isRequired,
        categories: PropTypes.array,
        errors    : PropTypes.string,
        // Injected by @AuthenticatedComponent
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this.handleClickCategory = this.handleClickCategory.bind(this);
        this.onEdit = this.onEdit.bind(this);

        this.state = {
            threadName: '',
            category  : null,
            updating  : false,
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.thread) {
            this.setState({
                threadName: nextProps.thread.name,
                category  : nextProps.thread.category == 'ThreadUsers' ? 'persons' : 'contents'
            });
        }
        if (nextProps.errors) {
            Framework7Service.nekunoApp().alert(nextProps.errors);
        }
    }

    _onChange(event) {
        this.setState({
            threadName: event.target.value
        });
    }

    handleClickCategory(category) {
        this.setState({
            category: category
        });
    }

    onEdit(data) {
        let threadId = this.props.thread.id;
        ThreadActionCreators.updateThread(threadId, data)
            .then(() => {
                this.setState({updating: false});
                this.context.router.push(`discover`);
            }, () => {
                this.setState({updating: false});
            });
        this.setState({updating: true});
    }

    render() {
        const {user, filters, tags, thread, categories, strings} = this.props;
        const {category, threadName, updating} = this.state;
        return (
            <div className="views">
                <TopNavBar centerText={strings.edit} leftText={strings.cancel}/>
                <div className="view view-main">
                    <div className="page create-thread-page">
                        <div id="page-content">
                            {updating ? <EmptyMessage text={strings.updating} loadingGif={true}/> :
                                thread && threadName && filters && categories ?
                                    <div>
                                        <div className="thread-title list-block">
                                            <ul>
                                                <Input placeholder={strings.placeholder} onChange={this._onChange} defaultValue={threadName}/>
                                            </ul>
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
                                        {category === 'contents' ? <CreateContentThread userId={user.id} defaultFilters={filters['contentFilters']} threadName={threadName} tags={tags} thread={thread} onSave={this.onEdit}/> : ''}
                                        {category === 'persons' ? <CreateUsersThread userId={user.id} defaultFilters={filters['userFilters']} threadName={threadName} tags={tags} thread={thread} categories={categories} onSave={this.onEdit}/> : ''}
                                    </div>
                                    : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EditThreadPage.defaultProps = {
    strings: {
        edit       : 'Edit yarn',
        cancel     : 'Cancel',
        placeholder: 'Title',
        people     : 'Users of Nekuno',
        contents   : 'Links of Internet',
        updating   : 'Updating yarn',
    }
};
