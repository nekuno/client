import React, { PropTypes, Component } from 'react';
import { API_URLS } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
import Group from '../components/groups/Group';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as APIUtils from '../utils/APIUtils';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as GroupActionCreators from '../actions/GroupActionCreators';
import StatsStore from '../stores/StatsStore';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const {user} = props;
    const userId = parseId(user);

    UserActionCreators.requestStats(userId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const groups = StatsStore.getGroups();

    return {
        groups
    };
}

@AuthenticatedComponent
@translate('GroupPage')
@connectToStores([StatsStore], getState)
export default class GroupPage extends Component {
    static propTypes = {
        // Injected by @AuthenticatedComponent
        user               : PropTypes.object,
        // Injected by @translate:
        strings            : PropTypes.object,
        // Injected by @connectToStores:
        groups              : PropTypes.array

    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.create = this.create.bind(this);
        this.join = this.join.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    create() {
            nekunoApp.prompt(this.props.strings.enter_name, function (value) {
                const data = {'name': value};
                GroupActionCreators.createGroup(data).then(() => {
                    nekunoApp.alert('We would go to the created group page here, but it´s created');
                    //this.context.history.pushState(null, '/groups/groupId');
                }, (error) => {
                    console.log(error);
                    nekunoApp.alert('Sorry! We couldn´t create this group');
                });
            });
    }

    join() {
        nekunoApp.prompt(this.props.strings.enter_token, function (value) {

            const invitation = APIUtils.postData(API_URLS.CONSUME_INVITATION.replace('{token}', value));

            invitation.then((data)=>{
                console.log('data');
                console.log(data);
                if (!null == data.invitation.group){
                    nekunoApp.alert('This invitation is of no group');
                } else {
                    GroupActionCreators.joinGroup(data.invitation.group.id).then(() => {
                        nekunoApp.alert('We would go to the joined group page here, but it´s joined to it');
                        //this.context.history.pushState(null, '/groups/groupId');
                    }, (error) => {
                        console.log(error);
                        nekunoApp.alert('Sorry! We couldn´t join to this group');
                    });
                }
            },  (error) => {
                console.log(error);
                nekunoApp.alert('Sorry! We couldn´t join to this group');
            });

        });
    }

    render() {
        const {groups, strings} = this.props;
        return (
            <div className="view view-main">
                <TopNavBar leftMenuIcon={true} centerText={strings.groups}/>
                <div className="page group-page">
                    {groups ?
                        <div id="page-content">
                            <FullWidthButton onClick={this.create}> {strings.create}</FullWidthButton>
                            <FullWidthButton onClick = {this.join}> {strings.join}</FullWidthButton>
                            {console.log(groups)}
                            {groups.map((group) => {
                                return <Group key={group.id} group={group} />
                            })}
                        </div>
                        : ''}

                </div>
            </div>
        );
    }
};

GroupPage.defaultProps = {
    strings: {
        groups  : 'Your groups',
        create   : 'Create',
        enter_name : 'Name of the group',
        join: 'Join',
        enter_token : 'Invitation code'
    }
};