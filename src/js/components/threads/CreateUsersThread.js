import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import TextRadios from '../ui/TextRadios';
import TextCheckboxes from '../ui/TextCheckboxes';
import TagInput from '../ui/TagInput';
import FullWidthButton from '../ui/FullWidthButton';
import Geosuggest from 'react-geosuggest';

export default class CreateUsersThread extends Component {
    static propTypes = {
        userId: PropTypes.number.isRequired
        // TODO: defFilters should be a prop
    };
    
    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickLocationFilter = this.handleClickLocationFilter.bind(this);
        this.handleClickChoiceFilter = this.handleClickChoiceFilter.bind(this);
        this.handleClickDoubleChoiceFilter = this.handleClickDoubleChoiceFilter.bind(this);
        this.handleClickDoubleChoiceChoice = this.handleClickDoubleChoiceChoice.bind(this);
        this.handleClickDoubleChoiceDetail = this.handleClickDoubleChoiceDetail.bind(this);
        this.handleClickTagFilter = this.handleClickTagFilter.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);
        this.renderLocationInput = this.renderLocationInput.bind(this);
        this.createThread = this.createThread.bind(this);


        this.defaultFilters = [
            {
                type: 'choice',
                label: 'Orientación sexual',
                value: 'orientation',
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
            {
                type: 'choice',
                label: 'Estado civil',
                value: 'civilStatus',
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
            {
                type: 'choice',
                label: 'Complexión',
                value: 'complexion',
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
            {
                type: 'location',
                label: 'Ubicación'
            },
            {
                type: 'double_choice',
                label: 'Hijos',
                value: 'sons',
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
            {
                type: 'double_choice',
                label: 'Hijos (ejemplo 2)',
                value: 'sonss',
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
            {
                type: 'tag',
                label: 'Alergia',
                value: 'allergy'
            },
            {
                type: 'tag',
                label: 'Educación',
                value: 'education'
            }
        ];

        this.state = {
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
        let defaultFilters = JSON.parse(JSON.stringify(this.defaultFilters));
        let locationFilter = defaultFilters.filter(defaultFilter => defaultFilter.type === 'location');
        let choiceFilters = defaultFilters.filter(defaultFilter => defaultFilter.type === 'choice');
        let doubleChoiceFilters = defaultFilters.filter(defaultFilter => defaultFilter.type === 'double_choice');
        let tagFilters = defaultFilters.filter(defaultFilter => defaultFilter.type === 'tag');
        let tags = this.state.tags.filter(tag => tag.value === this.state.selectedTagFilter.value && tag.tagString);

        return (
            <div>
                <div className="thread-filter location-filter">
                    <div className="thread-filter-dot">
                        <span className={locationFilter.value ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextCheckboxes labels={locationFilter.map(filter => {return {key: 'location', text: this.state.selectedLocationFilter.value && this.state.selectedLocationFilter.value.address ? filter.label + ' - ' + this.state.selectedLocationFilter.value.address.slice(0, 32) : filter.label}})}
                                    onClickHandler={this.handleClickLocationFilter} values={this.state.selectedLocationFilter.value && this.state.selectedLocationFilter.value.address ? ['location'] : []} />
                    <div className="vertical-line"></div>
                </div>
                {this.state.selectedLocationFilter.label ? this.renderLocationInput() : ''}
                <div className="thread-filter">
                    <div className="thread-filter-dot">
                        <span className={this.state.selectedChoiceFilter.value ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextCheckboxes labels={choiceFilters.map(filter => {return {key: filter.value, text: filter.label}})}
                                    onClickHandler={this.handleClickChoiceFilter} values={this.state.filters.map(filter => filter.value)} />
                    <div className="vertical-line"></div>
                </div>
                {this.state.selectedChoiceFilter.choices ?
                    <div className="thread-filter">
                        <div className="thread-filter-dot">
                            <span className={this.state.selectedChoiceFilter.choice ? "icon-circle active" : "icon-circle"}></span>
                        </div>
                        <TextRadios labels={this.state.selectedChoiceFilter.choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                                        onClickHandler={this.handleClickChoice} value={this.state.selectedChoiceFilter.choice}/>
                        <div className="vertical-line"></div>
                    </div>
                    : ''}
                <div className="thread-filter">
                    <div className="thread-filter-dot">
                        <span className={this.state.selectedDoubleChoiceFilter.value ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextCheckboxes labels={doubleChoiceFilters.map(filter => {return {key: filter.value, text: filter.label}})}
                                    onClickHandler={this.handleClickDoubleChoiceFilter} values={this.state.filters.map(filter => filter.value)} />
                    <div className="vertical-line"></div>
                </div>
                {this.state.selectedDoubleChoiceFilter.choices ?
                    <div className="thread-filter double-choice-filter">
                        <div className="thread-filter-dot">
                            <span className={this.state.selectedDoubleChoiceFilter.choice ? "icon-circle active" : "icon-circle"}></span>
                        </div>
                        <TextRadios labels={Object.keys(this.state.selectedDoubleChoiceFilter.choices).map(choice => { return({key: choice, text: this.state.selectedDoubleChoiceFilter.choices[choice]}); }) }
                                    onClickHandler={this.handleClickDoubleChoiceChoice} value={this.state.selectedDoubleChoiceFilter.choice} className={'double-choice-choice'}/>
                        <div className="vertical-line"></div>

                        {this.state.selectedDoubleChoiceFilter.choice ?
                            <div className="thread-filter-dot">
                                <span className={this.state.selectedDoubleChoiceFilter.detail ? "icon-circle active" : "icon-circle"}></span>
                            </div>
                            : ''
                        }
                        {this.state.selectedDoubleChoiceFilter.choice ?
                            <TextRadios labels={Object.keys(this.state.selectedDoubleChoiceFilter.doubleChoices[this.state.selectedDoubleChoiceFilter.choice]).map(doubleChoice => { return({key: doubleChoice, text: this.state.selectedDoubleChoiceFilter.doubleChoices[this.state.selectedDoubleChoiceFilter.choice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleChoiceDetail} value={this.state.selectedDoubleChoiceFilter.detail} className={'double-choice-detail'}/>
                            : ''
                        }
                        {this.state.selectedDoubleChoiceFilter.choice ?
                            <div className="vertical-line"></div> : ''
                        }

                    </div>
                    : ''}
                <div className="thread-filter">
                    <div className="thread-filter-dot">
                        <span className={this.state.selectedTagFilter.value ? "icon-circle active" : "icon-circle"}></span>
                    </div>
                    <TextCheckboxes labels={tagFilters.map(filter => {return {key: filter.value, text: filter.label}})}
                                    onClickHandler={this.handleClickTagFilter} values={this.state.tags.map(tag => tag.value)} />
                    {this.state.selectedTagFilter.value ? <div className="vertical-line"></div> : ''}
                </div>
                {tags.length > 0 ?
                    <div className="thread-filter">
                        <div className="thread-filter-dot">
                            <span className={tags.length > 0 ? "icon-circle active" : "icon-circle"}></span>
                        </div>
                        <TextCheckboxes labels={tags.map(tag => { return({key: tag.tagString, text: tag.tagString}) })} onClickHandler={this.handleClickTag} values={this.state.tags.map(tag => tag.tagString)} />
                        <div className="vertical-line"></div>
                    </div>
                    : ''}
                {this.state.selectedTagFilter.value ? this.renderTagInput() : ''}
                <br />
                <br />
                <br />
                <br />
                <br />
                <FullWidthButton onClick={this.createThread}>Crear hilo</FullWidthButton>
                <br />
                <br />
                <br />
            </div>
        );
    }

    handleClickLocationFilter(type) {
        let filters = this.state.filters;
        let filter = filters.find(function (filter) {
            return filter.type === 'location';
        });
        let index = filters.findIndex(savedFilter => savedFilter.type === 'location');
        if (typeof filter == 'undefined') {
            let defaultFilters = JSON.parse(JSON.stringify(this.defaultFilters));
            filter = defaultFilters.find(function (filter) {
                return filter.type === 'location';
            });
        } else {
            filter = {};
            filters.splice(index, 1);
        }

        filters.push(filter);
        this.setState({
            selectedLocationFilter: filter,
            filters: filters
        });
    }

    renderLocationInput() {
        var _self = this;
        return (
            <div className="thread-filter tag-filter location-tag-filter">
                <div className="thread-filter-dot">
                    <span className="icon-plus active"></span>
                </div>
                <div className="tag-input-wrapper">
                    <Geosuggest className="tag-input-wrapper" placeholder={'Escribe una ubicación'} onSuggestSelect={function(suggest) { _self.handleClickLocationSuggestion.bind(_self, suggest)() }}
                                wrapInput={true} wrapSuggestionList={true} inputWrapperClassName={'tag-input'} suggestionListWrapperClassName={'suggestion-list-wrapper'}
                                getSuggestLabel={function(suggest) { return suggest.description.length > 15 ? suggest.description.slice(0, 15) + '...' : suggest.description }}
                    />
                </div>
                <div className="vertical-line"></div>
            </div>
        );
    }

    handleClickLocationSuggestion(suggest) {
        let filters = this.state.filters;
        let filter = JSON.parse(JSON.stringify(this.state.selectedLocationFilter));
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
        this.setState({
            filters: filters,
            selectedLocationFilter: filter
        });
    }

    renderTagInput() {
        return (
            <div className="thread-filter tag-filter">
                <div className="thread-filter-dot">
                    <span className="icon-plus active"></span>
                </div>
                {/* TODO: tagSuggestions should be set from props instead of state */}
                <TagInput placeholder={'Escribe un tag'} tags={this.state.tagSuggestions}
                          onKeyUpHandler={this.handleKeyUpTag} onClickTagHandler={this.handleClickTagSuggestion}/>
            </div>
        );
    }

    handleClickChoiceFilter(type) {
        let filter = this.state.filters.find(function (filter) {
           return filter.value === type;
        });
        if (typeof filter == 'undefined') {
            let defaultFilters = JSON.parse(JSON.stringify(this.defaultFilters));
            filter = defaultFilters.find(function (filter) {
                return filter.value === type;
            });
        }

        this.setState({
            selectedChoiceFilter: filter
        });
    }

    handleClickChoice(choice) {
        let filters = this.state.filters;
        let filter = this.state.selectedChoiceFilter;
        let index = filters.findIndex(savedFilter => savedFilter.choice === filter.choice);
        let selectedChoiceFilter = {};
        if (index > -1) {
            if (choice === filter.choice) {
                filters.splice(index, 1);

            } else {
                filter.choice = choice;
                filters[index] = filter;
                selectedChoiceFilter = filter;
            }
        } else {
            filter.choice = choice;
            filters.push(filter);
            selectedChoiceFilter = filter;
        }
        this.setState({
            filters: filters,
            selectedChoiceFilter: selectedChoiceFilter
        });
    }

    handleClickDoubleChoiceFilter(type) {
        let filter = this.state.filters.find(function (filter) {
            return filter.value === type;
        });
        if (typeof filter == 'undefined') {
            let defaultFilters = JSON.parse(JSON.stringify(this.defaultFilters));
            filter = defaultFilters.find(function (filter) {
                return filter.value === type;
            });
        }

        this.setState({
            selectedDoubleChoiceFilter: filter
        });
    }

    handleClickDoubleChoiceChoice(choice) {
        let filters = this.state.filters;
        let filter = this.state.selectedDoubleChoiceFilter;
        let index = filters.findIndex(savedFilter => savedFilter.choice === filter.choice);
        let selectedDoubleChoiceFilter = {};
        if (index > -1) {
            if (choice === filter.choice) {
                filters.splice(index, 1);

            } else {
                filter.choice = choice;
                filters[index] = filter;
                selectedDoubleChoiceFilter = filter;
            }
        } else {
            filter.choice = choice;
            filters.push(filter);
            selectedDoubleChoiceFilter = filter;
        }
        this.setState({
            filters: filters,
            selectedDoubleChoiceFilter: selectedDoubleChoiceFilter
        });
    }

    handleClickDoubleChoiceDetail(detail) {
        let filters = this.state.filters;
        let filter = this.state.selectedDoubleChoiceFilter;
        let index = filters.findIndex(savedFilter => savedFilter.detail === filter.detail);
        let selectedDoubleChoiceFilter = {};
        if (index > -1) {
            if (detail === filter.detail) {
                filters.splice(index, 1);

            } else {
                filter.detail = detail;
                filters[index] = filter;
                selectedDoubleChoiceFilter = filter;
            }
        } else {
            filter.detail = detail;
            filters.push(filter);
            selectedDoubleChoiceFilter = filter;
        }
        this.setState({
            filters: filters,
            selectedDoubleChoiceFilter: selectedDoubleChoiceFilter
        });
    }

    handleClickTagFilter(type) {
        let tag = this.state.tags.find(function (tag) {
            return tag.value === type;
        });
        if (typeof tag == 'undefined') {
            let defaultFilters = JSON.parse(JSON.stringify(this.defaultFilters));
            tag = defaultFilters.find(function (tag) {
                return tag.value === type;
            });
        }

        this.setState({
            selectedTagFilter: tag,
            tagSuggestions: []
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
            window.setTimeout(function () {
                document.getElementsByClassName('view')[0].scrollTop = document.getElementsByClassName('view')[0].scrollHeight;
            }, 500);
        } else if (this.state.tags.length > 0) {
            this.setState({
                tagSuggestions: []
            });
        }
    }

    handleClickTagSuggestion(tagString) {
        let tags = this.state.tags;
        let tag = JSON.parse(JSON.stringify(this.state.selectedTagFilter));
        let index = tags.findIndex(savedTag => (savedTag.value === tag.value && savedTag.tagString === tagString));
        if (index == -1) {
            tag.tagString = tagString;
            tags.push(tag);
            this.setState({
                tags: tags,
                tagSuggestions: []
            });
        }
    }

    handleClickTag(tagString) {
        let tags = this.state.tags;
        let index = tags.findIndex(savedTag => savedTag.tagString === tagString);
        if (index > -1) {
            tags.splice(index, 1);
            this.setState({
                tags: tags
            });
        }
    }

    createThread() {
        let data = {
            name: document.querySelector('.list-block input').value,
            filters: {},
            category: 'ThreadUsers'
        };

        if (this.state.filters.length > 0){
            data.filters = this.state.filters;
        }
        if (this.state.tags.length > 0){
            data.tags = this.state.tags;
        }

        UserActionCreators.createThread(this.props.userId, data);
    }
}
