import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import FilterStore from '../stores/FilterStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import ThreadStore from '../stores/ThreadStore';
import TextInput from '../components/ui/TextInput';
import TextRadios from '../components/ui/TextRadios';
import CreateContentThread from '../components/threads/CreateContentThread';
import CreateUsersThread from '../components/threads/CreateUsersThread';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';

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
    return {
        tags: tags,
        filters: filters,
        thread: thread
    };
}

@AuthenticatedComponent
@connectToStores([ThreadStore, FilterStore, TagSuggestionsStore], getState)
export default class EditThreadPage extends Component {
    static propTypes = {
        filters: PropTypes.object,
        tags: PropTypes.array,
        user: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickCategory = this.handleClickCategory.bind(this);

        this.state = {
            threadName: '',
            category: null
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.thread) {
            this.setState({
                threadName: nextProps.thread.name,
                category: nextProps.thread.category == 'ThreadUsers' ? 'persons' : 'contents'
            });
        }
    }

    handleClickCategory(category) {
        this.setState({
            category: category
        });
    }

    linkState(key) {
        return new ReactLink(this.state[key], ReactStateSetters.createStateKeySetter(this, key));
    }

    render() {
        const {user, filters, tags, thread} = this.props;
        const {category, threadName} = this.state;
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={'Editar hilo'} leftText={'Cancelar'} />
                <div className="page create-thread-page">
                    <div id="page-content">
                        {thread && filters ?
                            <div>
                                <div className="thread-title list-block">
                                    <ul>
                                        <TextInput placeholder={'Escribe un título descriptivo del hilo'} valueLink={this.linkState('threadName')}/>
                                    </ul>
                                </div>
                                <div key={1} className={category + '-first-vertical-line'}></div><div key={2} className={category + '-last-vertical-line'}></div>
                                <div className="main-filter-wprapper">
                                    <div className="thread-filter radio-filter">
                                        <div className="thread-filter-dot">
                                            <span className={category ? "icon-circle active" : "icon-circle"}></span>
                                        </div>
                                        <TextRadios labels={[{key: 'persons', text: 'Personas'}, {key: 'contents', text: 'Contenidos'}]} onClickHandler={this.handleClickCategory} value={category} />
                                    </div>
                                </div>
                                {category === 'contents' ? <CreateContentThread userId={user.id} defaultFilters={filters['contentFilters']} threadName={threadName} tags={tags} thread={thread}/> : ''}
                                {category === 'persons' ? <CreateUsersThread userId={user.id} defaultFilters={filters['userFilters']} threadName={threadName} tags={tags} thread={thread}/> : ''}
                            </div>
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
};
