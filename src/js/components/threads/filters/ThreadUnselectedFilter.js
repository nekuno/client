import React, { PropTypes, Component } from 'react';
import FilterStore from '../../../stores/FilterStore';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class ThreadUnselectedFilter extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };
    
    render() {
        const {filter} = this.props;
        return(
            <div className="thread-filter">
                <div className="users-middle-vertical-line"></div>
                <div className="thread-filter-dot">
                    <span className="icon-circle active"></span>
                </div>
                <TextCheckboxes labels={[{key: filter.key, text: FilterStore.getFilterLabel(filter)}]}
                                onClickHandler={this.handleClickFilter.bind(this, filter.key)}
                                values={FilterStore.isFilterSet(filter) ? [filter.key] : []} />
                <div className="table-row"></div>
            </div>
        );
    }


    handleClickFilter() {
        this.props.handleClickFilter(this.props.filter.key);
    }
}