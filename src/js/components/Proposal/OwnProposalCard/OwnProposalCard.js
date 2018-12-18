import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoundedImage from '../../ui/RoundedImage/RoundedImage.js';
import RoundedIcon from '../../ui/RoundedIcon/RoundedIcon.js';
import styles from './OwnProposalCard.scss';
import translate from '../../../i18n/Translate';

@translate('OwnProposalCard')
export default class OwnProposalCard extends Component {

    static propTypes = {
        image         : PropTypes.string.isRequired,
        title         : PropTypes.string.isRequired,
        description   : PropTypes.string.isRequired,
        type          : PropTypes.string.isRequired,
        photos        : PropTypes.array,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {image, title, description, type, photos, strings} = this.props;
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

        return (
            <div className={styles.ownProposalCard} onClick={this.handleClick.bind(this)}>
                <div className={styles.frame}>
                    <div className={styles.topData}>
                        <h2>{title}</h2>
                    </div>
                    {icon ?
                        <div className={styles.type}>
                            <RoundedIcon icon={icon} size={'medium'} background={background} fontSize={'24px'}/>
                        </div>
                        : null
                    }
                    <div className={styles.proposalImage}>
                        <img src={image}/>
                    </div>
                    <div className={styles.description}>
                        <div className={styles.descriptionText + ' ' + styles.truncate}>{description}</div>
                    </div>
                    {photos &&
                    <div className={styles.userData}>
                        <div className={styles.photos}>
                            {photos.map((photo, index) =>
                                <div className={styles.photo} key={index}>
                                    <RoundedImage size={'x-small'} url={photo}/>
                                </div>
                            )}
                        </div>
                        <div className={styles.matches}>
                            {photos.length} {strings.matches}
                        </div>
                    </div>
                    }

                </div>
            </div>
        );
    }
}

OwnProposalCard.defaultProps = {
    strings: {
        matches: 'Matches',
    }
};