import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalSummary.scss';
import ProposalIcon from "../../ui/ProposalIcon";
import RoundedImage from "../../ui/RoundedImage/RoundedImage";

export default class ProposalSummary extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func,
        proposal      : PropTypes.object.isRequired,
        hasMatch      : PropTypes.bool,
        hasCount      : PropTypes.bool,
        owner         : PropTypes.object,
        // Injected by @translate:
        strings       : PropTypes.object,
    };

    handleClick(proposal) {
        this.props.onClickHandler(proposal);
    }

    renderProposalIcon(proposal) {
        let icon = '';

        switch (proposal.type) {
            case 'work':
                icon = 'project';
                break;
            case 'sports':
                icon = 'hobbie';
                break;
            case 'hobbies':
                icon = 'hobbie';
                break;
            case 'games':
                icon = 'hobbie';
                break;
            case 'shows':
                icon = 'experience';
                break;
            case 'restaurants':
                icon = 'experience';
                break;
            case 'plans':
                icon = 'experience';
                break;
            default:
                break;
        }

        return (
            <ProposalIcon size={"medium"} icon={icon}/>
        );
    }

    render() {
        const {proposal, hasMatch, owner, hasCount, strings} = this.props;

        const userPhoto = owner && owner.photos && owner.photos.length > 0 ? owner.photos[0] : '';
        const matchClassname = !hasMatch ? styles.owner + ' ' + styles.hasNoMatch : styles.owner;
        return (
            <div className={styles.proposal} onClick={() => this.handleClick.bind(this, proposal)}>
                <div className={styles.icon}>
                    {this.renderProposalIcon(proposal)}
                </div>
                <div className={styles.proposalText}>{proposal.fields.title}</div>

                {hasCount ?
                    <div className={styles.countMatches}>
                        <div className={styles.number}>{proposal.countMatches}</div>
                        <div className={styles.matchString}>{strings.matches}</div>
                    </div>
                    :

                    <div className={matchClassname}>
                        <div className={styles.userPhoto}> <RoundedImage url={userPhoto} size={"small"} /> </div>
                        <div className={styles.username} >{owner.user_name} </div>
                    </div>
                }

            </div>
        );
    }
}

ProposalSummary.defaultProps = {
    onClickHandler: () => {
    },
    strings       : {
        matches: 'Matches',
    },
    hasCount: false,
    hasMatch: false,
};