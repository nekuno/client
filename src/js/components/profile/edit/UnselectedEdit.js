import React, { PropTypes, Component } from 'react';
import ProfileStore from '../../../stores/ProfileStore';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class UnselectedEdit extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.string]),
        handleClickFilter: PropTypes.func.isRequired
    };
    
    render() {
        const {filterKey, filter, data} = this.props;
        return(
            <div className="thread-filter">
                <TextCheckboxes labels={[{key: filterKey, text: ProfileStore.getMetadataLabel(filter, data)}]}
                                onClickHandler={this.handleClickFilter.bind(this, filterKey)}
                                values={ProfileStore.isProfileSet(filter, data) ? [filterKey] : []} />
                <div className="table-row"></div>
            </div>
        );
    }


    handleClickFilter() {
        this.props.handleClickFilter(this.props.filterKey);
    }
}