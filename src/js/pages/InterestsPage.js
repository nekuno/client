import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import CardContentList from '../components/interests/CardContentList';
import FilterContentButtonsList from '../components/ui/FilterContentButtonsList';
import SocialNetworksBanner from '../components/socialNetworks/SocialNetworksBanner';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import InterestStore from '../stores/InterestStore';
import WorkersStore from '../stores/WorkersStore';

function parseId(user) {
    return user.id;
}

function requestData(props) {
    const userId = parseId(props.user);
    InterestsActionCreators.requestOwnInterests(userId);
}

function getState(props) {
    const userId = parseId(props.user);
    const pagination = InterestStore.getPagination(userId) || {};
    const totals = InterestStore.getTotals(userId) || {};
    const interests = InterestStore.get(userId) || [];
    const noInterests = InterestStore.noInterests(userId) || false;
    const isLoadingOwnInterests = InterestStore.isLoadingOwnInterests();
    const networks = WorkersStore.getAll();

    return {
        pagination,
        totals,
        interests,
        noInterests,
        isLoadingOwnInterests,
        networks
    };
}

@AuthenticatedComponent
@translate('InterestsPage')
@connectToStores([InterestStore, WorkersStore], getState)
export default class InterestsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                 : PropTypes.object.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object,
        // Injected by @connectToStores:
        pagination           : PropTypes.object,
        totals               : PropTypes.object,
        interests            : PropTypes.array.isRequired,
        noInterests          : PropTypes.bool,
        isLoadingOwnInterests: PropTypes.bool,
        networks             : PropTypes.array.isRequired,
    };

    constructor(props) {

        super(props);

        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);

        this.state = {
            type: '',
        };
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props);
        }
    }

    onBottomScroll() {
        const {pagination} = this.props;
        const nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        const userId = parseId(this.props.user);

        return InterestsActionCreators.requestNextOwnInterests(userId, nextLink);
    }

    getBanner() {
        const {networks, user} = this.props;
        const connectedNetworks = networks.filter(network => network.fetching || network.fetched || network.processing || network.processed);
        return connectedNetworks.length < 4 ? <SocialNetworksBanner networks={networks} user={user}/> : ''
    }

    getFilterButtons() {
        const {pagination, totals, user, isLoadingOwnInterests} = this.props;
        const userId = parseId(user);
        return <FilterContentButtonsList userId={userId} contentsCount={pagination.total || 0} ownContent={true} onClickHandler={this.onFilterTypeClick}
                                         linksCount={totals.Link}
                                         audiosCount={totals.Audio}
                                         videosCount={totals.Video}
                                         imagesCount={totals.Image}
                                         channelsCount={totals.Creator}
                                         loading={isLoadingOwnInterests}
                                         onFilter={this.onFilter}
                                         type={this.state.type}
        />
    }

    onFilterTypeClick(type) {
        this.setState({
            type: type
        });
    }

    getFirstItems() {
        const {isLoadingOwnInterests, noInterests, strings} = this.props;
        const {type} = this.state;

        const banner = this.getBanner.bind(this)();
        let firstItems = [banner];

        if (noInterests && !isLoadingOwnInterests && type === '') {
            firstItems.push(this.getEmptyMessage(strings.empty));
        } else {
            const filterButtons = this.getFilterButtons.bind(this)();
            firstItems.push(filterButtons);
            if (noInterests && !isLoadingOwnInterests) {
                //     firstItems.push(this.getEmptyMessage(strings.empty));
            }
        }

        return firstItems;
    }

    getEmptyMessage(text) {
        return <EmptyMessage text={text}/>;
    }

    render() {
        const {interests, user, strings, isLoadingOwnInterests} = this.props;
        const loading = isLoadingOwnInterests && interests.length === 0;
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.about},
                    {'url': '/gallery', 'text': strings.photos},
                    {'url': '/questions', 'text': strings.questions},
                    {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={3} arrowUpLeft={'85%'}/>
                <div className="view view-main" id="interests-view-main">
                    <div className="page interests-page">
                        <div id="page-content" className="interests-content">
                            <CardContentList firstItems={this.getFirstItems.bind(this)()} contents={interests} userId={parseId(user)} onBottomScroll={this.onBottomScroll.bind(this)} isLoading={loading}/>
                            <br />
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>
        );
    }

};

InterestsPage.defaultProps = {
    strings: {
        cancel   : 'Cancel',
        myProfile: 'My profile',
        about    : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests',
        loading  : 'Loading interests',
        empty    : 'You have no interests yet. Please, connect more social media or explore your yarns and let us know what are you interested in.'
    }
};