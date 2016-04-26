import React, { PropTypes, Component } from 'react';
import CreateThread from '../components/threads/CreateThread';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import FilterStore from '../stores/FilterStore';
import * as UserActionCreators from '../actions/UserActionCreators';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    let filters = FilterStore.filters;
    return {
        //TODO: Get suggestedTags
        filters: filters
    };
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    UserActionCreators.requestFilters(userId);
}


@AuthenticatedComponent
@connectToStores([FilterStore], getState)
export default class CreateThreadPage extends Component {
    static propTypes = {
        filters: PropTypes.object,
        user: PropTypes.object.isRequired
    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        const {user, filters} = this.props;
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={'Crear hilos'} leftText={'Cancelar'} />
                <div className="page create-thread-page">
                    <div id="page-content">
                        {filters ? <CreateThread userId={user.id} filters={filters}/> : ''}
                    </div>
                </div>
            </div>
        );
    }
};
