import React, { PropTypes, Component } from 'react';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

export default AuthenticatedComponent(class OtherQuestionsPage extends Component {

    render() {
        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={this.props.user.username}/>
                <div data-page="index" className="page other-questions-page">
                    <div id="page-content" className="other-questions-content">
                    </div>
                </div>
            </div>
        );
    }
});