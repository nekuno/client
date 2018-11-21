import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CardTopData.scss';
import RoundedIcon from "../../ui/RoundedIcon/RoundedIcon";

export default class CardTopData extends Component {

    static propTypes = {
        image        : PropTypes.string,
        defaultImage : PropTypes.string.isRequired,
        mainText     : PropTypes.string,
        secondaryText: PropTypes.string,
        type         : PropTypes.string,
    };

    getVisualByType(type) {
        let icon = null;
        let iconBackground = null;
        switch (type) {
            case 'work':
                icon = 'paperclip';
                iconBackground = '#63CAFF';
                break;
            case 'leisure-plan':
                icon = 'send';
                iconBackground = '#D380D3';
                break;
            case 'experience-plan':
                icon = 'compass';
                iconBackground = '#7BD47E';
                break;
        }

        return {icon, iconBackground};
    }

    render() {
        const {mainText, secondaryText, type} = this.props;
        const {icon, iconBackground} = this.getVisualByType(type);
        const backgroundImage = this.props.image ? this.props.image : this.props.defaultImage;
        return (
            <div className={styles.cardtopdata}>
                {icon ?
                    <div className={styles.type}>
                        <RoundedIcon icon={icon} size={'medium'} background={iconBackground} fontSize={'24px'}/>
                    </div>
                    : null
                }
                <div className={styles.backgroundImage} >
                    <img src={backgroundImage} alt='background'/>
                    {mainText ?
                        <div className={styles.mainText}>
                            <h2 className={styles.mainText}>{mainText}</h2>
                        </div>
                        :
                        null}
                    {secondaryText ?
                        <div className={styles.secondaryText}>
                            <h4 className={styles.secondaryText}>{secondaryText}</h4>
                        </div>
                        :
                        null}

                </div>
            </div>
        )
    }
}