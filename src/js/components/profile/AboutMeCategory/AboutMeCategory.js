import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './AboutMeCategory.scss';
import translate from "../../../i18n/Translate";

@translate('AboutMeCategory')
export default class AboutMeCategory extends Component {

    static propTypes = {
        strings: PropTypes.object,
        text   : PropTypes.string
    };

    render() {
        const {strings, text} = this.props;

        return (
            <div className={styles.aboutmecategory}>
                <div className={styles.title}>
                    {strings.about}
                </div>
                <div className={styles.text}>
                    {text}
                </div>
            </div>
        );
    }
}


AboutMeCategory.defaultProps = {
    strings: {
        about: 'About Me',
    }
};