import React, { PropTypes, Component } from 'react';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

export default AuthenticatedComponent(class InterestsPage extends Component {

    render() {
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Mi Perfil'}/>
                <div data-page="index" className="page interests-page">
                    <div id="page-content" className="interests-content">
                    </div>
                </div>
            </div>
        );
    }
});