import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SliderPhotos.scss';
import Slider from 'react-slick';

export default class SliderPhotos extends Component {

    static propTypes = {
        photos: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onSwipe = this.onSwipe.bind(this);
    }

    componentDidMount() {
        this.slider.slickGoTo(0, true);
    }

    onSwipe(index) {
        this.slider.slickGoTo(index, true);
    }

    render() {
        const {photos} = this.props;

        const settings = {
            accessibility : false,
            draggable     : true,
            swipe         : true,
            fade          : false,
            className     : styles.swiperWrapper,
            dots          : true,
            dotsClass     : styles.slickDots,
            infinite      : true,
            slidesToShow  : 1,
            slidesToScroll: 1,
            arrows        : false,
            autoplay      : false,
            initialSlide  : 0,
            afterChange   : this.onSwipe,
            centerMode    : true,
            customPaging  : () => <div className={styles.dot}/>,
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