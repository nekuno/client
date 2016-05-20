import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import FilterStore from '../stores/FilterStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import TextInput from '../components/ui/TextInput';
import TextRadios from '../components/ui/TextRadios';
import CreateContentThread from '../components/threads/CreateContentThread';
import CreateUsersThread from '../components/threads/CreateUsersThread';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const filters = FilterStore.filters;
    const tags = TagSuggestionsStore.tags;
    return {
        tags   : tags,
        filters: filters
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
@connectToStores([FilterStore, TagSuggestionsStore], getState)
export default class CreateThreadPage extends Component {

    static propTypes = {
        filters: PropTypes.object,
        tags   : PropTypes.array,
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickCategory = this.handleClickCategory.bind(this);

        this.state = {
            threadName: '',
            category  : null
        };
    }

    componentWillMount() {
        requestData(this.props);
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
        const {user, filters, tags, strings} = this.props;
        const {category, threadName} = this.state;
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={strings.create} leftText={strings.cancel}/>
                <div className="page create-thread-page">
                    <div id="page-content">
                        {filters ?
                            <div>
                                <div className="thread-title list-block">
                                    <ul>
                                        <TextInput placeholder={strings.placeholder} valueLink={this.linkState('threadName')}/>
                                    </ul>
                                </div>
                                <div key={1} className={category + '-first-vertical-line'}></div>
                                <div key={2} className={category + '-last-vertical-line'}></div>
                                <div className="main-filter-wprapper">
                                    <div className="thread-filter radio-filter">
                                        <div className="thread-filter-dot">
                                            <span className={category ? "icon-circle active" : "icon-circle"}></span>
                                        </div>
                                        <TextRadios labels={[{key: 'persons', text: strings.people}, {key: 'contents', text: strings.contents}]} onClickHandler={this.handleClickCategory} value={category}/>
                                    </div>
                                </div>
                                {category === 'contents' ? <CreateContentThread userId={user.id} defaultFilters={filters.contentFilters} threadName={threadName} tags={tags}/> : ''}
                                {category === 'persons' ? <CreateUsersThread userId={user.id} defaultFilters={filters.userFilters} threadName={threadName} tags={tags}/> : ''}
                            </div>
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
};

CreateThreadPage.defaultProps = {
    strings: {
        create     : 'Create yarn',
        cancel     : 'Cancel',
        placeholder: 'Write a descriptive title of the yarn',
        people     : 'People',
        contents   : 'Contents'
    }
};