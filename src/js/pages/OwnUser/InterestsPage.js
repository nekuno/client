import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './InterestsPage.scss';
import translate from '../../i18n/Translate';
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import '../../../scss/pages/other-user/proposals.scss';
import CardContentList from '../../components/interests/CardContentList';
import connectToStores from "../../utils/connectToStores";
import ProfileStore from "../../stores/ProfileStore";
import UserStore from "../../stores/UserStore";
import InterestStore from "../../stores/InterestStore";
import * as InterestsActionCreators from "../../actions/InterestsActionCreators";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import OwnUserBottomNavBar from "../../components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar";
import SelectCollapsibleInterest from "../../components/ui/SelectCollapsibleInterest/SelectCollapsibleInterest";
import RouterStore from '../../stores/RouterStore';

function parseId(user) {
    return user ? user.id : null;
}

function requestData(props) {

    const userId = parseId(props.user);
    const requestInterestsUrl = InterestStore.getRequestInterestsUrl(userId);

    console.log('url');
    console.log(requestInterestsUrl);
    if (requestInterestsUrl) {
        InterestsActionCreators.requestOwnInterests(userId, requestInterestsUrl);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const userId = parseId(props.user);

    const pagination = InterestStore.getPagination(userId);
    const totals = InterestStore.getTotals(userId);
    const interests = InterestStore.get(userId);
    const noInterests = InterestStore.noInterests(userId);
    const isLoadingOwnInterests = InterestStore.isLoadingOwnInterests();
    const type = InterestStore.getType(userId);
    const requestInterestsUrl = InterestStore.getRequestInterestsUrl(userId);

    const routes = RouterStore._routes;

    return {
        pagination,
        totals,
        interests,
        noInterests,
        isLoadingOwnInterests,
        type,
        requestInterestsUrl,
        routes
    };
}

@AuthenticatedComponent
@translate('OwnUserInterestsPage')
@connectToStores([UserStore, ProfileStore, InterestStore], getState)
export default class InterestsPage extends Component {

    static propTypes = {
        strings: PropTypes.object,
        // Injected by @connectToStores:
        routes   : PropTypes.array,
        // isLoading  : PropTypes.bool.isRequired,
        // matching   : PropTypes.number,
        // similarity : PropTypes.number,
        // username   : PropTypes.string,
        // location   : PropTypes.string,
        // age        : PropTypes.string,
        // photos     : PropTypes.array,
        // liked      : PropTypes.bool,
        // ownUserSlug: PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.changeType = this.changeType.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const {type, user} = this.props;
        const typeChanged = prevProps.type !== type;

        if (typeChanged) {
            const userId = parseId(user);
            InterestsActionCreators.requestOwnInterests(userId, this.props.requestInterestsUrl);
        }
    }

    getPhotos(photos) {
        return photos.map((photo) => {
            return photo.url
        })
    }

    onBottomScroll() {
        const {user, requestInterestsUrl} = this.props;
        const userId = user ? parseId(user) : null;
        if (userId && requestInterestsUrl) {
            InterestsActionCreators.requestOwnInterests(userId, requestInterestsUrl);
        }
    }

    changeType(newType) {
        const {type} = this.props;

        if (type !== newType) {
            InterestsActionCreators.setType(newType);
        } else {
            InterestsActionCreators.removeType();
        }
    }

    goBack(routes) {
        const regex = /^(\/p\/.*)*(\/networks)*(\/friends)*(\/answers)*(\/interests)*$/
        const next = routes.reverse().find((route) => {
            return !regex.test(route)
        })

        this.context.router.push(next || '');
    }

    render() {
        const {strings, interests, isLoadingOwnInterests, noInterests, type, routes} = this.props;
        return (
            <div className="views">
                <div className={styles.topNavBar}>
                    <TopNavBar
                        background={'transparent'}
                        iconLeft="arrow-left"
                        onLeftLinkClickHandler={() => this.goBack(routes)}
                        textCenter={strings.topNavBarText}
                    />
                </div>

                <div className={styles.view}>
                    <div className={styles.collapsible}><SelectCollapsibleInterest selected={type} onClickSelectCollapsible={this.changeType}/></div>

                    {noInterests ? null
                        :
                        <div id='own-user-interests-view' className={styles.cardContentList}>
                            <CardContentList contents={interests} scrollContainerId='own-user-interests-view'
                                             onBottomScroll={this.onBottomScroll.bind(this)} isLoading={isLoadingOwnInterests}/>
                        </div>
                    }
                </div>

                <div className={styles.navbarWrapper}>
                    <OwnUserBottomNavBar current={'interests'}/>
                </div>
            </div>
        );
    }
}

InterestsPage.defaultProps = {
    strings: {
        orderBy      : 'Filter by type',
        topNavBarText: 'Interests'
    }
};