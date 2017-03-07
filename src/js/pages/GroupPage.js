import React, { PropTypes, Component } from 'react';
import { API_URLS } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import Button from '../components/ui/Button';
import Group from '../components/groups/Group';
import UnlockGroupPopup from '../components/groups/UnlockGroupPopup';
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
    ThreadActionCreators.requestThreads();
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
        this.consumeInvitation = this.consumeInvitation.bind(this);
        this.manageError = this.manageError.bind(this);
        this.manageNotInvitationGroup = this.manageNotInvitationGroup.bind(this);

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
        setTimeout(() => {
            let textInput = document.querySelector(".modal-inner .input-field input");
            textInput.focus();
        }, 0);
    }

    openJoinPopup() {
        nekunoApp.popup('.popup-unlock-group');
    }

    closeJoinPopup() {
        nekunoApp.closeModal('.popup-unlock-group');
    }

    join(token) {
        this.setState({joining: true});
        const validatedInvitation = APIUtils.postData(API_URLS.VALIDATE_INVITATION_TOKEN + token);
        validatedInvitation.then((data)=> {
            if (!null == data.invitation.group || data.invitation.group == undefined){
                this.manageNotInvitationGroup();
                this.setState({joining: false});
            } else {
                this.consumeInvitation(token);
            }
        }, (error) => {
            this.manageError(error);
            this.setState({joining: false});
        });
    }

    consumeInvitation(value){
        const invitation = APIUtils.postData(API_URLS.CONSUME_INVITATION.replace('{token}', value));
        invitation.then((data)=> {
            if (!null == data.invitation.group || data.invitation.group == undefined) {
                this.manageNotInvitationGroup();
            } else {
                GroupActionCreators.joinGroup(data.invitation.group.id).then(() => {
                    this.closeJoinPopup();
                    this.setState({joining: false});
                    //this.context.router.push('/badges/groupId');
                }, (error) => {
                    this.manageError(error);
                    this.setState({joining: false});
                });
            }
        }, (error) => {
            this.manageError(error);
            this.setState({joining: false});
        });
    }

    manageError(error) {
        const {strings} = this.props;
        console.log(error);
        nekunoApp.alert(strings.joiningError);
    }

    manageNotInvitationGroup() {
        const {strings} = this.props;
        nekunoApp.alert(strings.noGroupToken);
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
                                                <Button onClick={this.openJoinPopup}> {strings.join} </Button>
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
                    <UnlockGroupPopup onClickOkHandler={this.join} joining={joining}/>
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
        joiningError  : 'Error joining to this badge',
        noGroupToken  : 'This code has not any related badge'
    }
};