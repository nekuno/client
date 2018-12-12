import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CarouselContinuous.scss';
import PersonsPage from "../../../pages/PersonsPage";

export default class CarouselContinuous extends Component {

    static propTypes = {
        items      : PropTypes.array.isRequired,
        marginRight: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.renderItems = this.renderItems.bind(this);
    }

    renderItems() {
        const marginRight = this.props.marginRight;
        return this.props.items.map((item) => {
            return <div className={styles.item} style={{'margin-right': marginRight + '%'}}>
                {item}
            </div>
        });
    }

    render() {
        return (
            <div className={styles.carouselcontinuous} >
                {this.renderItems()}
            </div>
        );
    }
}

CarouselContinuous.defaultProps = {
    marginRight: 80
};