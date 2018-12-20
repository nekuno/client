import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SliderPhotos.scss';
import Slider from 'react-slick';

export default class SliderPhotos extends Component {

    static propTypes = {
        photos: PropTypes.array
    };

    render() {
        const {photos} = this.props;

        const settings = {
            accessibility : false,
            draggable     : false,
            swipe         : true,
            fade          : true,
            className     : 'swiper-wrapper',
            dots          : true,
            infinite      : false,
            slidesToShow  : 1,
            slidesToScroll: 1,
            arrows        : false,
            autoplay      : false,
            initialSlide  : 0,
            customPaging  : (i) => <div className={"dot dot-" + i}/>,
        };

        return (
            <Slider {...settings} ref={c => this.slider = c}>
                {photos.map(photo => {
                        return (
                            <div key={photo} className={styles.swiperSlide}>
                                <div className={styles.photo}>
                                    <img src={photo} alt={'photo'}/>
                                </div>
                            </div>
                        )
                    }
                )}
            </Slider>
        );
    }
}