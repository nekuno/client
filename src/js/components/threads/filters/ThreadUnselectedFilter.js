import React, { PropTypes, Component } from 'react';
import FilterStore from '../../../stores/FilterStore';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class ThreadUnselectedFilter extends Component {
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
                <div className="users-middle-vertical-line"></div>
                <div className="thread-filter-dot">
                    <span className="icon-circle active"></span>
                </div>
                <TextCheckboxes labels={[{key: filterKey, text: FilterStore.getFilterLabel(filter, data)}]}
                                onClickHandler={this.handleClickFilter.bind(this, filterKey)}
                                values={FilterStore.isFilterSet(filter, data) ? [filterKey] : []} />
                <div className="table-row"></div>
            </div>
        );
    }


    handleClickFilter() {
        this.props.handleClickFilter(this.props.filterKey);
    }
}