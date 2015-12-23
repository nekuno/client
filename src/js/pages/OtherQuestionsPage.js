import React, { PropTypes, Component } from 'react';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

export default AuthenticatedComponent(class OtherQuestionsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.number.isRequired
        }).isRequired
    };

    render() {
        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={this.props.user.username}/>
                <div data-page="index" className="page other-questions-page">
                    <div id="page-content" className="other-questions-content">
                    </div>
                </div>
                <ToolBar links={[
                {'url': `/profile/${this.props.params.userId}`, 'text': 'Acerca de'},
                {'url': `/users/${this.props.params.userId}/other-questions`, 'text': 'Respuestas'},
                {'url': `/users/${this.props.params.userId}/other-interests`, 'text': 'Intereses'}
                ]} activeLinkIndex={1}/>
            </div>
        );
    }
});