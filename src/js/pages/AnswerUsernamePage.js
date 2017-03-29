import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import UsernameField from '../components/fieldsQuestions/userFields/UsernameField';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import LoginActionCreators from '../actions/LoginActionCreators';
import RegisterStore from '../stores/RegisterStore';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const data = RegisterStore.getData();
    const {user, profile, token, oauth} = data;
    const isUsernameValid = RegisterStore.validUsername();

    return {
        user,
        profile,
        token,
        oauth,
        isUsernameValid
    };
}

@AuthenticatedComponent
@translate('AnswerUsernamePage')
@connectToStores([RegisterStore], getState)
export default class AnswerUsernamePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings                 : PropTypes.object,
        // Injected by @connectToStores:
        user                    : PropTypes.object,
        profile                 : PropTypes.object,
        token                   : PropTypes.string,
        oauth                   : PropTypes.object,
        isUsernameValid         : PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickSave = this.handleClickSave.bind(this);

        this.state = {
            registering: false
        };
    }

    componentWillMount() {
        let {user, profile, token, oauth} = this.props;
        if (!user || !profile || !token || !oauth) {
            this.context.router.push('/');
        }
    }

    handleClickSave(username) {
        let {user, profile, token, oauth} = this.props;
        user.username = username;
        this.setState({registering: true});
        LoginActionCreators.register(user, profile, token, oauth).then(() => {
            setTimeout(() =>  { this.context.router.push('social-networks-on-sign-up') }, 0);
        }).catch(error => {
            console.log(error);
            this.setState({registering: false});
            setTimeout(() =>  { this.context.router.push('/') }, 0);
        });
    }
    
    render() {
        const {strings, isUsernameValid} = this.props;
        const {registering} = this.state;
        return (
            <div className="views">
                <TopNavBar centerText={strings.username}/>
                <div className="view view-main">
                    <div className="page answer-question-page">
                        <div id="page-content" className="answer-question-content">
                            {registering ? <EmptyMessage text={strings.loadingMessage} loadingGif={true} /> :
                                <UsernameField username={''} isUsernameValid={isUsernameValid} onSaveHandler={this.handleClickSave} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AnswerUsernamePage.defaultProps = {
    strings: {
        username        : 'Username',
        loadingMessage  : 'Registering user',
    }
};