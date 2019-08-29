import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FilterStore from '../../../stores/FilterStore';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class ThreadUnselectedFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.string]),
        handleClickFilter: PropTypes.func.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        cantRemove: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
    }
    
    render() {
        const {filterKey, filter, data, cantRemove} = this.props;
        return(
            <div className="thread-filter">
                <div className="persons-middle-vertical-line"></div>
                <div className="thread-filter-dot">
                    <span className="icon-circle active"></span>
                </div>
                <TextCheckboxes labels={[{key: filterKey, text: FilterStore.getFilterLabel(filter, data)}]}
                                onClickHandler={this.handleClickFilter}
                                values={FilterStore.isFilterSet(filter, data) ? [filterKey] : []} />
                {cantRemove ? null : <div className="delete-filter" onClick={this.handleClickRemoveFilter}><span className="mdi mdi-delete"></span></div>}
                <div className="table-row"></div>
            </div>
        );
    }

    handleClickRemoveFilter() {
        this.props.handleClickRemoveFilter(this.props.filterKey);
    }

    handleClickFilter() {
        this.props.handleClickFilter(this.props.filterKey);
    }
}