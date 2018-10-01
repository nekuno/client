import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import CardUser from '../components/OtherUser/CardUser/CardUser.js';
import WorkersStore from '../stores/WorkersStore';
import '../../scss/pages/persons.scss';


function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();
    const users = [
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'JohnDoe',
            age: 36,
            city: 'Madrid',
            matching: 76,
            similarity: 51,
            coincidences: 24
        },
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'JaneDoe',
            age: 37,
            city: 'Barcelona',
            matching: 56,
            similarity: 21,
            coincidences: 12
        },
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'TomDoe',
            age: 25,
            city: 'Bilbao',
            matching: 23,
            similarity: 34,
            coincidences: 8
        },
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'AliceDoe',
            age: 18,
            city: 'Sevilla',
            matching: 12,
            similarity: 5,
            coincidences: 2
        },
    ];
    const groupUsers = [
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'TomDoe',
            age: 36,
            city: 'Madrid',
            matching: 76,
            similarity: 51,
            coincidences: 24,
            group: {
                name: 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            }
        },
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'AliceDoe',
            age: 37,
            city: 'Barcelona',
            matching: 56,
            similarity: 21,
            coincidences: 12,
            group: {
                name: 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            }
        },
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'JohnDoe',
            age: 25,
            city: 'Bilbao',
            matching: 23,
            similarity: 34,
            coincidences: 8,
            group: {
                name: 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            }
        },
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'JaneDoe',
            age: 18,
            city: 'Sevilla',
            matching: 12,
            similarity: 5,
            coincidences: 2,
            group: {
                name: 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            }
        },
    ];

    return {
        networks,
        error,
        isLoading,
        users,
        groupUsers
    };
}

@AuthenticatedComponent
@translate('PersonsPage')
@connectToStores([WorkersStore], getState)
export default class PersonsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user     : PropTypes.object.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        networks : PropTypes.array.isRequired,
        error    : PropTypes.bool,
        isLoading: PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

    }

    render() {
        const {user, users, groupUsers, networks, notifications, strings} = this.props;
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <div className="view view-main persons-view">
                    <TopNavBar textCenter={strings.relatedPeople} imageLeft={imgSrc} />
                    <div className="persons-wrapper">
                        <h1>{strings.closestPeople}</h1>
                        <div className="view-all">{strings.viewAll}</div>
                        <div className="persons">
                            {users.filter((singleUser, index) => index < 2).map((singleUser, index) => {
                                return index === 0 ?
                                    <div className="person person-1">
                                        <CardUser {...singleUser} size="medium"/>
                                    </div>
                                    :
                                    <div className="person person-2">
                                        <CardUser {...singleUser} size="medium"/>
                                    </div>
                                }
                            )}
                        </div>
                        <div className="groups-persons-title">{strings.groupsPersons}</div>
                        <div className="persons">
                            {groupUsers.filter((singleUser, index) => index < 2).map((singleUser, index) => {
                                    return index === 0 ?
                                        <div className="person person-1">
                                            <CardUser {...singleUser} size="medium"/>
                                        </div>
                                        :
                                        <div className="person person-2">
                                            <CardUser {...singleUser} size="medium"/>
                                        </div>
                                }
                            )}
                        </div>
                    </div>
                    <BottomNavBar current={'persons'} notifications={notifications}/>
                </div>
            </div>
        );
    }

}

PersonsPage.defaultProps = {
    strings: {
        relatedPeople: 'People related to you',
        closestPeople: 'The closest people',
        viewAll      : 'View all',
        groupsPersons: 'People from your badges',
    }
};