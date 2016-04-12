import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import TextRadios from '../ui/TextRadios';
import TextCheckboxes from '../ui/TextCheckboxes';
import InputCheckbox from '../ui/InputCheckbox';
import TagInput from '../ui/TagInput';
import FullWidthButton from '../ui/FullWidthButton';

export default class CreateContentThread extends Component {
    static propTypes = {
        userId: PropTypes.number.isRequired,
        filters: PropTypes.object.isRequired
        // TODO: tagSuggestions should be a prop
    };

    constructor(props) {
        super(props);

        this.handleClickAddFilter = this.handleClickAddFilter.bind(this);
        this.renderFiltersList = this.renderFiltersList.bind(this);
        this.handleClickFilterOnList = this.handleClickFilterOnList.bind(this);
        this.renderActiveFilters = this.renderActiveFilters.bind(this);
        this.renderMultipleChoicesFilter = this.renderMultipleChoicesFilter.bind(this);
        this.renderTagFilter = this.renderTagFilter.bind(this);
        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickFilter = this.handleClickFilter.bind(this);
        this.handleClickRemoveFilter = this.handleClickRemoveFilter.bind(this);
        this.createThread = this.createThread.bind(this);

        this.state = {
            selectFilter: false,
            selectedFilter: {},
            filters: [],
            tagSuggestions: []
        }
    }

    render() {
        Object.keys(this.props.filters).forEach(key => this.props.filters[key].key = key);
        let content = '';
        if (this.state.selectFilter) {
            content = <div className="select-filter">
                <div className="title">Selecciona un filtro</div>
                {this.renderFiltersList()}
            </div>;
        } else {
            content = <div className="content-filters-wrapper">
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
            </div>;
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
        return(
            <div className="list-block">
                <ul className="checkbox-filters-list">
                    {Object.keys(this.props.filters).map((id) => {
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
        let filters = this.state.filters || [];
        let selectedFilterContent = '';
        if (this.state.selectedFilter.key) {
            let isSelectedFilterActive = filters.some(filter => filter.key === this.state.selectedFilter.key);
            if (!isSelectedFilterActive) {
                filters.push(this.state.selectedFilter);
            }
            switch (this.state.selectedFilter.type) {
                case 'multiple_choices':
                    selectedFilterContent = this.renderMultipleChoicesFilter();
                    break;
                case 'tags':
                    selectedFilterContent = this.renderTagFilter();
                    break;
            }
        }
        let multipleChoicesFilter = filters.filter(filter => filter.type === 'multiple_choices');
        let tagsFilter = filters.filter(filter => filter.type === 'tags');
        let filterCheckboxes = [];

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

        return (
            filterCheckboxes.map((filterCheckbox, index) =>
                filterCheckbox.selected ?
                    selectedFilterContent :
                    <div key={index} className="thread-filter">
                        <div className="content-middle-vertical-line"></div>
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

    renderMultipleChoicesFilter() {
        return (
            <div className="thread-filter checkbox-filter">
                <div className="content-middle-vertical-line"></div>
                {this.renderSelectedFilterBackground()}
                <div className="thread-filter-dot">
                    <span className={this.state.selectedFilter.values && this.state.selectedFilter.values.length > 0 ? "icon-circle active" : "icon-circle"}></span>
                </div>
                <TextCheckboxes labels={Object.keys(this.state.selectedFilter.choices).map(key => { return({key: key, text: this.state.selectedFilter.choices[key]}) })}
                            onClickHandler={this.handleClickMultipleChoice} values={this.state.selectedFilter.values || []} className={'multiple-choice-filter'}
                            title={this.state.selectedFilter.label} />
                {this.renderSelectedFilterOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderTagFilter() {
        return (
            <div className="thread-filter tag-filter">
                <div className="content-middle-vertical-line"></div>
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

    handleClickMultipleChoice(choice) {
        let filters = this.state.filters;
        let filter = this.state.selectedFilter;
        let index = filters.findIndex(savedFilter => savedFilter.key === filter.key);
        filter.values = filter.values || [];
        if (index > -1) {
            if (!filter.values.some(value => value === choice)) {
                filter.values.push(choice);
            } else {
                filter.values.splice(choice, 1);
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

    handleKeyUpTag(tag = '') {
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

    renderSelectedFilterBackground() {
        return (
            <div className="thread-filter-background">
                <div className="thread-filter-remove" onClick={this.handleClickRemoveFilter}>
                    <span className="icon-delete"></span>
                </div>
            </div>
        );
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

    createThread() {
        let data = {
            name: document.querySelector('.list-block input').value,
            filters: {},
            category: 'ThreadContent'
        };

        if (this.state.filters.length > 0){
            data.filters = this.state.filters;
        }

        UserActionCreators.createThread(this.props.userId, data);
    }
}
