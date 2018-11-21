import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CandidateCard.scss';
import RoundedIcon from "../../ui/RoundedIcon/RoundedIcon";
import ProgressBar from "../../ui/ProgressBar/ProgressBar";
import translate from "../../../i18n/Translate";

@translate('CandidateCard')
export default class CandidateCard extends Component {

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
        const {title, description, image} = fields;
        const proposalPhoto = fields.photo;
        const {username, location, age, photo, matching, similarity, aboutMe} = user;
        const locality = location && location.hasOwnProperty('locality') ? location.locality : '';
        const bio = aboutMe && aboutMe !== '' ? aboutMe : strings.defaultDescription + username;

        const {icon, background} = this.getVisualByType(type);

        return (
            <div className={styles.candidateCard} onClick={this.handleClick.bind(this)}>
                <div className={styles.frame}>
                    {icon ?
                        <div className={styles.type}>
                            <RoundedIcon icon={icon} size={'medium'} background={background} fontSize={'24px'}/>
                        </div>
                        : null
                    }
                    <div className={styles.candidateImage}>
                        <img src={photo.url}/>
                        <div className={styles.topData}>
                            <div className={styles.userText}>
                                <div className={styles.username}>{username}</div>
                                <div className={styles.ageCity}>{locality} &bull; {age}</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.progressBars}>
                        <div className={styles.progressBarTitle}>{strings.compatible}&nbsp;</div>
                        <div className={styles.progressBar}>
                            <ProgressBar percentage={matching} size={'small'} strokeColor={'#756EE5'} background={'white'}/>
                        </div>
                        <div className={styles.progressBarTitle}>{strings.similar}&nbsp;</div>
                        <div className={styles.progressBar}>
                            <ProgressBar percentage={similarity} size={'small'} strokeColor={'#756EE5'} background={'white'}/>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <div className={styles.resumeText}>{bio}</div>
                    </div>

                    <div className={styles.horizontalLine}>
                        <hr/>
                    </div>

                    <div className={styles.proposal}>
                        <div className={styles.compatibleProposalTitle}>
                            <h4>{strings.compatibleWithProposal}</h4>
                        </div>
                        <div className={styles.proposalContent}>
                            <img src={proposalPhoto}/>
                            <div className={styles.proposalDescription}>
                                {title}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

CandidateCard.defaultProps = {
    strings: {
        compatible            : 'Compatible',
        similar               : 'Similar',
        compatibleWithProposal: 'Compatible with your proposal!',
        defaultDescription    : 'Hi! I am ',
    }
};