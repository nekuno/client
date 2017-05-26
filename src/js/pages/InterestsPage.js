import React, { PropTypes, Component } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import CardContentList from '../components/interests/CardContentList';
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

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        // const {pagination, isLoadingOwnInterests} = this.props;
        // let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        // let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 117);
        // let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);
        //
        // if (nextLink && offsetTop >= offsetTopMax && !isLoadingOwnInterests) {
        //     document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
        //     InterestsActionCreators.requestNextOwnInterests(parseId(this.props.user), nextLink);
        // }
    }

    onBottomScroll() {
        const {pagination} = this.props;
        const nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        const userId = parseId(this.props.user);

        return InterestsActionCreators.requestNextOwnInterests(userId, nextLink);
    }

    render() {
        const {interests, noInterests, user, strings, networks, pagination, totals} = this.props;

        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.about},
                    {'url': '/gallery', 'text': strings.photos},
                    {'url': '/questions', 'text': strings.questions},
                    {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={3} arrowUpLeft={'85%'}/>
                {/*<ScrollContainer scrollKey="own-interests">*/}
                <div className="view view-main" id="interests-view-main" onScroll={this.handleScroll}>
                    <div className="page interests-page">
                        <div id="page-content" className="interests-content">
                            {noInterests ?
                                <EmptyMessage text={strings.empty}/>
                                :
                                <CardContentList contents={interests} userId={parseId(user)} networks={networks} pagination={pagination} totals={totals} onBottomScroll={this.onBottomScroll.bind(this)} user={user}/>
                            }
                            <br />
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
                {/*</ScrollContainer>*/}
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