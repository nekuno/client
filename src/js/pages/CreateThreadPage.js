import React, { PropTypes, Component } from 'react';
import CreateThread from '../components/threads/CreateThread';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import FilterStore from '../stores/FilterStore';
import TagSuggestionsStore from '../stores/TagSuggestionsStore';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const filters = FilterStore.filters;
    const tags = TagSuggestionsStore.tags;
    return {
        tags: tags,
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
@connectToStores([FilterStore, TagSuggestionsStore], getState)
export default class CreateThreadPage extends Component {
    static propTypes = {
        filters: PropTypes.object,
        tags: PropTypes.array,
        user: PropTypes.object.isRequired
    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        const {user, filters, tags} = this.props;
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={'Crear hilos'} leftText={'Cancelar'} />
                <div className="page create-thread-page">
                    <div id="page-content">
                        {filters ? <CreateThread userId={user.id} filters={filters} tags={tags}/> : ''}
                    </div>
                </div>
            </div>
        );
    }
};
