import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './NaturalCategory.scss';
import RoundedIcon from "../../ui/RoundedIcon/RoundedIcon";

export default class NaturalCategory extends Component {

    static propTypes = {
        category: PropTypes.string,
        text    : PropTypes.string
    };

    getVisualByType(type) {
        let icon = null;
        let background = null;
        switch (type) {
            case 'Work':
                icon = 'paperclip';
                background = '#63CAFF';
                break;
            case 'Leisure':
                icon = 'send';
                background = '#D380D3';
                break;
            case 'Experience':
                icon = 'compass';
                background = '#7BD47E';
                break;
        }

        return {icon, background};
    }

    render() {
        const {category, text} = this.props;
        const {icon, background} = this.getVisualByType(category);

        return (
            <div className={styles.naturalCategory}>
                <div className={styles.icon}>
                    <RoundedIcon icon={icon} size={'medium'} background={background} fontSize={'24px'}/>
                </div>
                <div className={styles.text}>
                    {text}
                </div>
            </div>

        );
    }
}