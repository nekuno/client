import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import FullWidthButton from '../components/ui/FullWidthButton';
import moment from 'moment';
import 'moment/locale/es';
import { LAST_RELEASE_DATE } from '../constants/Constants';
import { getVersion } from '../utils/APIUtils';

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

export default class HomePage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
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

    render() {

        return (
            <div className="view view-main">
                <div className="swiper-container swiper-init" data-speed="400" data-space-between="40" data-pagination=".swiper-pagination">
                    <div className="swiper-wrapper">
                        {this.renderSlides()}
                    </div>
                </div>
            </div>
        );
    }

    renderSlides = function() {
        return (
            [1, 2, 3].map(i =>
                <div key={i} className="swiper-slide">
                    <div id={'login-' + i + '-image'} data-page="index" className="page">
                        <div className="linear-gradient-rectangle"></div>
                        <div className="nekuno-logo-wrapper">
                            <div className="nekuno-logo"></div>
                        </div>
                        <div id="page-content" className="home-content">
                            <div className="title">
                                {i === 1 ? 'Descubre contenidos de los temas que más te interesan' :
                                    i === 2 ? 'Conecta sólo con las personas más compatibles contigo' :
                                        'Tú decides la información que compartes'}
                            </div>
                        </div>
                        <div className="swiper-pagination-and-button">
                            <div className="swiper-pagination"></div>
                            { this.state.needsUpdating ?
                                <FullWidthButton onClick={() => window.location = 'https://play.google.com/store/apps/details?id=com.nekuno'}>
                                    Actualizar
                                </FullWidthButton>
                                :
                                <div>
                                    <Link to="/login">
                                        <FullWidthButton>Iniciar sesión</FullWidthButton>
                                    </Link>
                                    <div className="register">
                                        <span>¿Tienes una invitación?</span> <Link to="/register">Regístrate</Link>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )
        );
    };
}