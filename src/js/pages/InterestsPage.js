import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import FilterContentButtons from '../components/ui/FilterContentButtons';
import CardContentList from '../components/interests/CardContentList';
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

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props);
        }
    }

    componentDidMount() {
        nekunoApp.closePanel();
    }

    componentDidUpdate() {
        nekunoApp.closePanel();
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const {pagination, isLoadingOwnInterests} = this.props;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 117);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax && !isLoadingOwnInterests) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            InterestsActionCreators.requestNextOwnInterests(parseId(this.props.user), nextLink);
        }
    }

    render() {
        const {pagination, totals, interests, noInterests, user, networks, strings} = this.props;
        const connectedNetworks = networks.filter(network => network.fetching || network.fetched || network.processing || network.processed);

        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': '/profile', 'text': strings.about},
                    {'url': '/gallery', 'text': strings.photos},
                    {'url': '/questions', 'text': strings.questions},
                    {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={3} arrowUpLeft={'85%'}/>
                <div className="view view-main" onScroll={this.handleScroll}>
                    <div className="page interests-page">
                        <div id="page-content" className="interests-content">
                            {connectedNetworks.length < 4 ? <SocialNetworksBanner networks={networks} user={user}/> : null}
                            <FilterContentButtons userId={parseId(user)} contentsCount={pagination.total || 0} ownContent={true}
                                                  linksCount={totals.Link}
                                                  audiosCount={totals.Audio}
                                                  videosCount={totals.Video}
                                                  imagesCount={totals.Image}
                                                  channelsCount={totals.Creator}
                            />
                            {noInterests ?
                                <EmptyMessage text={strings.empty} />
                                :
                                <CardContentList contents={interests} userId={parseId(user)}/>
                            }
                            <br />
                            <div className="loading-gif" style={pagination.nextLink ? {} : {display: 'none'}}></div>
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
        empty    : 'You have no interests yet. Please, connect more social media or explore your yarns and let us know what are you interested in.'
    }
};