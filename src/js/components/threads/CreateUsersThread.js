import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import TextRadios from '../ui/TextRadios';
import TextCheckboxes from '../ui/TextCheckboxes';
import TagInput from '../ui/TagInput';
import FullWidthButton from '../ui/FullWidthButton';
import InputCheckbox from '../ui/InputCheckbox';
import LocationInput from '../ui/LocationInput';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import selectn from 'selectn';

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
        this.handleChangeMinIntegerInput = this.handleChangeMinIntegerInput.bind(this);
        this.handleChangeMaxIntegerInput = this.handleChangeMaxIntegerInput.bind(this);
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
        let locationFilter = filters.find(filter => filter.type === 'location_distance');
        let integerFilter = filters.filter(filter => filter.type === 'integer_range');
        let choicesFilter = filters.filter(filter => filter.type === 'choice');
        let doubleChoicesFilter = filters.filter(filter => filter.type === 'double_choice');
        let multipleChoicesFilter = filters.filter(filter => filter.type === 'multiple_choices');
        let tagsFilter = filters.filter(filter => filter.type === 'tags');
        let tagAndChoiceFilter = filters.filter(filter => filter.type === 'tags_and_choice');
        let filterCheckboxes = [];
        if (locationFilter) {
            let address = locationFilter.value ? locationFilter.value.address : '';
            filterCheckboxes.push({
                label: {key: 'location', text: address ? locationFilter.label + ' - ' + address : locationFilter.label},
                value: 'location',
                selected: this.state.selectedFilter && this.state.selectedFilter.key === 'location'
            });
        }
        if (integerFilter) {
            integerFilter.forEach(filter => {
                let text = filter.label;
                text += !isNaN(filter.value_min) ? ' - Min: ' + filter.value_min : '';
                text += !isNaN(filter.value_max) ? ' - Max: ' + filter.value_max : '';

                filterCheckboxes.push({
                    label: {key: filter.key, text: text},
                    value: filter.key,
                    selected: this.state.selectedFilter && this.state.selectedFilter.key === filter.key
                });
            });
        }
        if (choicesFilter) {
            choicesFilter.forEach(filter => {
                let choice = filter.choices.find(choice => choice.value === filter.choice);
                let choiceLabel = choice ? choice.label : '';
                filterCheckboxes.push({
                    label: {key: filter.key, text: choiceLabel ? filter.label + ' - ' + choiceLabel : filter.label},
                    value: filter.key,
                    selected: this.state.selectedFilter && this.state.selectedFilter.key === filter.key
                });
            });
        }
        if (doubleChoicesFilter) {
            doubleChoicesFilter.forEach(filter => {
                let choice = filter.choices[Object.keys(filter.choices).find(key => key === filter.choice)];
                let detail = filter.detail ? filter.doubleChoices[filter.choice][Object.keys(filter.doubleChoices[filter.choice]).find(key => key === filter.detail)] : '';
                filterCheckboxes.push({
                    label: {key: filter.key, text: choice ? filter.label + ' - ' + choice + ' ' + detail : filter.label},
                    value: filter.key,
                    selected: this.state.selectedFilter && this.state.selectedFilter.key === filter.key
                });
            });
        }
        if (multipleChoicesFilter) {
            multipleChoicesFilter.forEach(filter => {
                let values = filter.values || [];
                let textArray = values.map(value => filter.choices[value]);
                let text = textArray.length > 0 ? filter.label + ' - ' + textArray.join(', ') : filter.label;
                filterCheckboxes.push({
                    label: {key: filter.key, text: text},
                    value: filter.key,
                    selected: this.state.selectedFilter && this.state.selectedFilter.key === filter.key
                });
            });
        }
        if (tagsFilter) {
            tagsFilter.forEach(filter => {
                let tags = filter.values;
                let text = tags && tags.length > 0 ? filter.label + ' - ' + tags.join(', ') : filter.label;
                filterCheckboxes.push({
                    label: {key: filter.key, text: text},
                    value: filter.key,
                    selected: this.state.selectedFilter && this.state.selectedFilter.key === filter.key
                });
            });
        }
        if (tagAndChoiceFilter) {
            tagAndChoiceFilter.forEach(filter => {
                let values = filter.values;
                let text = values && values.length > 0 ? filter.label + ' - ' + values.map(value => value.choice ? value.tag + ' ' + filter.choices[value.choice] : value.tag).join(', ') : filter.label;
                filterCheckboxes.push({
                    label: {key: filter.key, text: text},
                    value: filter.key,
                    selected: this.state.selectedFilter && this.state.selectedFilter.key === filter.key
                });
            });
        }

        return (
            filterCheckboxes.map((filterCheckbox, index) =>
                filterCheckbox.selected ?
                    selectedFilterContent :
                    <div key={index} className="thread-filter">
                        <div className="users-middle-vertical-line"></div>
                        <div className="thread-filter-dot">
                            <span className="icon-circle active"></span>
                        </div>
                        <TextCheckboxes labels={[filterCheckbox.label]}
                                        onClickHandler={this.handleClickFilter.bind(this, filterCheckbox.label.key)}
                                        values={filters.map(filter => {return filter.value || filter.choice || filter.value_min || filter.value_max || filter.values ? filter.key : null})} />
                        <div className="table-row"></div>
                    </div>
            )
        );
    }

    renderLocationFilter() {
        return (
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveFilter={this.handleClickRemoveFilter}>
                <div className="list-block">
                    <div className="location-title">Ubicación</div>
                    <LocationInput placeholder={'Escribe una ubicación'} onSuggestSelect={this.handleClickLocationSuggestion}/>
                </div>
            </ThreadSelectedFilter>
        );
    }

    renderIntegerFilter() {
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'integer'} plusIcon={true} handleClickRemoveFilter={this.handleClickRemoveFilter}>
                <div className="list-block">
                    <div className="integer-title">{this.state.selectedFilter.label}</div>
                    <ul>
                        <TextInput ref={this.state.selectedFilter.key + '_min'} placeholder={'Mínimo'} onChange={this.handleChangeMinIntegerInput} defaultValue={this.state.selectedFilter.value_min}/>
                        <TextInput ref={this.state.selectedFilter.key + '_max'} placeholder={'Maximo'} onChange={this.handleChangeMaxIntegerInput} defaultValue={this.state.selectedFilter.value_max}/>
                    </ul>
                </div>
            </ThreadSelectedFilter>
        );
    }

    renderChoiceFilter() {
        return (
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={this.state.selectedFilter.choice ? true : false} handleClickRemoveFilter={this.handleClickRemoveFilter}>
                <TextRadios labels={this.state.selectedFilter.choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                            onClickHandler={this.handleClickChoice} value={this.state.selectedFilter.choice} className={'choice-filter'}
                            title={this.state.selectedFilter.label} />
            </ThreadSelectedFilter>
        );
    }

    renderDoubleChoiceFilter() {
        return (
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={this.state.selectedFilter.choice ? true : false} handleClickRemoveFilter={this.handleClickRemoveFilter}>
                <div className="double-choice-filter">
                  <TextRadios labels={Object.keys(this.state.selectedFilter.choices).map(choice => { return({key: choice, text: this.state.selectedFilter.choices[choice]}); }) }
                              onClickHandler={this.handleClickDoubleChoiceChoice} value={this.state.selectedFilter.choice} className={'double-choice-choice'}
                              title={this.state.selectedFilter.label} />
                  {this.state.selectedFilter.choice ?
                      <TextRadios labels={Object.keys(this.state.selectedFilter.doubleChoices[this.state.selectedFilter.choice]).map(doubleChoice => { return({key: doubleChoice, text: this.state.selectedFilter.doubleChoices[this.state.selectedFilter.choice][doubleChoice]}); }) }
                              onClickHandler={this.handleClickDoubleChoiceDetail} value={this.state.selectedFilter.detail} className={'double-choice-detail'}/>
                      : ''}
                </div>
          </ThreadSelectedFilter>
        );
    }

    renderMultipleChoicesFilter() {
        return (
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'checkbox'} active={this.state.selectedFilter.values && this.state.selectedFilter.values.length > 0} handleClickRemoveFilter={this.handleClickRemoveFilter}>
                <TextCheckboxes labels={Object.keys(this.state.selectedFilter.choices).map(key => { return({key: key, text: this.state.selectedFilter.choices[key]}) })}
                                onClickHandler={this.handleClickMultipleChoice} values={this.state.selectedFilter.values || []} className={'multiple-choice-filter'}
                                title={this.state.selectedFilter.label} />
            </ThreadSelectedFilter>
        );
    }

    renderTagFilter() {
        return (
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'tag'} plusIcon={true} handleClickRemoveFilter={this.handleClickRemoveFilter}>
                {/* TODO: tagSuggestions should be set from props instead of state */}
                <TagInput placeholder={'Escribe un tag'} tags={this.state.tagSuggestions}
                          onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}
                          title={this.state.selectedFilter.label} />
            </ThreadSelectedFilter>
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

    handleClickLocationSuggestion(suggest) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let locality = '', country = '';
        suggest.gmaps.address_components.forEach(function(component) {
            component.types.forEach(function(type) {
                if (!locality && type === 'locality') {
                    locality = component.long_name;
                }
                if (!country && type === 'country') {
                    country = component.long_name;
                }
            });
        });
        filter.value = {
            latitude: suggest.location.lat,
            longitude: suggest.location.lng,
            address: suggest.gmaps.formatted_address,
            locality: locality,
            country: country
        };
        let index = filters.findIndex(savedFilter => savedFilter.key === 'location');
        if (index == -1) {
            filters.push(filter);
        } else {
            filters[index] = filter;
        }

        this.setState({
            filters: filters,
            selectedFilter: {}
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
    
    handleChangeMinIntegerInput() {
        let selectedFilter = this.state.selectedFilter;
        let filters = this.state.filters;
        let index = filters.findIndex(savedFilter => savedFilter.key === selectedFilter.key);

        clearTimeout(this.minIntegerTimeout);
        this.minIntegerTimeout = setTimeout(() => {
            const text = parseInt(this.refs[selectedFilter.key + '_min'].getValue());
            if (typeof text === 'number' && (text % 1) === 0 || text === '') {
                if (typeof text === 'number' && text < selectedFilter.min) {
                    nekunoApp.alert('El valor mínimo de este valor es ' + selectedFilter.min);
                } else {
                    selectedFilter.value_min = text;
                }
            }
            if (index > -1) {
                filters[index] = selectedFilter;
            } else {
                filters.push(selectedFilter)
            }

            this.setState({
                selectedFilter: selectedFilter,
                filters: filters
            });
        }, 500);
    }

    handleChangeMaxIntegerInput() {
        let selectedFilter = this.state.selectedFilter;
        let filters = this.state.filters;
        let index = filters.findIndex(savedFilter => savedFilter.key === selectedFilter.key);

        clearTimeout(this.maxIntegerTimeout);
        this.maxIntegerTimeout = setTimeout(() => {
            const text = parseInt(this.refs[selectedFilter.key + '_max'].getValue());
            if (typeof text === 'number' && (text % 1) === 0 || text === '') {
                if (typeof text === 'number' && text > selectedFilter.max) {
                    nekunoApp.alert('El valor máximo de este valor es ' + selectedFilter.max);
                } else {
                    selectedFilter.value_max = text;
                }
            }
            if (index > -1) {
                filters[index] = selectedFilter;
            } else {
                filters.push(selectedFilter)
            }

            this.setState({
                selectedFilter: selectedFilter,
                filters: filters
            });
        }, 500);
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
