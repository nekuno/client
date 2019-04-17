import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalFieldsPreview.scss';
import ProposalIcon from "../ProposalIcon/ProposalIcon";
import ProfileStore from "../../../stores/ProfileStore";
import connectToStores from "../../../utils/connectToStores";
import translate from '../../../i18n/Translate';

function getState(props) {

    const proposal = props.proposal;

    const metadata = ProfileStore.getMetadata();

    let experienceOptions = null;
    switch (proposal.type) {
        case 'shows':
            experienceOptions = metadata && metadata.shows ? metadata.shows.choices : [];
            break;
        case 'restaurants':
            experienceOptions = metadata && metadata.restaurants ? metadata.restaurants.choices : [];
            break;
        case 'plans':
            experienceOptions = metadata && metadata.plans ? metadata.plans.choices : [];
            break;
        default:
            break;
    }

    const industrySectorChoices = metadata && metadata.industry ? metadata.industry.choices : null;

    return {
        experienceOptions,
        industrySectorChoices
    };
}

@connectToStores([ProfileStore], getState)
@translate('ProposalFieldsPreview')
export default class ProposalFieldsPreview extends Component {

    static propTypes = {
        proposal             : PropTypes.object.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object,
        // Injected by @connectToStores:
        experienceOptions    : PropTypes.bool,
        industrySectorChoices: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.renderWorkField = this.renderWorkField.bind(this);
    }

    renderField(fields, type) {
        const {strings} = this.props;
        return <div className={'information-wrapper'}>
            <div className={'rounded-icon-wrapper'}>
                <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
            </div>
            <div className={styles.textWrapper}>
                <div className={styles.small + ' ' + styles.title}>{strings[type]}</div>
                {fields[type].map((item, index) =>
                    <div className={styles.small} key={index}>
                        {item}
                    </div>
                )}
            </div>
        </div>
    }

    renderWorkField(fields) {
        const {industrySectorChoices, strings} = this.props;
        return (
            <div>
                <div className={'information-wrapper'}>
                    <div className={'rounded-icon-wrapper'}>
                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                    </div>
                    <div className={styles.textWrapper}>
                        <div className={styles.small + ' ' + styles.title}>{strings.sectors}</div>
                        {industrySectorChoices && fields.industry ?
                            fields.industry.map((item, index) =>
                                <div className={styles.small} key={index}>
                                    {industrySectorChoices.find(x => x.id === item.value).text}
                                </div>
                            )
                            : null
                        }
                    </div>
                </div>

                {this.renderField(fields, 'profession')}
            </div>
        )
    }

    render() {
        const {proposal} = this.props;
        const {fields, type} = proposal;

        return (
            <div>
                {type === 'work' ?
                    this.renderWorkField(fields)
                    :
                    this.renderField(fields, type)
                }
            </div>)

    }
}

ProposalFieldsPreview.defaultProps = {
    strings: {
        profession : 'Professions',
        sectors    : 'Sectors',
        shows      : 'Events',
        restaurants: 'Gourmet',
        plans      : 'Plans',
        sports     : 'Sports',
        hobbies    : 'Hobbys',
        games      : 'Games',
    }
};