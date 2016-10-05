import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import FilterContentPopup from '../components/ui/FilterContentPopup';
import CardContentList from '../components/interests/CardContentList';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import InterestStore from '../stores/InterestStore';

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
    const interests = InterestStore.get(userId) || [];
    const noInterests = InterestStore.noInterests(userId) || false;
    return {
        pagination,
        interests,
        noInterests
    };
}

@AuthenticatedComponent
@translate('InterestsPage')
@connectToStores([InterestStore], getState)
export default class InterestsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        pagination: PropTypes.object,
        interests : PropTypes.array.isRequired,
        noInterests : PropTypes.bool
    };

    constructor(props) {

        super(props);

        this.onSearchClick = this.onSearchClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props);
        }
    }

    componentDidMount() {
        this.onSearchClick();
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    onSearchClick() {
        nekunoApp.popup('.popup-filter-contents');
    };

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 117);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            InterestsActionCreators.requestNextOwnInterests(parseId(this.props.user), nextLink);
        }
    }

    render() {

        const {pagination, interests, noInterests, user, strings} = this.props;

        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile} rightIcon={'search'} onRightLinkClickHandler={this.onSearchClick}/>
                <div className="page interests-page">
                    <div id="page-content" className="interests-content">
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
                <ToolBar links={[
                {'url': '/profile', 'text': strings.about},
                {'url': '/gallery', 'text': strings.photos},
                {'url': '/questions', 'text': strings.questions},
                {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={3} arrowUpLeft={'85%'}/>
                <FilterContentPopup userId={parseId(user)} contentsCount={pagination.total || 0} ownContent={true}/>
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