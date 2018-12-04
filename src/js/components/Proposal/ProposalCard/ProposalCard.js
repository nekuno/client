import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoundedImage from '../../ui/RoundedImage/RoundedImage.js';
import RoundedIcon from '../../ui/RoundedIcon/RoundedIcon.js';
import styles from './ProposalCard.scss';
import translate from '../../../i18n/Translate';
import MatchingBars from "../../ui/MatchingBars/MatchingBars";

@translate('ProposalCard')
export default class ProposalCard extends Component {

    static propTypes = {
        proposal      : PropTypes.object.isRequired,
        user          : PropTypes.object.isRequired,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    getVisualByType(type) {
        let icon = null;
        let background = null;
        switch (type) {
            case 'work':
                icon = 'paperclip';
                background = '#63CAFF';
                break;
            case 'leisure-plan':
                icon = 'send';
                background = '#D380D3';
                break;
            case 'experience-plan':
                icon = 'compass';
                background = '#7BD47E';
                break;
        }

        return {icon, background};
    }

    render() {
        const {proposal, user, strings} = this.props;
        const {type, fields} = proposal;
        const {title, description} = fields;
        const proposalPhoto = fields.photo !== '' ? fields.photo : 'img/default-upload-image.png';
        const {username, location, age, photo, matching, similarity} = user;

        const {icon, background} = this.getVisualByType(type);

        return (
            <div className={styles.proposalCard} onClick={this.handleClick.bind(this)}>
                <div className={styles.frame}>
                    {icon ?
                        <div className={styles.type}>
                            <RoundedIcon icon={icon} size={'medium'} background={background} fontSize={'24px'}/>
                        </div>
                        : null
                    }
                    <div className={styles.proposalImage}>
                        <img src={proposalPhoto}/>
                        <div className={styles.topData}>
                            <h2>{title}</h2>
                        </div>
                    </div>
                    <div className={styles.userData}>
                        <RoundedImage size={'small'} url={photo.url}/>
                        <div className={styles.userText}>
                            <div className={styles.username}>{username}</div>
                            <div className={styles.ageCity}>{location.locality} &bull; {age}</div>
                        </div>
                    </div>
                    <MatchingBars matching={matching} similarity={similarity}/>
                    <div className={styles.description}>
                        <div className={styles.resumeTitle}>{strings.project}</div>
                        <div className={styles.resumeText}>{description}</div>
                    </div>
                </div>
            </div>
        );
    }
}

ProposalCard.defaultProps = {
    strings: {
        compatible: 'Compatible',
        similar   : 'Similar',
        project   : 'Project',
    }
};