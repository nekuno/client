import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextInput from '../ui/TextInput';
import TextRadios from '../ui/TextRadios';
import TextCheckboxes from '../ui/TextCheckboxes';
import TagInput from '../ui/TagInput';
import FullWidthButton from '../ui/FullWidthButton';

export default class CreateUsersThread extends Component {
    static propTypes = {
        userId: PropTypes.number.isRequired
        // TODO: defFilters should be a prop
    };
    
    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickChoiceFilter = this.handleClickChoiceFilter.bind(this);
        this.handleClickTagFilter = this.handleClickTagFilter.bind(this);
        this.handleKeyUpTag = this.handleKeyUpTag.bind(this);
        this.handleClickTagSuggestion = this.handleClickTagSuggestion.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);
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
            selectedTagFilter: {}
        }
    }

    render() {
        let defaultFilters = JSON.parse(JSON.stringify(this.defaultFilters));
        let choiceFilters = defaultFilters.filter(defaultFilter => defaultFilter.type === 'choice');
        let tagFilters = defaultFilters.filter(defaultFilter => defaultFilter.type === 'tag');
        let tags = this.state.tags.filter(tag => tag.value === this.state.selectedTagFilter.value && tag.tagString);

        return (
            <div>
                <div className="thread-filter">
                    <div className="thread-filter-dot">
                        <span className="icon-circle active"></span>
                    </div>
                    <TextCheckboxes labels={choiceFilters.map(filter => {return {key: filter.value, text: filter.label}})}
                                    onClickHandler={this.handleClickChoiceFilter} values={this.state.filters.map(filter => filter.value)} />
                    <div className="vertical-line"></div>
                </div>
                {this.state.selectedChoiceFilter.choices ?
                    <div className="thread-filter">
                        <div className="thread-filter-dot">
                            <span className={this.state.filters.tags > 0 ? "icon-circle active" : "icon-circle"}></span>
                        </div>
                        <TextRadios labels={this.state.selectedChoiceFilter.choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                                        onClickHandler={this.handleClickChoice} value={this.state.selectedChoiceFilter.choice}/>
                        <div className="vertical-line"></div>
                    </div>
                    : ''}
                <div className="thread-filter">
                    <div className="thread-filter-dot">
                        <span className={tagFilters.length > 0 ? "icon-circle active" : "icon-circle"}></span>
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
