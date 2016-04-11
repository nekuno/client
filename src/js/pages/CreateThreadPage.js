import React, { PropTypes, Component } from 'react';
import CreateThread from '../components/threads/CreateThread';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    return {
        //TODO: Get suggestedTags
    };
}

@AuthenticatedComponent
@connectToStores([], getState)
export default class CreateThreadPage extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={'Crear hilos'} leftText={'Cancelar'} />
                <div className="page create-thread-page">
                    <div id="page-content">
                        <CreateThread userId={this.props.user.id} />
                    </div>
                </div>
            </div>
        );
    }
};
