import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import LeftMenuRightSearchTopNavbar from '../components/ui/LeftMenuRightSearchTopNavbar';
import LeftLinkRightSearchTopNavbar from '../components/ui/LeftLinkRightSearchTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import InterestStore from '../stores/InterestStore';
import InterestsByUserStore from '../stores/InterestsByUserStore';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import CardContentList from '../components/interests/CardContentList';
import CardContentCarousel from '../components/interests/CardContentCarousel';
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
        this.onContentClick = this.onContentClick.bind(this);
        this.onNavbarLeftLinkClick = this.onNavbarLeftLinkClick.bind(this);
        this.initSwiper = this.initSwiper.bind(this);

        this.state = {
            carousel: false,
            position: 0,
            swiper: null
        };
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props);
        }
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate() {
        if (!this.state.carousel || this.props.interests.length == 0) {
            return;
        }
        if (!this.state.swiper) {
            this.state = {
                swiper: this.initSwiper(),
                carousel: true
            };
        } else {
            this.state.swiper.updateSlidesSize();
        }
    }

    componentDidMount() {
        if (!this.state.carousel || this.props.interests.length == 0) {
            return;
        }
        this.state = {
            swiper: this.initSwiper(),
            carousel: true
        };
    }

    render() {
        const interests = this.props.interests;

        return (
            <div className="view view-main" onScroll={this.state.carousel ? function() {} : this.handleScroll}>
                {this.state.carousel ?
                    <LeftLinkRightSearchTopNavbar leftText={"Cancelar"} centerText={'Mi Perfil'} onLeftLinkClickHandler={this.onNavbarLeftLinkClick}
                                                 onRightLinkClickHandler={this.onSearchClick}/>
                    :
                    <LeftMenuRightSearchTopNavbar centerText={'Mi Perfil'}
                                                  onRightLinkClickHandler={this.onSearchClick}/>
                }
                <div data-page="index" className="page interests-page">
                    <div id="page-content" className="interests-content">
                        {this.state.carousel ?
                            <CardContentCarousel contents={interests} userId={parseId(this.props.user)} />
                            :
                            <CardContentList contents={interests} userId={parseId(this.props.user)} onClickHandler={this.onContentClick}/>
                        }
                        <br />
                        {this.state.carousel ? '' : <div className="loading-gif" style={this.props.pagination.nextLink ? {} : {display: 'none'}}></div>}
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
                <FilterContentPopup userId={parseId(this.props.user)} contentsCount={this.props.pagination.total || 0} ownContent={true}/>
            </div>
        );
    }

    onSearchClick = function () {
        nekunoApp.popup('.popup-filter-contents');
        this.setState({
            carousel: false,
            swiper: null
        });
    };

    onContentClick(contentKey) {
        this.setState({
            carousel: true,
            position: contentKey,
            swiper: null
        });
    };

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            InterestsActionCreators.requestNextOwnInterests(parseId(this.props.user), nextLink);
        }
    }

    onNavbarLeftLinkClick() {
        this.setState({
            carousel: false
        });
    }

    initSwiper() {
        var _self = this;
        return nekunoApp.swiper('.swiper-container', {
            onReachEnd: onReachEnd,
            effect: 'coverflow',
            slidesPerView: 'auto',
            coverflow: {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : false
            },
            centeredSlides: true,
            grabCursor: true,
            initialSlide: this.state.position
        });

        function onReachEnd() {
            let pagination = _self.props.pagination;
            let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
            InterestsActionCreators.requestNextOwnInterests(parseId(_self.props.user), nextLink);
        }
    }
});