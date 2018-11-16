import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalFilterPreview.scss';
import RoundedIcon from "../RoundedIcon/RoundedIcon";
import translate from "../../../i18n/Translate";
import FilterStore from "../../../stores/FilterStore";
import connectToStores from "../../../utils/connectToStores";

function getState() {
    const filters = FilterStore.filters;

    return {
        filters,
    };
}

@translate('ProposalFilterPreview')
@connectToStores([FilterStore], getState)
export default class ProposalFilterPreview extends Component {

    static propTypes = {
        // Injected by @translate:
        strings        : PropTypes.object,
        proposalFilters: PropTypes.object,
        // Injected by @connectToStores:
        filters        : PropTypes.object,
    };

    renderProposalFilterArray(filter, choices) {
        let filterItem = '';
        Object.keys(filter).map(function(element, index) {
            choices.map(function(choice, i) {
                if (choice.id === filter[element])
                    filterItem += choice.text;
            });
            if (filter.length !== index + 1 && (filter instanceof Array))
                filterItem += ', ';
        });
        return filterItem;
    }

    renderProposalFilterBirthday(filter) {
        const {strings} = this.props;

        return strings.from + ' ' + filter.min + ' ' + strings.to + ' ' + filter.max + ' ' + strings.years;
    }

    renderProposalFilterLocation(filter) {
        const {strings} = this.props;

        return filter.location.address + ' ' + strings.withinRadioOf + ' ' + filter.distance + ' km';
    }

    renderProposalFilter(item, filter) {
        const {filters} = this.props;

        switch (item) {
            case 'alcohol':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'birthday':
                return this.renderProposalFilterBirthday(filter);
                break;
            case 'civilStatus':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'complexion':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'descriptiveGender':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'ethnicGroup':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'eyeColor':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'hairColor':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'interfaceLanguage':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            case 'location':
                return this.renderProposalFilterLocation(filter);
                break;
            case 'objective':
                return this.renderProposalFilterArray(filter, filters.userFilters[item].choices);
                break;
            default:
                break;
        }
    }

    render() {
        const {strings, proposalFilters, filters} = this.props;
        return (
            <div className={styles.availabilityPreview}>
                <div className={styles.roundedIconWrapper}>
                    <RoundedIcon
                        icon={'eye-off'}
                        size={'small'}
                        color={'#2B3857'}
                        background={'#E9E9E9'}/>
                </div>
                <div className={styles.textWrapper}>
                    <div className={[styles.title,styles.small]}>{strings.filterText}</div>
                </div>
                {Object.keys(proposalFilters).map((item, index) =>
                    <div key={index} className={styles.filterWrapper}>
                        <div className={styles.small}>
                            <strong>{filters.userFilters[item].label}</strong>
                        </div>
                        <div className={styles.small}>{this.renderProposalFilter(item, proposalFilters[item])}</div>
                    </div>
                )}
            </div>
        );
    }
}

ProposalFilterPreview.defaultProps = {
    strings: {
        filterText     : 'Filters to your proposal target',
        from           : 'From',
        to             : 'to',
        years          : 'years',
        withinRadioOf  : 'within radio of'
    }
};