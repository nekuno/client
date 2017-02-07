import React, { PropTypes, Component } from 'react';
import { API_URLS } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import Button from '../components/ui/Button';
import Group from '../components/groups/Group';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as APIUtils from '../utils/APIUtils';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as GroupActionCreators from '../actions/GroupActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import GroupStore from '../stores/GroupStore';

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
    ThreadActionCreators.requestThreadPage();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const groups = GroupStore.groups;

    return {
        groups
    };
}

@AuthenticatedComponent
@translate('GroupPage')
@connectToStores([GroupStore], getState)
export default class GroupPage extends Component {
    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        groups: PropTypes.object

    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.create = this.create.bind(this);
        this.join = this.join.bind(this);

        this.state = {
            joining: false,
            creating: false
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    create() {
        nekunoApp.prompt(this.props.strings.enterName, (value) => {
            const data = {'name': value};
            this.setState({creating: true});
            GroupActionCreators.createGroup(data).then((group) => {
                this.setState({creating: false});
                this.context.router.push('/badges/' + group.id);
            }, (error) => {
                this.setState({creating: false});
                console.log(error);
                nekunoApp.alert('Sorry! We couldn´t create this group');
            });
        });
    }

    join() {
        nekunoApp.prompt(this.props.strings.enterTokenText, this.props.strings.enterToken, (value) => {

            const invitation = APIUtils.postData(API_URLS.CONSUME_INVITATION.replace('{token}', value));
            this.setState({joining: true});

            invitation.then((data)=> {
                this.setState({joining: false});
                if (!null == data.invitation.group) {
                    nekunoApp.alert('This invitation is of no group');
                } else {
                    GroupActionCreators.joinGroup(data.invitation.group.id).then(() => {
                        //this.context.router.push('/badges/groupId');
                    }, (error) => {
                        console.log(error);
                        nekunoApp.alert('Sorry! We couldn´t join to this group');
                    });
                }
            }, (error) => {
                this.setState({joining: false});
                console.log(error);
                nekunoApp.alert('Sorry! We couldn´t join to this group');
            });

        });
    }

    render() {
        const {groups, strings} = this.props;
        const {creating, joining} = this.state;
        return (
            <div className="views">
                <div className="view view-main">
                    <TopNavBar leftMenuIcon={true} centerText={strings.groups}/>
                    <div className="page group-page">
                        {groups ?
                            <div id="page-content">
                                {creating ? <EmptyMessage text={strings.creating} loadingGif={true}/> :
                                    joining ? <EmptyMessage text={strings.joining} loadingGif={true}/> :

                                        <div>
                                            <div className="group-buttons">
                                                {/*<Button onClick={this.create}> {strings.create} </Button>*/}
                                                <Button onClick={this.join}> {strings.join} </Button>
                                            </div>
                                            {Object.keys(groups).map((key) => {
                                                let group = groups[key];
                                                return <Group key={key} group={group}/>
                                            })}
                                        </div>
                                }
                            </div>
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
};

GroupPage.defaultProps = {
    strings: {
        groups        : 'Your badges',
        create        : 'Create badge',
        creating      : 'Creating badge',
        enterName     : 'Name of the badge',
        join          : 'Unlock badge',
        joining       : 'Unlocking badge',
        enterToken    : 'BADGE CODE',
        enterTokenText: 'Enter the badge code'
    }
};