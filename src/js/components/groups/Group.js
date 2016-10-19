import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import selectn from 'selectn';

@translate('Group')
export default class Group extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        group : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.goToChat = this.goToChat.bind(this);
    }


    goToChat() {
        nekunoApp.alert('Go to group chat page with id ' + this.props.group.id);
    }

    render() {
        let {group, strings} = this.props;

        return (
            <div className="group">
                <span className="group-name">{group.name}</span>
                <div className="group-chat-button" onClick={this.goToChat}> Chat </div>
                <span className="group-number-users"> {group.usersCount} {strings.users}</span>
            </div>
        );
    }
}

Group.defaultProps = {
    strings: {
        users: 'Users'
    }
};