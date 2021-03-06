import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoundedImage from '../../ui/RoundedImage/RoundedImage.js';
import styles from './ProposalCard.scss';
import translate from '../../../i18n/Translate';
import MatchingBars from "../../ui/MatchingBars/MatchingBars";
import ProposalIcon from "../../../components/ui/ProposalIcon/ProposalIcon";

@translate('ProposalCard')
export default class ProposalCard extends Component {

    static propTypes = {
        proposal      : PropTypes.object.isRequired,
        user          : PropTypes.object.isRequired,
        onClickHandler: PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClickHandler();
    }

    renderProposalIcon(proposal) {
        let icon = '';

        switch (proposal.type) {
            case 'sports':
            case 'hobbies':
            case 'games':
                icon = 'hobbie';
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                icon = 'experience';
                break;
            case 'work':
            default:
                icon = 'project';
                break;
        }

        return (
            <ProposalIcon size={'medium-small'} icon={icon} background={'white'}/>
        );
    }

    render() {
        const {proposal, user, strings} = this.props;
        const {fields} = proposal;
        const {title, description} = fields;
        const proposalPhoto = fields.photo !== '' ? fields.photo : 'img/default-upload-image.png';
        const {username, location, age, photo, matching, similarity} = user;
        const locality = location && location.hasOwnProperty('locality') ? location.locality : '';

        return (
            <div className={styles.proposalCard}>
                <div className={styles.frame}>
                    <div className={styles.type}>
                        {this.renderProposalIcon(proposal)}
                    </div>
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
                            <div className={styles.ageCity}>{locality} &bull; {age}</div>
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
    },
    onClickHandler: () => {
    }
};