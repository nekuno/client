import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TagInput from '../../ui/TagInput';

export default class TagFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.array,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);

        this.state = {
            tagSuggestions: []
        };
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleKeyUpTag(tag) {
        if (tag.length > 2) {
            // TODO: Call get tags action and save in store
            // TODO: Replace this example setting the tagSuggestions in getState method as props
            console.log(tag);
            this.setState({
                tagSuggestions: [tag + '1', tag + '2', tag + '3']
            });
        } else {
            this.setState({
                tagSuggestions: []
            });
        }
    }

    handleClickTagSuggestion(tagString) {
        let {filterKey, data} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value.tag === tagString);
        if (!valueIndex > -1) {
            data.push(tagString);
        }
        this.setState({
            tagSuggestions: []
        });
        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        const {tagSuggestions} = this.state;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'tag'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TagInput placeholder={'Escribe un tag'} tags={tagSuggestions}
                              onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}
                              title={filter.label} />
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}