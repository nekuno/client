import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import ReactSwipe from 'react-swipe';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import OwnProposalCard from '../components/Proposal/OwnProposalCard/OwnProposalCard.js';
import WorkersStore from '../stores/WorkersStore';
import '../../scss/pages/own-proposals.scss';


function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();
    const ownProposals = [
        {
            title      : 'Lorem ipsum dolor',
            image      : 'http://via.placeholder.com/360x180',
            type       : 'work',
            photos     : ['http://via.placeholder.com/100x100/928BFF', 'http://via.placeholder.com/100x100/2B3857', 'http://via.placeholder.com/100x100/818FA1', 'http://via.placeholder.com/100x100/63CAFF', 'http://via.placeholder.com/100x100/009688'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            title      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            image      : 'http://via.placeholder.com/360x180',
            type       : 'leisure-plan',
            photos     : ['http://via.placeholder.com/100x100/818FA1', 'http://via.placeholder.com/100x100/63CAFF', 'http://via.placeholder.com/100x100/009688'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
            title      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image      : 'http://via.placeholder.com/360x180',
            type       : 'leisure-plan',
            photos     : ['http://via.placeholder.com/100x100/818FA1', 'http://via.placeholder.com/100x100/63CAFF', 'http://via.placeholder.com/100x100/009688'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
    ];

    return {
        networks,
        error,
        isLoading,
        ownProposals
    };
}

@AuthenticatedComponent
@translate('OwnProposalsPage')
@connectToStores([WorkersStore], getState)
export default class OwnProposalsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user     : PropTypes.object.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        networks : PropTypes.array.isRequired,
        error    : PropTypes.bool,
        isLoading: PropTypes.bool,
        ownProposals: PropTypes.array,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

    }

    swiping(e, deltaX, deltaY, absX, absY, velocity) {
        console.log("You're Swiping...", e, deltaX, deltaY, absX, absY, velocity)
    }

    swipingLeft(e, absX) {
        console.log("You're Swiping to the Left...", e, absX)
    }

    swiped(e, deltaX, deltaY, isFlick, velocity) {
        console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity)
    }

    swipedUp(e, deltaY, isFlick) {
        console.log("You Swiped Up...", e, deltaY, isFlick)
    }

    getCards(proposals)
    {
        return proposals.filter((proposal, index) => index < 2).map((proposal, index) => {
                    return index === 0 ?
                        <div key={index} className="proposal proposal-1">
                            <OwnProposalCard {...proposal}/>
                        </div>
                        :
                        <div key={index} className="proposal proposal-2">
                            <OwnProposalCard {...proposal} size="medium"/>
                        </div>
                }
            );
    }

    onSwipedLeft(){
        console.log('left');
    }

    render() {
        const {user, ownProposals, networks, notifications, strings} = this.props;
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <div className="view view-main own-proposals-view">
                    <TopNavBar textCenter={strings.myPlans} imageLeft={imgSrc} boxShadow={true}/>
                    <div className="own-proposals-wrapper">
                        <div className="popular-title">{strings.popularProposals}</div>
                        {/*<div className="view-all">{strings.viewAll}</div>*/}
                        <div className="proposals">
                            <ReactSwipe
                                className="carousel"
                                swipeOptions={{ continuous: false , speed: 1000}}>
                                {this.getCards(ownProposals)}
                            </ReactSwipe>
                        </div>
                        <div className="other-published-title">{strings.otherPublished}</div>
                    </div>
                    <BottomNavBar current={'plans'} notifications={notifications}/>
                </div>
            </div>
        );
    }

}

OwnProposalsPage.defaultProps = {
    strings: {
        myPlans         : 'My Plans',
        popularProposals: 'Most popular proposals',
        otherPublished  : 'Other published proposals',
        matches         : 'Matches',
    }
};