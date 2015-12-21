import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import FullWidthButton from '../components/ui/FullWidthButton';

function initSwiper() {
    // Init slider and store its instance in nekunoSwiper variable
    let nekunoSwiper = nekunoApp.swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        autoplay  : 3000
    });
}

export default class HomePage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    render() {
        initSwiper();
        return (
            <div className="view view-main">
                <div className="swiper-container swiper-init" data-speed="400" data-space-between="40" data-pagination=".swiper-pagination">
                    <div className="swiper-wrapper">
                        {this.renderSlides()}
                    </div>
                    <div className="swiper-pagination-and-button">
                        <div className="swiper-pagination"></div>
                        <Link to="/login">
                            <FullWidthButton>Iniciar sesión</FullWidthButton>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    renderSlides = function() {
        return (
            [1, 2, 3].map(i =>
                <div key={i} className="swiper-slide">
                    <div className="nekuno-logo-wrapper">
                        <div className="nekuno-logo"></div>
                    </div>
                    <div className="linear-gradient-rectangle"></div>
                    <div id={'login-' + i + '-image'} data-page="index" className="page">
                        <img src="img/transparency.png" className="full-transparency"/>
                        <div id="page-content" className="home-content">
                            <div className="title">
                                {i === 1 ? 'Descubre contenidos de los temas que más te interesan' :
                                    i === 2 ? 'Conecta sólo con las personas más compatibles' :
                                        'Tú decides la información que compartes'}
                            </div>
                        </div>
                    </div>
                </div>
            )
        );
    };

}