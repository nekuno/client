import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CandidateCard.scss';
import translate from "../../../i18n/Translate";
import MatchingBars from "../../ui/MatchingBars";

@translate('CandidateCard')
class CandidateCard extends Component {

    static propTypes = {
        proposal      : PropTypes.object.isRequired,
        user          : PropTypes.object.isRequired,
        onClickHandler: PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object,
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
                icon = 'icon-hobbie';
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                icon = 'icon-experience';
                break;
            case 'work':
            default:
                icon = 'icon-project';
                break;
        }

        return (
            <span className={icon}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
                <span className="path7"></span>
            </span>
        );
    }

    render() {
        const {proposal, user, strings} = this.props;
        const {fields} = proposal;
        const {title} = fields;
        const proposalPhoto = fields.photo;
        const {username, location, age, photo, matching, similarity, aboutMe} = user;
        const locality = location && location.hasOwnProperty('locality') ? location.locality : '';
        const bio = aboutMe && aboutMe !== '' ? aboutMe : strings.defaultDescription + username;

        return (
			<div className={styles.candidateCard}>
				<div className={styles.frame}>
					<div className={styles.type}>
						{this.renderProposalIcon(proposal)}
					</div>
					<div className={styles.candidateImage}>
						<div
							className={styles.image}
							style={{
								backgroundImage:
									"url(" + photo.url + ")"
							}}
						/>
						<div className={styles.topData}>
							<div className={styles.userText}>
								<div className={styles.username}>
									{username}
								</div>
								<div className={styles.ageCity}>
									{locality} &bull; {age}
								</div>
							</div>
						</div>
					</div>

					<MatchingBars
						matching={matching}
						similarity={similarity}
					/>

					<div className={styles.description}>
						<div className={styles.resumeText}>{bio}</div>
					</div>

					<div className={styles.horizontalLine}>
						<hr />
					</div>

					<div className={styles.proposal}>
						<div className={styles.compatibleProposalTitle}>
							<h4>{strings.compatibleWithProposal}</h4>
						</div>
						<div className={styles.proposalContent}>
							<img src={proposalPhoto} />
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
    strings       : {
        compatible            : 'Compatible',
        similar               : 'Similar',
        compatibleWithProposal: 'Compatible with your proposal!',
        defaultDescription    : 'Hi! I am ',
    },
    onClickHandler: () => {
    }
};

export default CandidateCard;
