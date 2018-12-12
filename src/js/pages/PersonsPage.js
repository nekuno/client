import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import CardUser from '../components/OtherUser/CardUser/CardUser.js';
import WorkersStore from '../stores/WorkersStore';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import '../../scss/pages/persons.scss';
import CarouselContinuous from "../components/ui/CarouselContinuous/CarouselContinuous";

function requestData(props) {
    ThreadActionCreators.requestDefaultRecommendations();
}

function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();
    // const users = [
    //     {
    //         photo       : {thumbnail: {medium: 'http://via.placeholder.com/250x250'}},
    //         username    : 'JohnDoe',
    //         age         : 36,
    //         location    : {locality: 'Madrid'},
    //         matching    : 0.76,
    //         similarity  : 0.51,
    //         coincidences: 24,
    //         sharedLinks : 3,
    //     },
    //     {
    //         photo       : {thumbnail: {medium: 'http://via.placeholder.com/250x250'}},
    //         username    : 'JaneDoe',
    //         age         : 37,
    //         location    : {locality: 'Barcelona'},
    //         matching    : 0.56,
    //         similarity  : 0.21,
    //         coincidences: 12,
    //         sharedLinks : 3,
    //     },
    //     {
    //         photo       : {thumbnail: {medium: 'http://via.placeholder.com/250x250'}},
    //         username    : 'TomDoe',
    //         age         : 25,
    //         location    : {locality: 'Bilbao'},
    //         matching    : 0.23,
    //         similarity  : 0.34,
    //         coincidences: 8,
    //         sharedLinks : 3,
    //     },
    //     {
    //         photo       : {thumbnail: {medium: 'http://via.placeholder.com/250x250'}},
    //         username    : 'AliceDoe',
    //         age         : 18,
    //         location    : {locality: 'Sevilla'},
    //         matching    : 0.12,
    //         similarity  : 0.5,
    //         coincidences: 2,
    //         sharedLinks : 3,
    //     }
    // ];

    const defaultThread = ThreadStore.getOwnDefault();
    const users = defaultThread ? RecommendationStore.get(defaultThread.id) : [];

    const groupUsers = [
        {
            photo       : {thumbnail: {medium: 'http://via.placeholder.com/250x250'}},
            username    : 'JaneDoe',
            age         : 37,
            location    : {locality: 'Barcelona'},
            matching    : 0.56,
            similarity  : 0.21,
            coincidences: 12,
            sharedLinks : 3,
            group       : {
                name : 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            }
        },
        {
            photo       : {thumbnail: {medium: 'http://via.placeholder.com/250x250'}},
            username    : 'TomDoe',
            age         : 25,
            location    : {locality: 'Bilbao'},
            matching    : 0.23,
            similarity  : 0.34,
            coincidences: 8,
            group       : {
                name : 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            },
            sharedLinks : 3,
        },
        {
            photo       : {thumbnail: {medium: 'http://via.placeholder.com/250x250'}},
            username    : 'AliceDoe',
            age         : 18,
            location    : {locality: 'Sevilla'},
            matching    : 0.12,
            similarity  : 0.05,
            coincidences: 2,
            group       : {
                name : 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            },
            sharedLinks : 3,
        }
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
@connectToStores([WorkersStore, ThreadStore, RecommendationStore], getState)
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

        this.viewAll = this.viewAll.bind(this);
    }

    componentDidMount(props) {
        requestData(props);
    }

    viewAll() {
        this.context.router.push('/persons-all');
    }

    getCards(users) {
        return users.map((singleUser, index) => {
            return <div key={index} className="person">
                <CardUser {...singleUser} size="medium"/>
            </div>
        });
    }

    render() {
        const {user, users, groupUsers, networks, notifications, strings} = this.props;
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        const carouselMargin = -30;

        return (
            <div className="views">
                <div className="view view-main persons-view">
                    <TopNavBar textCenter={strings.relatedPeople} imageLeft={imgSrc} boxShadow={true}/>
                    <div className="persons-wrapper">
                        <h1>{strings.closestPeople}</h1>
                        <div className="view-all" onClick={this.viewAll}>{strings.viewAll}</div>
                        {users.length === 0 ?
                            <div className="loading-gif"></div>
                            :
                            <CarouselContinuous items={this.getCards(users)} marginRight={carouselMargin}/>
                        }
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