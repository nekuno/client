import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextRadios from '../ui/TextRadios';
import TextCheckboxes from '../ui/TextCheckboxes';
import TagInput from '../ui/TagInput';
import FullWidthButton from '../ui/FullWidthButton';
import InputCheckbox from '../ui/InputCheckbox';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import LocationSelectedFilter from './filters/LocationSelectedFilter';
import IntegerSelectedFilter from './filters/IntegerSelectedFilter';
import ChoiceSelectedFilter from './filters/ChoiceSelectedFilter';
import DoubleChoiceSelectedFilter from './filters/DoubleChoiceSelectedFilter';
import MultipleChoicesSelectedFilter from './filters/MultipleChoicesSelectedFilter';
import TagSelectedFilter from './filters/TagSelectedFilter';
import selectn from 'selectn';
import FilterStore from './../../stores/FilterStore';

export default class CreateUsersThread extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        userId: PropTypes.number.isRequired,
        filters: PropTypes.object.isRequired,
        threadName: PropTypes.string
        // TODO: defFilters should be a prop
    };
    
    constructor(props) {
        super(props);

        this.handleClickAddFilter = this.handleClickAddFilter.bind(this);
        this.renderFiltersList = this.renderFiltersList.bind(this);
        this.handleClickFilterOnList = this.handleClickFilterOnList.bind(this);
        this.renderActiveFilters = this.renderActiveFilters.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.renderLocationFilter = this.renderLocationFilter.bind(this);
        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
        this.renderChoiceFilter = this.renderChoiceFilter.bind(this);
        this.renderDoubleChoiceFilter = this.renderDoubleChoiceFilter.bind(this);
        this.renderMultipleChoicesFilter = this.renderMultipleChoicesFilter.bind(this);
        this.renderIntegerFilter = this.renderIntegerFilter.bind(this);
        this.renderTagFilter = this.renderTagFilter.bind(this);
        this.renderTagAndChoiceFilter = this.renderTagAndChoiceFilter.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickDoubleChoiceChoice = this.handleClickDoubleChoiceChoice.bind(this);
        this.handleClickDoubleChoiceDetail = this.handleClickDoubleChoiceDetail.bind(this);
        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
        this.handleClickAddTagsAndChoice = this.handleClickAddTagsAndChoice.bind(this);
        this.handleClickRemoveTagsAndChoice = this.handleClickRemoveTagsAndChoice.bind(this);
        this.handleClickTagAndChoiceTag = this.handleClickTagAndChoiceTag.bind(this);
        this.handleClickTagAndChoiceChoice = this.handleClickTagAndChoiceChoice.bind(this);
        this.handleClickTagAndChoiceTagSuggestion = this.handleClickTagAndChoiceTagSuggestion.bind(this);
        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleKeyUpTagAndChoiceTag = this.handleKeyUpTagAndChoiceTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.createThread = this.createThread.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.state = {
            selectFilter: false,
            selectedFilter: {},
            filters: [],
            tagSuggestions: [],
            selectedTagAndChoice: {}
        }
    }

    componentDidMount () {
        window.nekunoContainer.addEventListener('click', this.handleClickOutside)
    }

    componentWillUnmount () {
        window.nekunoContainer.removeEventListener('click', this.handleClickOutside)
    }

    handleClickAddFilter() {
        this.setState({
            selectFilter: true
        })
    }

    renderFiltersList() {
        const choicesLength = Object.keys(this.props.filters).length || 0;
        let firstColumnCounter = 0;
        let secondColumnCounter = 0;
        document.getElementsByClassName('view')[0].scrollTop = 0;
        return(
            <div className="list-block">
                <ul className="checkbox-filters-list">
                    {Object.keys(this.props.filters).map((id) => {
                        firstColumnCounter++;
                        if (firstColumnCounter > choicesLength / 2) {
                            return '';
                        }
                        let text = this.props.filters[id].label;
                        let checked = this.state.filters.some(filter => filter.key === this.props.filters[id].key);
                        return (
                            <li key={id}>
                                <InputCheckbox value={this.props.filters[id].key} name={this.props.filters[id].key} text={text}
                                               checked={checked} defaultChecked={false} onClickHandler={this.handleClickFilterOnList} reverse={true}/>
                            </li>
                        )
                    })}
                </ul>
                <ul className="checkbox-filters-list">
                    {Object.keys(this.props.filters).map((id) => {
                        secondColumnCounter++;
                        if (secondColumnCounter <= choicesLength / 2) {
                            return '';
                        }
                        let text = this.props.filters[id].label;
                        let checked = this.state.filters.some(filter => filter.key === this.props.filters[id].key);
                        return (
                            <li key={id}>
                                <InputCheckbox value={id} name={this.props.filters[id].key} text={text} checked={checked} defaultChecked={false} onClickHandler={this.handleClickFilterOnList} reverse={true}/>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }

    handleClickFilterOnList(checked, value) {
        let filters = this.state.filters;
        let filter = this.state.filters.find(key => key === value);
        if (typeof filter == 'undefined') {
            let defaultFilters = JSON.parse(JSON.stringify(this.props.filters));
            filter = Object.keys(defaultFilters).map(key => defaultFilters[key]).find(function (defaultFilter) {
                return defaultFilter.key === value;
            });
        }
        if (checked) {
            this.setState({
                selectFilter: false,
                selectedFilter: filter
            });
        } else {
            let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
            filters.splice(index, 1);
            this.setState({
                filters: filters,
                selectedFilter: {}
            });
        }
    }

    renderActiveFilters() {
        let filters = this.state.filters;
        let selectedFilterContent = '';
        if (this.state.selectedFilter.key) {
            let isSelectedFilterActive = filters.some(filter => filter.key === this.state.selectedFilter.key);
            if (!isSelectedFilterActive) {
                filters.push(this.state.selectedFilter);
            }
            switch (this.state.selectedFilter.type) {
                case 'location_distance':
                    selectedFilterContent = this.renderLocationFilter();
                    break;
                case 'integer_range':
                    selectedFilterContent = this.renderIntegerFilter();
                    break;
                case 'choice':
                    selectedFilterContent = this.renderChoiceFilter();
                    break;
                case 'double_choice':
                    selectedFilterContent = this.renderDoubleChoiceFilter();
                    break;
                case 'multiple_choices':
                    selectedFilterContent = this.renderMultipleChoicesFilter();
                    break;
                case 'tags_and_choice':
                    selectedFilterContent = this.renderTagAndChoiceFilter();
                    break;
                case 'tags':
                    selectedFilterContent = this.renderTagFilter();
            }
        }

        return (
            filters.map((filter, index) =>
                this.state.selectedFilter && this.state.selectedFilter.key === filter.key ?
                    selectedFilterContent :
                    <div key={index} className="thread-filter">
                        <div className="users-middle-vertical-line"></div>
                        <div className="thread-filter-dot">
                            <span className="icon-circle active"></span>
                        </div>
                        <TextCheckboxes labels={[{key: filter.key, text: FilterStore.getFilterLabel(filter)}]}
                                        onClickHandler={this.handleClickFilter.bind(this, filter.key)}
                                        values={filter.value || filter.choice || filter.value_min || filter.value_max || filter.values ? [filter.key] : []} />
                        <div className="table-row"></div>
                    </div>
            )
        );
    }

    renderLocationFilter() {
        return (
            <LocationSelectedFilter key={'selected-filter'} ref={'selectedFilter'} 
                                    handleClickRemoveFilter={this.handleClickRemoveFilter} 
                                    handleClickLocationSuggestion={this.handleClickLocationSuggestion} 
            />
        );
    }

    renderIntegerFilter() {
        return(
            <IntegerSelectedFilter key={'selected-filter'} ref={'selectedFilter'} 
                                   handleClickRemoveFilter={this.handleClickRemoveFilter} 
                                   handleChangeIntegerInput={this.handleChangeIntegerInput} 
                                   label={this.state.selectedFilter.label}
                                   filterKey={this.state.selectedFilter.key} 
                                   valueMin={this.state.selectedFilter.value_min} valueMax={this.state.selectedFilter.value_max}
                                   min={this.state.selectedFilter.min} max={this.state.selectedFilter.max}
            />
        )
    }

    renderChoiceFilter() {
        return (
            <ChoiceSelectedFilter key={'selected-filter'} ref={'selectedFilter'}
                                  handleClickRemoveFilter={this.handleClickRemoveFilter}
                                  choices={this.state.selectedFilter.choices}
                                  handleClickChoice={this.handleClickChoice}
                                  choice={this.state.selectedFilter.choice}
                                  label={this.state.selectedFilter.label}
            />
        );
    }

    renderDoubleChoiceFilter() {
        return (
            <DoubleChoiceSelectedFilter key={'selected-filter'} ref={'selectedFilter'}
                                        handleClickRemoveFilter={this.handleClickRemoveFilter}
                                        choices={this.state.selectedFilter.choices}
                                        doubleChoices={this.state.selectedFilter.doubleChoices}
                                        handleClickDoubleChoiceChoice={this.handleClickDoubleChoiceChoice}
                                        handleClickDoubleChoiceDetail={this.handleClickDoubleChoiceDetail}
                                        choice={this.state.selectedFilter.choice}
                                        detail={this.state.selectedFilter.detail}
                                        label={this.state.selectedFilter.label}
            />
        );
    }

    renderMultipleChoicesFilter() {
        return (
            <MultipleChoicesSelectedFilter key={'selected-filter'} ref={'selectedFilter'}
                                           handleClickRemoveFilter={this.handleClickRemoveFilter}
                                           choices={this.state.selectedFilter.choices}
                                           handleClickMultipleChoice={this.handleClickMultipleChoice}
                                           values={this.state.selectedFilter.values}
                                           label={this.state.selectedFilter.label}
            />
        );
    }

    renderTagFilter() {
        /* TODO: tagSuggestions should be set from props instead of state */
        return (
            <TagSelectedFilter key={'selected-filter'} ref={'selectedFilter'}
                               handleClickRemoveFilter={this.handleClickRemoveFilter}
                               tagSuggestions={this.state.tagSuggestions}
                               handleKeyUpTag={this.handleKeyUpTag}
                               handleClickTagSuggestion={this.handleClickTagSuggestion}
                               label={this.state.selectedFilter.label}
            />
        );
    }

    renderTagAndChoiceFilter() {
        const selectedFilter = this.state.selectedFilter;
        const selectedTagAndChoice = this.state.selectedTagAndChoice;
        const values = selectedFilter.values || [];
        return (
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'tags-and-choice'} active={values.some(value => value.tag !== '')} handleClickRemoveFilter={this.handleClickRemoveFilter}>
                <div className="tags-and-choice-wrapper">
                    <TagInput ref={'tagInput'} placeholder={'Escribe un tag'} tags={this.state.tagSuggestions} value={selectedTagAndChoice.tag}
                              onKeyUpHandler={this.handleKeyUpTagAndChoiceTag} onClickTagHandler={this.handleClickTagAndChoiceTagSuggestion}
                              title={selectedFilter.label} />
                    {selectedTagAndChoice.tag ?
                        <div className="tags-and-choice-choice">
                            <TextRadios labels={Object.keys(this.state.selectedFilter.choices).map(key => { return({key: key, text: this.state.selectedFilter.choices[key]}); }) }
                                    onClickHandler={this.handleClickTagAndChoiceChoice} value={selectedTagAndChoice.choice} className={'tags-and-choice-choice-radios'}
                                    title={this.state.selectedFilter.choiceLabel['es']} />
                        </div>
                        : ''}
                    {selectedTagAndChoice.tag ? <div className="remove-tags-and-choice" onClick={this.handleClickRemoveTagsAndChoice}>Eliminar <span className="icon-delete"></span></div> : ''}
                    {values.length > 0 ?
                        <div className="tags-and-choice-unselected-filters">
                            {values.filter(value => value.tag !== selectedTagAndChoice.tag).map((value, index) =>
                                <div className="tags-and-choice-unselected-filter" key={index}>
                                    <TextCheckboxes labels={[{key: value.tag, text: value.choice ? value.tag + ' ' + selectedFilter.choices[value.choice] : value.tag}]} values={[value.tag]}
                                                    onClickHandler={this.handleClickTagAndChoiceTag} className={'tags-and-choice-filter'}/>
                                </div>
                            )}
                        </div> : ''
                    }
                    {selectedTagAndChoice.tag ? <div className="add-tags-and-choice" onClick={this.handleClickAddTagsAndChoice}>Añadir <span className="icon-plus"></span></div> : ''}
                </div>
            </ThreadSelectedFilter>
        );
    }

    handleClickFilter(key) {
        let filters = this.state.filters;
        let filter = filters.find(filter => filter.key === key);

        this.setState({
            selectedFilter: filter
        });
    }

    handleClickLocationSuggestion(location) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        filter.value = location;
       
        let index = filters.findIndex(savedFilter => savedFilter.key === 'location');
        if (index > -1) {
            filters[index] = filter;
        } else {
            filters.push(filter);
        }

        this.setState({
            filters: filters,
            selectedFilter: {}
        });
    }

    handleChangeIntegerInput(value, minOrMax) {
        let selectedFilter = this.state.selectedFilter;
        let filters = this.state.filters;
        let index = filters.findIndex(savedFilter => savedFilter.key === selectedFilter.key);
        selectedFilter['value_' + minOrMax] = value;
        if (index > -1) {
            filters[index] = selectedFilter;
        } else {
            filters.push(selectedFilter)
        }

        this.setState({
            selectedFilter: selectedFilter,
            filters: filters
        });
    }

    handleClickRemoveFilter() {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
        if (index > -1) {
            filters.splice(index, 1);
        }
        this.setState({
            filters: filters,
            selectedFilter: {}
        })
    }

    handleClickChoice(choice) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let index = filters.findIndex(savedFilter => savedFilter.choice === filter.choice && savedFilter.key === filter.key);
        let selectedFilter = {};
        if (index > -1) {
            if (choice === filter.choice) {
                filters.splice(index, 1);

            } else {
                filter.choice = choice;
                filters[index] = filter;
                selectedFilter = filter;
            }
        } else {
            filter.choice = choice;
            filters.push(filter);
            selectedFilter = filter;
        }

        this.setState({
            filters: filters,
            selectedFilter: selectedFilter
        });
    }

    handleClickDoubleChoiceChoice(choice) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let index = filters.findIndex(savedFilter => savedFilter.choice === filter.choice && savedFilter.key === filter.key);
        let selectedFilter = {};
        if (index > -1) {
            if (choice === filter.choice) {
                filters.splice(index, 1);

            } else {
                filter.choice = choice;
                filters[index] = filter;
                selectedFilter = filter;
            }
        } else {
            filter.choice = choice;
            filters.push(filter);
            selectedFilter = filter;
        }
        this.setState({
            filters: filters,
            selectedFilter: selectedFilter
        });
    }

    handleClickDoubleChoiceDetail(detail) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let index = filters.findIndex(savedFilter => savedFilter.detail === filter.detail && savedFilter.key === filter.key);
        let selectedFilter = {};
        if (index > -1) {
            if (detail === filter.detail) {
                filters.splice(index, 1);

            } else {
                filter.detail = detail;
                filters[index] = filter;
                selectedFilter = filter;
            }
        } else {
            filter.detail = detail;
            filters.push(filter);
            selectedFilter = filter;
        }
        this.setState({
            filters: filters,
            selectedFilter: selectedFilter
        });
    }

    handleClickMultipleChoice(choice) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
        filter.values = filter.values || [];
        if (index > -1) {
            const valueIndex = filter.values.findIndex(value => value === choice);
            if (valueIndex > -1) {
                filter.values.splice(valueIndex, 1);
            } else {
                filter.values.push(choice);
            }
            filters[index] = filter;
        } else {
            filter.values.push(choice);
            filters.push(filter);
        }

        this.setState({
            filters: filters,
            selectedFilter: filter
        });
    }

    handleClickTagAndChoiceTag(tag) {
        const values = this.state.selectedFilter.values || [];
        const index = values.findIndex(value => value.tag === tag);
        let selectedTagAndChoice = this.state.selectedFilter.values[index];
        selectedTagAndChoice.index = index;
        this.refs.tagInput.setValue(tag);
        this.refs.tagInput.focus();
        if (index > -1) {
            this.setState({
                selectedTagAndChoice: selectedTagAndChoice
            });
        }
    }

    handleClickAddTagsAndChoice() {
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.setState({
            selectedTagAndChoice: {}
        });
    }

    handleClickRemoveTagsAndChoice() {
        const selectedTagAndChoice = this.state.selectedTagAndChoice;
        const filters = this.state.filters;
        let selectedFilter = this.state.selectedFilter;
        const index = filters.findIndex(filter => filter.key === selectedFilter.key);
        selectedFilter.values.splice(selectedTagAndChoice.index, 1);
        filters[index] = selectedFilter;
        this.refs.tagInput.clearValue();
        this.refs.tagInput.focus();
        this.setState({
            selectedTagAndChoice: {},
            filters: filters,
            selectedFilter: selectedFilter
        });
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

    handleKeyUpTagAndChoiceTag(tag) {
        if (tag.length > 2) {
            // TODO: Call get tags action and save in store
            // TODO: Replace this example setting the tagSuggestions in getState method as props
            console.log(tag);
            this.setState({
                tagSuggestions: [tag, tag + '2', tag + '3']
            });
        } else {
            this.setState({
                tagSuggestions: []
            });
        }
    }

    handleClickTagSuggestion(tagString) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
        filter.values = filter.values || [];
        if (index > -1) {
            if (!filter.values.some(value => value === tagString)) {
                filter.values.push(tagString);
                filters[index] = filter;
            }
        } else {
            filter.values.push(tagString);
            filters.push(filter);
        }

        this.setState({
            filters: filters,
            selectedFilter: {},
            tagSuggestions: []
        });
    }

    handleClickTagAndChoiceTagSuggestion(tagString) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        filter.values = filter.values || [];
        let selectedTagAndChoice = this.state.selectedTagAndChoice;
        let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
        if (index > -1) {
            const valueIndex = filter.values.findIndex(value => value.tag === tagString);
            if (valueIndex > -1) {
                selectedTagAndChoice = filter.values[valueIndex];
                selectedTagAndChoice.index = valueIndex;
            } else {
                selectedTagAndChoice = {tag: tagString, index: filter.values.length};
                filter.values.push(selectedTagAndChoice);
                filters[index] = filter;
            }
        }
            
        this.refs.tagInput.setValue(tagString);
        this.setState({
            filters: filters,
            selectedTagAndChoice: selectedTagAndChoice,
            tagSuggestions: []
        });
    }

    handleClickTagAndChoiceChoice(choice) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let selectedTagAndChoice = this.state.selectedTagAndChoice || {};
        let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
        let selectedFilter = {};
        if (index > -1) {
            const valuesIndex = filter.values.findIndex(value => value.tag === selectedTagAndChoice.tag);
            if (valuesIndex > -1) {
                filter.values[valuesIndex].choice = choice;
                filters[index] = filter;
                selectedFilter = filter;
                selectedTagAndChoice = filter.values[valuesIndex];
            }
        }
        this.setState({
            filters: filters,
            selectedFilter: selectedFilter,
            selectedTagAndChoice: selectedTagAndChoice
        });
    }

    createThread() {
        let data = {
            name: this.props.threadName,
            filters: {profileFilters: {}, userFilters: {}},
            category: 'ThreadUsers'
        };

        let stateFilters = this.state.filters;

        for (let stateFilter of stateFilters) {
            //TODO: Improve reading from metadata
            let box = 'profileFilters';
            switch (stateFilter.type) {
                case 'choice':
                    data.filters[box][stateFilter.key] = stateFilter.choice;
                    break;
                case 'location_distance':
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['location'] = stateFilter.value;
                    data.filters[box][stateFilter.key]['distance'] = 50;
                    break;
                case 'tags':
                    data.filters[box][stateFilter.key] = stateFilter.values;
                    break;
                case 'double_choice':
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['choice'] = stateFilter.choice;
                    data.filters[box][stateFilter.key]['detail'] = stateFilter.detail;
                    break;
                case 'multiple_choices':
                    data.filters[box][stateFilter.key] = stateFilter.values;
                    break;
                case 'integer_range':
                    if (stateFilter.key == 'similarity' || stateFilter.key == 'compatibility'){
                        box = 'userFilters';
                    }
                    data.filters[box][stateFilter.key] = {};
                    data.filters[box][stateFilter.key]['min'] = selectn('value_min', stateFilter)? stateFilter.value_min : stateFilter.min;
                    data.filters[box][stateFilter.key]['max'] = selectn('value_max', stateFilter)? stateFilter.value_max : stateFilter.max;
                    break;
                default:
                    break;
            }
        }
        let history = this.context.history;
        UserActionCreators.createThread(this.props.userId, data)
        .then(function(){
            history.pushState(null, `threads`);
        });
    }

    handleClickOutside(e) {
        const selectedFilter = this.refs.selectedFilter;
        if (selectedFilter && selectedFilter.getSelectedFilter() && !selectedFilter.selectedFilterContains(e.target)) {
            this.setState({selectedFilter: {}});
        }
    }

    render() {
        Object.keys(this.props.filters).forEach(key => this.props.filters[key].key = key);
        return (
            this.state.selectFilter ?
                <div className="select-filter">
                    <div className="title">Selecciona un filtro</div>
                    {this.renderFiltersList()}
                </div>
                :
                <div className="users-filters-wrapper">
                    <div className="table-row"></div>
                    {this.renderActiveFilters()}
                    <div className="table-row"></div>
                    <div className="thread-filter add-filter">
                        <div className="thread-filter-dot">
                            <span className="icon-plus active"></span>
                        </div>
                        <div className="users-opposite-vertical-line"></div>
                        <div className="add-filter-button-wrapper" onClick={this.handleClickAddFilter}>
                            <div className="add-filter-button">
                                <span className="add-filter-button-text">Añadir filtro</span>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <FullWidthButton onClick={this.createThread}>Crear hilo</FullWidthButton>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
        );
    }
}
