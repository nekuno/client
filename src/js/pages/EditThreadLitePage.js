import React, { PropTypes, Component } from 'react';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import FilterStore from '../stores/FilterStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import ThreadStore from '../stores/ThreadStore';
import TextInput from '../components/ui/TextInput';
import TextRadios from '../components/ui/TextRadios';
import CreateContentThread from '../components/threads/CreateContentThread';
import CreateUsersThread from '../components/threads/CreateUsersThread';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';

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
@translate('EditThreadLitePage')
@connectToStores([ThreadStore, FilterStore, TagSuggestionsStore], getState)
export default class EditThreadLitePage extends Component {

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

        this.handleClickCategory = this.handleClickCategory.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.goToDiscover = this.goToDiscover.bind(this);

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
            nekunoApp.alert(nextProps.errors);
            ThreadStore.deleteErrors();
        }
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
                ThreadActionCreators.requestRecommendation(threadId);
                this.setState({updating: false});
                this.goToDiscover();
            });
        this.setState({updating: true});
    }

    goToDiscover(){
        if (this.props.thread.groupId != null){
            const groupUrl="badges/"+this.props.thread.groupId;
            this.context.router.push(groupUrl+"/discover");
        } else {
            this.context.router.push(`discover`);
        }
    }

    render() {
        const {user, filters, tags, thread, categories, strings} = this.props;
        const {category, threadName, updating} = this.state;
        return (
            <div className="views">
                <div className="view view-main">
                    <TopNavBar centerText={strings.edit} leftText={strings.cancel} onLeftLinkClickHandler={this.goToDiscover}/>
                    <div className="page create-thread-page lite">
                        <div id="page-content">
                            {updating ? <EmptyMessage text={strings.updating} loadingGif={true}/> :
                                thread && threadName && filters && categories ?
                                    <div>
                                        <div className="thread-title">
                                            {strings.filters}:
                                        </div>
                                        <div key={1} className={category + '-first-vertical-line'}></div>
                                        <div key={2} className={category + '-last-vertical-line'}></div>
                                        <CreateUsersThread userId={user.id} defaultFilters={filters['userFilters']} threadName={threadName} tags={tags} thread={thread} categories={categories} onSave={this.onEdit}/>
                                    </div>
                                    : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

EditThreadLitePage.defaultProps = {
    strings: {
        edit       : 'Edit yarn',
        cancel     : 'Cancel',
        placeholder: 'Title',
        people     : 'Users of Nekuno',
        contents   : 'Links of Internet',
        updating   : 'Updating yarn',
        filters    : 'Filters'
    }
};
