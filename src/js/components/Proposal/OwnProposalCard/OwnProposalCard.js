import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoundedImage from '../../ui/RoundedImage/RoundedImage.js';
import RoundedIcon from '../../ui/RoundedIcon/RoundedIcon.js';
import styles from './OwnProposalCard.scss';
import translate from '../../../i18n/Translate';

@translate('OwnProposalCard')
export default class OwnProposalCard extends Component {

    static propTypes = {
        fields                 : PropTypes.shape({
            photo : PropTypes.string.isRequired,
            title         : PropTypes.string.isRequired,
            description   : PropTypes.string.isRequired,
        }),
        image         : PropTypes.string,
        type          : PropTypes.string.isRequired,
        photos        : PropTypes.array,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    renderProposalIcon(proposal) {
        let icon = '';

        switch (proposal.type) {
            case 'work':
                icon = 'icon-project';
                break;
            case 'sports':
                icon = 'icon-hobbie';
                break;
            case 'hobbies':
                icon = 'icon-hobbie';
                break;
            case 'games':
                icon = 'icon-hobbie';
                break;
            case 'shows':
                icon = 'icon-experience';
                break;
            case 'restaurants':
                icon = 'icon-experience';
                break;
            case 'plans':
                icon = 'icon-experience';
                break;
            default:
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
        const {type, photos, strings, fields} = this.props;

        return (
            <div className={styles.ownProposalCard} onClick={this.handleClick.bind(this)}>
                <div className={styles.frame}>
                    <div className={styles.topData}>
                        <h2>{fields.title}</h2>
                    </div>
                    {type ?
                        <div className={styles.type}>
                            {this.renderProposalIcon({type: type})}
                            {/*<RoundedIcon icon={icon} size={'medium'} background={background} fontSize={'24px'}/>*/}
                        </div>
                        : null
                    }
                    <div className={styles.proposalImage}>
                        <img src={fields.photo === '' ? 'https://dummyimage.com/290x130/000000/fff' : fields.photo }/>
                    </div>
                    <div className={styles.description}>
                        <div className={styles.descriptionText + ' ' + styles.truncate}>{fields.description}</div>
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