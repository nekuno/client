import React, { PropTypes, Component } from 'react';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

export default AuthenticatedComponent(class QuestionsPage extends Component {

    render() {
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Mi Perfil'}/>
                <div data-page="index" className="page questions-page">
                    <div id="page-content" className="questions-content">
                    </div>
                </div>
            </div>
        );
    }
});