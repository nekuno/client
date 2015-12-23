import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import ToolBar from '../components/ui/ToolBar';
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
                <ToolBar links={[
                {'url': `/profile/${selectn('qnoow_id', this.props.user)}`, 'text': 'Sobre mí'},
                {'url': '/questions', 'text': 'Respuestas'},
                {'url': '/interests', 'text': 'Intereses'}
                ]} activeLinkIndex={1}/>
            </div>
        );
    }
});