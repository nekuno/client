import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import FullWidthButton from '../components/ui/FullWidthButton';
import moment from 'moment';
import 'moment/locale/es';
import { LAST_RELEASE_DATE } from '../constants/Constants';
import { getVersion } from '../utils/APIUtils';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';

let nekunoSwiper;

function initSwiper() {
    // Init slider and store its instance in nekunoSwiper variable
    nekunoSwiper = nekunoApp.swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        autoplay  : 3000
    });
}

function destroySwiper() {
    nekunoSwiper.destroy(true);
}

@translate('HomePage')
export default class HomePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings: PropTypes.object
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        
        this.goToRegisterPage = this.goToRegisterPage.bind(this);
        
        this.promise = null;
        this.state = {
            needsUpdating: false
        };
    }

    componentDidMount() {
        initSwiper();
        this.promise = getVersion().then((response) => {
            var lastVersion = moment(response, 'DD [de] MMMM [de] YYYY');
            var thisVersion = moment(LAST_RELEASE_DATE, 'DD [de] MMMM [de] YYYY');
            this.setState({needsUpdating: lastVersion > thisVersion});
        });
    }

    componentWillUnmount() {
        destroySwiper();
        this.promise.cancel();
    }

    loginAsGuest = function() {
        LoginActionCreators.loginUser('guest', 'guest');
    };
    
    goToRegisterPage = function() {
        this.context.history.pushState(null, '/register');
    };

    renderSlides = function() {
        const {strings} = this.props;
        return (
            [1, 2, 3].map(i =>
                <div key={i} className="swiper-slide">
                    <div id={'login-' + i + '-image'} className="page">
                        <div className="title">
                            {i === 1 ? strings.title1 : i === 2 ? strings.title2 : strings.title3}
                        </div>
                    </div>
                </div>
                
            )
        );
    };

    render() {
        const {strings} = this.props;
        return (
            <div className="view view-main home-view">
                <div className="swiper-container swiper-init" data-speed="400" data-space-between="40" data-pagination=".swiper-pagination">
                    <div className="linear-gradient-rectangle"></div>

                    <div className="swiper-wrapper">
                        {this.renderSlides()}
                    </div>
                </div>
                <div className="nekuno-logo-wrapper">
                    <div className="nekuno-logo"></div>
                </div>
                <div id="page-content" className="home-content">

                </div>
                <div className="swiper-pagination-and-button">
                    <div className="swiper-pagination"></div>
                    { this.state.needsUpdating ?
                        <FullWidthButton onClick={() => window.location = 'https://play.google.com/store/apps/details?id=com.nekuno'}>
                            {strings.update}
                        </FullWidthButton>
                        :
                        <div>
                            <Link to="/login">
                                <FullWidthButton>{strings.login}</FullWidthButton>
                            </Link>
                            <div className="register-text-block">
                                <div onClick={this.goToRegisterPage} className="register-text">
                                    <span>{strings.hasInvitation}</span> <a href="javascript:void(0)">{strings.register}</a>
                                </div>
                                <div onClick={this.loginAsGuest} className="register-text">
                                    <span>{strings.wantGuest}</span> <a href="javascript:void(0)">{strings.asGuest}</a>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

}

HomePage.defaultProps = {
    strings: {
        title1       : 'Discover contents of the topics that interest you',
        title2       : 'Connect only with most compatible people with you',
        title3       : 'You decide the information you share',
        update       : 'Update',
        login        : 'Login',
        hasInvitation: 'Do you have an invitation?',
        register     : 'Register',
        wantGuest    : 'Do you want to try it first?',
        asGuest      : 'Enter as guest'
    }
};