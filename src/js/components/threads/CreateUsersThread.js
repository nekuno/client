import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import TextRadios from '../ui/TextRadios';
import TextCheckboxes from '../ui/TextCheckboxes';
import TagInput from '../ui/TagInput';
import FullWidthButton from '../ui/FullWidthButton';
import InputCheckbox from '../ui/InputCheckbox';
import LocationInput from '../ui/LocationInput';

export default class CreateUsersThread extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        userId: PropTypes.number.isRequired
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
        this.renderIntegerFilter = this.renderIntegerFilter.bind(this);
        this.renderTagFilter = this.renderTagFilter.bind(this);
        this.renderSelectedFilterBackground = this.renderSelectedFilterBackground.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickDoubleChoiceChoice = this.handleClickDoubleChoiceChoice.bind(this);
        this.handleClickDoubleChoiceDetail = this.handleClickDoubleChoiceDetail.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.createThread = this.createThread.bind(this);


        this.defaultFilters = {
            'orientation': {
                type: 'choice',
                label: 'Orientación sexual',
                choices: [
                    {
                        value: 'heterosexual',
                        label: 'Heterosexual'
                    },
                    {
                        value: 'bisexual',
                        label: 'Bisexual'
                    },
                    {
                        value: 'homosexual',
                        label: 'Homosexual'
                    }
                ]
            },
            'civilStatus': {
                type: 'choice',
                label: 'Estado civil',
                choices: [
                    {
                        value: 'married',
                        label: 'Casado'
                    },
                    {
                        value: 'single',
                        label: 'Soltero'
                    }
                ]
            },
            'complexion': {
                type: 'choice',
                label: 'Complexión',
                choices: [
                    {
                        value: 'slim',
                        label: 'Delgado'
                    },
                    {
                        value: 'normal',
                        label: 'Normal'
                    },
                    {
                        value: 'fat',
                        label: 'Gordo'
                    }
                ]
            },
            'complexion2': {
                type: 'choice',
                label: 'Complexión2',
                choices: [
                    {
                        value: 'slim2',
                        label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                    },
                    {
                        value: 'normal2',
                        label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                    },
                    {
                        value: 'fat2',
                        label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                    }
                ]
            },
            'location': {
                type: 'location',
                label: 'Ubicación'
            },
            'height': {
                type: 'integer',
                label: 'Altura',
                min: 0,
                max: 250
            },
            'sons': {
                type: 'double_choice',
                label: 'Hijos',
                doubleChoices: {
                    yes: {
                        might_want: "y quizás quiera más",
                        want: "y quiero más",
                        not_want: "y no quiero más"
                    },
                    no: {
                        might_want: "pero quizás quiera",
                        want: "pero quiero",
                        not_want: "y no quiero ninguno"
                    }
                },
                choices: {
                    yes: 'Tengo hijos',
                    no: 'No tengo hijos'
                }
            },
            'sonss': {
                type: 'double_choice',
                label: 'Hijos (ejemplo 2)',
                doubleChoices: {
                    yes: {
                        might_want: "y quizás quiera más",
                        want: "y quiero más",
                        not_want: "y no quiero más"
                    },
                    no: {
                        might_want: "pero quizás quiera",
                        want: "pero quiero",
                        not_want: "y no quiero ninguno"
                    }
                },
                choices: {
                    yes: 'Tengo hijos 2',
                    no: 'No tengo hijos 2'
                }
            },
            'allergy': {
                type: 'tags',
                label: 'Alergia'
            },
            'education': {
                type: 'tags',
                label: 'Educación'
            }
        };

        this.state = {
            selectFilter: false,
            selectedFilter: {},
            filters: [],
            tags: [],
            tagSuggestions: [],
            selectedChoiceFilter: {},
            selectedLocationFilter: {},
            selectedDoubleChoiceFilter: {},
            selectedTagFilter: {}
        }
    }

    render() {
        Object.keys(this.defaultFilters).forEach(key => this.defaultFilters[key].key = key);
        let content = '';
        if (this.state.selectFilter) {
            content = <div className="select-filter">
                <div className="title">Selecciona un filtro</div>
                {this.renderFiltersList()}
            </div>;
        } else {
            content = <div className="users-filters-wrapper">
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
        }

        return (
            content
        );
    }

    handleClickAddFilter() {
        this.setState({
            selectFilter: true
        })
    }

    renderFiltersList() {
        const choicesLength = Object.keys(this.defaultFilters).length || 0;
        let firstColumnCounter = 0;
        let secondColumnCounter = 0;
        return(
            <div className="list-block">
                <ul className="checkbox-filters-list">
                    {Object.keys(this.defaultFilters).map((id) => {
                        firstColumnCounter++;
                        if (firstColumnCounter > choicesLength / 2) {
                            return '';
                        }
                        let text = this.defaultFilters[id].label;
                        let checked = this.state.filters.some(filter => filter.key === this.defaultFilters[id].key);
                        return (
                            <li key={id}>
                                <InputCheckbox value={this.defaultFilters[id].key} name={this.defaultFilters[id].key} text={text}
                                               checked={checked} defaultChecked={false} onClickHandler={this.handleClickFilterOnList} reverse={true}/>
                            </li>
                        )
                    })}
                </ul>
                <ul className="checkbox-filters-list">
                    {Object.keys(this.defaultFilters).map((id) => {
                        secondColumnCounter++;
                        if (secondColumnCounter <= choicesLength / 2) {
                            return '';
                        }
                        let text = this.defaultFilters[id].label;
                        let checked = this.state.filters.some(filter => filter.key === this.defaultFilters[id].key);
                        return (
                            <li key={id}>
                                <InputCheckbox value={id} name={this.defaultFilters[id].key} text={text} checked={checked} defaultChecked={false} onClickHandler={this.handleClickFilterOnList} reverse={true}/>
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
            let defaultFilters = JSON.parse(JSON.stringify(this.defaultFilters));
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
                case 'location':
                    selectedFilterContent = this.renderLocationFilter();
                    break;
                case 'integer':
                    selectedFilterContent = this.renderIntegerFilter();
                    break;
                case 'choice':
                    selectedFilterContent = this.renderChoiceFilter();
                    break;
                case 'double_choice':
                    selectedFilterContent = this.renderDoubleChoiceFilter();
                    break;
                case 'tags':
                    selectedFilterContent = this.renderTagFilter();
            }
        }
        let locationFilter = filters.find(filter => filter.type === 'location');
        let choicesFilter = filters.filter(filter => filter.type === 'choice');
        let doubleChoicesFilter = filters.filter(filter => filter.type === 'double_choice');
        let tagsFilter = filters.filter(filter => filter.type === 'tags');
        let filterCheckboxes = [];
        if (locationFilter) {
            let address = locationFilter.value ? locationFilter.value.address : '';
            filterCheckboxes.push({
                label: {key: 'location', text: address ? locationFilter.label + ' - ' + address : locationFilter.label},
                value: 'location',
                selected: this.state.selectedFilter && this.state.selectedFilter.key === 'location'
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
                                        onClickHandler={this.handleClickFilter.bind(this, filterCheckbox.label.key)} values={filters.map(filter => {return filter.value || filter.choice || filter.values ? filter.key : null})} />
                        <div className="table-row"></div>
                    </div>
            )
        );
    }

    renderLocationFilter() {
        return (
            <div className="thread-filter tag-filter location-tag-filter">
                <div className="users-middle-vertical-line"></div>
                {this.renderSelectedFilterBackground()}
                <div className="thread-filter-dot">
                    <span className="icon-plus active"></span>
                </div>
                <div className="list-block">
                    <div className="location-title">Ubicación</div>
                    <LocationInput placeholder={'Escribe una ubicación'} onSuggestSelect={this.handleClickLocationSuggestion}/>
                </div>
                {this.renderSelectedFilterOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderIntegerFilter() {
        return(
            ''
        );
    }

    renderChoiceFilter() {
        return (
            <div className="thread-filter radio-filter">
                <div className="users-middle-vertical-line"></div>
                {this.renderSelectedFilterBackground()}
                <div className="thread-filter-dot">
                    <span className={this.state.selectedFilter.choice ? "icon-circle active" : "icon-circle"}></span>
                </div>
                <TextRadios labels={this.state.selectedFilter.choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                            onClickHandler={this.handleClickChoice} value={this.state.selectedFilter.choice} className={'choice-filter'}
                            title={this.state.selectedFilter.label} />
                {this.renderSelectedFilterOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderDoubleChoiceFilter() {
        return (
          <div className="thread-filter radio-filter">
              <div className="users-middle-vertical-line"></div>
              {this.renderSelectedFilterBackground()}
              <div className="thread-filter-dot">
                  <span className={this.state.selectedFilter.choice ? "icon-circle active" : "icon-circle"}></span>
              </div>
              <div className="double-choice-filter">
                  <TextRadios labels={Object.keys(this.state.selectedFilter.choices).map(choice => { return({key: choice, text: this.state.selectedFilter.choices[choice]}); }) }
                              onClickHandler={this.handleClickDoubleChoiceChoice} value={this.state.selectedFilter.choice} className={'double-choice-choice'}
                              title={this.state.selectedFilter.label} />
                  {this.state.selectedFilter.choice ?
                      <TextRadios labels={Object.keys(this.state.selectedFilter.doubleChoices[this.state.selectedFilter.choice]).map(doubleChoice => { return({key: doubleChoice, text: this.state.selectedFilter.doubleChoices[this.state.selectedFilter.choice][doubleChoice]}); }) }
                              onClickHandler={this.handleClickDoubleChoiceDetail} value={this.state.selectedFilter.detail} className={'double-choice-detail'}/>
                      : ''}
              </div>
              {this.renderSelectedFilterOppositeBackground()}
              <div className="table-row"></div>
          </div>
        );
    }

    renderTagFilter() {
        return (
            <div className="thread-filter tag-filter">
                <div className="users-middle-vertical-line"></div>
                {this.renderSelectedFilterBackground()}
                <div className="thread-filter-dot">
                    <span className="icon-plus active"></span>
                </div>
                {/* TODO: tagSuggestions should be set from props instead of state */}
                <TagInput placeholder={'Escribe un tag'} tags={this.state.tagSuggestions}
                          onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}/>
                {this.renderSelectedFilterOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderSelectedFilterBackground() {
        return (
            <div className="thread-filter-background">
                <div className="thread-filter-remove" onClick={this.handleClickRemoveFilter}>
                    <span className="icon-delete"></span>
                </div>
            </div>
        );
    }

    renderSelectedFilterOppositeBackground = function() {
        return (
            <div className="thread-filter-opposite-background"></div>
        );
    };

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
        if (index !== -1) {
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

    handleKeyUpTag(tag) {
        if (tag.length > 2) {
            // TODO: Call get tags action and save in store
            // TODO: Replace this example setting the tagSuggestions in getState method as props
            console.log(tag);
            this.setState({
                tagSuggestions: [tag + '1', tag + '2', tag + '3']
            });
            /*window.setTimeout(function () {
                document.getElementsByClassName('view')[0].scrollTop = document.getElementsByClassName('view')[0].scrollHeight;
            }, 500);*/
        } else if (this.state.tags.length > 0) {
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

    createThread() {
        let data = {
            name: document.querySelector('.list-block input').value,
            filters: {profileFilters: {}, userFilters: {}},
            category: 'ThreadUsers'
        };

        let stateFilters = this.state.filters;

        for (let stateFilter of stateFilters) {
            //read from metadata
            let box = 'profileFilters';
            switch (stateFilter.type) {
                case 'choice':
                    data.filters[box][stateFilter.key] = stateFilter.choice;
                    break;
                case 'location':
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
}
