import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import LeftMenuRightSearchTopNavbar from '../components/ui/LeftMenuRightSearchTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import InterestStore from '../stores/InterestStore';
import InterestsByUserStore from '../stores/InterestsByUserStore';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import CardContentList from '../components/interests/CardContentList';
import FilterContentPopup from '../components/ui/FilterContentPopup';

function parseId(user) {
    return user.qnoow_id;
}

function requestData(props) {
    const { user } = props;
    const userId = parseId(user);

    InterestsActionCreators.requestOwnInterests(userId);
}

function getState(props) {
    const userId = parseId(props.user);
    const interests = InterestStore.get(userId) || [];
    const pagination = InterestStore.getPagination(userId) || {};
    return {
        pagination,
        interests
    };
}

@connectToStores([InterestStore, InterestsByUserStore], getState)
export default AuthenticatedComponent(class InterestsPage extends Component {
    static propTypes = {
        // Injected by @connectToStores:
        interests: PropTypes.array.isRequired,
        pagination: PropTypes.object,

        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
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

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const interests = this.props.interests;

        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <LeftMenuRightSearchTopNavbar centerText={'Mi Perfil'} onRightLinkClickHandler={this.onSearchClick}/>
                <div data-page="index" className="page interests-page">
                    <div id="page-content" className="interests-content">
                        <CardContentList contents={interests} userId={1} />
                        <br />
                        <div className="loading-gif" style={this.props.pagination.nextLink ? {} : {display: 'none'}}></div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <ToolBar links={[
                {'url': `/profile/${selectn('qnoow_id', this.props.user)}`, 'text': 'Sobre mí'},
                {'url': '/questions', 'text': 'Respuestas'},
                {'url': '/interests', 'text': 'Intereses'}
                ]} activeLinkIndex={2}/>
                {/* TODO: Pass contents count */}
                <FilterContentPopup userId={this.props.user.qnoow_id} contentsCount={444} ownContent={true}/>
            </div>
        );
    }

    onSearchClick = function () {
        nekunoApp.popup('.popup-filter-contents');
    };

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            InterestsActionCreators.requestNextOwnInterests(parseId(this.props.user), nextLink);
        }
    }
});