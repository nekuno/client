import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ExploreField from '../components/_registerFields/ExploreField';
import DetailPopup from '../components/_registerFields/DetailPopup';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import popup from '../components/Popup';
import * as UserActionCreators from '../actions/UserActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import LocaleStore from '../stores/LocaleStore';
import ProfileStore from '../stores/ProfileStore';

function requestData(props) {
    if (!props.profile) {
        UserActionCreators.requestOwnProfile(props.user.slug);
    }
}
function getState(props) {

    const interfaceLanguage = LocaleStore.locale;
    const {user} = props;
    const profile = ProfileStore.get(user.slug);

    return {
        interfaceLanguage,
        profile
    };
}

//TODO: Remove
@AuthenticatedComponent
@translate('ExplorePage')
@popup('popup-detail')
@connectToStores([LocaleStore, ProfileStore], getState)
export default class ExplorePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string,
        profile          : PropTypes.object,
        // Injected by @popup:
        showPopup        : PropTypes.func,
        closePopup       : PropTypes.func,
        popupContentRef  : PropTypes.func,
        opened           : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.saveProfile = this.saveProfile.bind(this);
        this.split = this.split.bind(this);
        this.hideContent = this.hideContent.bind(this);
        this.showContent = this.showContent.bind(this);
        this.setDetail = this.setDetail.bind(this);
        this.goToConnectSocialNetworks = this.goToConnectSocialNetworks.bind(this);
        this.onCancelDetailPopup = this.onCancelDetailPopup.bind(this);

        this.promise = null;
        this.state = {
            loginUser      : false,
            registeringUser: null,
            currentSlide: 1,
            hideContent: null,
            token: null,
            slideFixed: null,
            detail: null
        };
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate(prevProps, prevState) {
        const {detail} = this.state;
        const {opened} = this.props;

        if (detail && !opened && prevProps.opened) {
            this.setDetail(null);
        } else if (detail && detail !== prevState.detail) {
            this.props.showPopup('popup-detail');
        }
    }

    componentWillUnmount() {
        if (this.promise) {
            this.promise.cancel();
        }
    }

    saveProfile(profile) {
        profile.mode = "contact";
        UserActionCreators.editProfile(profile);
    }

    goToConnectSocialNetworks() {
        setTimeout(() => RouterActionCreators.replaceRoute('/social-networks-on-sign-up#explored'), 0);
    }

    split(text) {
        return text.split("\n").map(function(item, key) {
            return (
                key + 1 === text.split("\n").length ? <span key={key}>{item}</span> : <span key={key}>{item}<br/></span>
            )
        });
    }

    onCancelDetailPopup() {
        this.props.closePopup('popup-detail');
        this.setDetail(null);
    }

    hideContent() {
        this.setState({hideContent: true});
    }

    showContent() {
        this.setState({hideContent: false});
    }

    setDetail(name) {
        this.setState({detail: name});
    }

    render() {
        const {profile, strings} = this.props;
        const {hideContent, detail} = this.state;

        return (
            <div className="views">
                <div className="view view-main home-view explore-view">
                    <div className="swiper-container">
                        <div className="swiper-slide">
                            <div id="login-no-image" className="page">
                                <div className="bottom-background-rectangle"></div>
                                <div className={hideContent ? "vertical-hidden-content title" : "title"}>
                                    {this.split(strings.title)}
                                </div>
                                {profile ?
                                    <ExploreField showContinue={true} profile={profile} onClickField={this.hideContent} onSaveHandler={this.goToConnectSocialNetworks} onBackHandler={this.showContent} onDetailSelection={this.setDetail}/>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="nekuno-logo-wrapper">
                        <div className="nekuno-logo"></div>
                    </div>
                    <div id="page-content" className="home-content">

                    </div>
                    <div className={hideContent ? "vertical-hidden-content bottom-layer" : "bottom-layer"}>
                        <div className="swiper-pagination-and-button">
                            <div className="slider-buttons">
                                <div className="slider-button">
                                    <span className="icon icon-compass2 active"/>
                                    <div className="slider-button-text active">{strings.explore}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DetailPopup profile={profile} detail={detail} onCancel={this.onCancelDetailPopup} contentRef={this.props.popupContentRef} onSave={this.saveProfile}/>
            </div>
        );
    }

}

ExplorePage.defaultProps = {
    strings: {
        title  : 'Share what I love' + "\n" + 'joining and creating proposals',
        explore: 'Explore',
    }
};