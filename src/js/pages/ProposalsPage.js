import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import ProposalCard from '../components/Proposal/ProposalCard/ProposalCard.js';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import WorkersStore from '../stores/WorkersStore';
import '../../scss/pages/proposals.scss';


function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();
    const proposals = [
        {
            title: 'Lorem ipsum',
            image: 'http://via.placeholder.com/360x180',
            type: 'professional-project',
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'JohnDoe',
            age: 36,
            city: 'Madrid',
            matching: 76,
            similarity: 51,
            resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            image: 'http://via.placeholder.com/360x180',
            type: 'leisure-plan',
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'JaneDoe',
            age: 37,
            city: 'Barcelona',
            matching: 56,
            similarity: 21,
            resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            image: 'http://via.placeholder.com/360x180',
            type: 'experience-plan',
            photo: 'http://via.placeholder.com/250x250',
            nickname: 'TomDoe',
            age: 25,
            city: 'Bilbao',
            matching: 23,
            similarity: 34,
            resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            image: 'http://via.placeholder.com/360x180',
            type: 'leisure-plan',
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
        proposals
    };
}

@AuthenticatedComponent
@translate('ProposalsPage')
@connectToStores([WorkersStore], getState)
export default class ProposalsPage extends Component {

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

        this.state = {
            current: 0
        };
    }

    render() {
        const {user, proposals, networks, notifications, strings} = this.props;
        const {current} = this.state;
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <div className="view view-main proposals-view">
                    <TopNavBar textCenter={strings.discover} imageLeft={imgSrc} boxShadow={true}/>
                    <div className="proposals-wrapper">
                        {proposals.map((proposal, index) => <div className="proposal" style={current !== index ? {display: 'none'} : {}}>
                            <ProposalCard {...proposal}/>
                        </div>)}
                    </div>
                    <BottomNavBar current={'proposals'} notifications={notifications}/>
                </div>
            </div>
        );
    }

}

ProposalsPage.defaultProps = {
    strings: {
        discover : 'Discover proposals',
    }
};