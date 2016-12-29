import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import translate from '../../i18n/Translate';
import selectn from 'selectn';

@translate('Group')
export default class Group extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
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

        const groupUrl="groups/"+group.id;
        return (
            <div className="group">
                <div className="group-title" ><Link to={groupUrl}>{group.name}</Link></div>
                <div className="group-number-users"> {group.usersCount} {strings.users}</div>
            </div>
        );
    }
}

Group.defaultProps = {
    strings: {
        users: 'Users'
    }
};