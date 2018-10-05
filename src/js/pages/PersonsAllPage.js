import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import SelectCollapsible from '../components/ui/SelectCollapsible/SelectCollapsible.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import CardUser from '../components/OtherUser/CardUser/CardUser.js';
import WorkersStore from '../stores/WorkersStore';
import '../../scss/pages/persons-all.scss';


function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();
    const order = 'compatibility';
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
            coincidences: 12,
            group: {
                name: 'Nekuno',
                photo: 'http://via.placeholder.com/25x25'
            }
        },
        {
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'TomDoe',
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
            nickname: 'AliceDoe',
            age: 18,
            city: 'Sevilla',
            matching: 12,
            similarity: 5,
            coincidences: 2
        },
    ];
    return {
        networks,
        error,
        isLoading,
        users,
        order
    };
}

@AuthenticatedComponent
@translate('PersonsAllPage')
@connectToStores([WorkersStore], getState)
export default class PersonsAllPage extends Component {

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

        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(value) {
        // TODO: Call endpoint for filtering users by name
    }

    handleChangeOrder(order) {
        // TODO: Call endpoint for new order
    }

    render() {
        const {users, order, networks, strings} = this.props;
        const orderOptions = [
            {
                id: 'compatibility',
                text: strings.compatibility
            },
            {
                id: 'similarity',
                text: strings.similarity
            },
            {
                id: 'coincidences',
                text: strings.coincidences
            }
        ];

        return (
            <div className="views">
                <div className="view view-main persons-all-view">
                    <TopNavBar textCenter={strings.title} textSize={'small'} iconLeft={'arrow-left'} boxShadow={true} searchInput={true} onSearchChange={this.handleSearch}>
                        <SelectCollapsible options={orderOptions} selected={order} title={strings.orderedBy + ' ' + strings[order].toLowerCase()} onClickHandler={this.handleChangeOrder}/>
                    </TopNavBar>
                    <div className="persons-all-wrapper">
                        <h1>{strings.closestPeople}</h1>
                        <div className="view-all">{strings.viewAll}</div>
                        <div className="persons">
                            {users.map((singleUser, index) =>
                                <div key={index} className="person">
                                    <CardUser {...singleUser} size="small"/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

PersonsAllPage.defaultProps = {
    strings: {
        title        : 'Nekuno People',
        orderedBy    : 'Ordered by',
        compatibility: 'compatibility',
        similarity   : 'similarity',
        coincidences : 'coincidences'
    }
};