import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputCheckbox from '../../ui/InputCheckbox';
import IntegerRangeFilter from "./IntegerRangeFilter";

export default class ThreadCategoryFilterList extends Component {

    static propTypes = {
        categories             : PropTypes.array,
        filters                : PropTypes.object.isRequired,
        filtersMetadata        : PropTypes.object.isRequired,
        handleClickFilterOnList: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.renderCategory = this.renderCategory.bind(this);
        this.renderField = this.renderField.bind(this);
        this.handleClickFilterOnList = this.handleClickFilterOnList.bind(this);
    }

    handleClickFilterOnList(checked, value)
    {
        if(checked)
        {
            document.getElementsByClassName('view')[0].scrollTop = 0;
        }

        this.props.handleClickFilterOnList(checked, value);
    }

    renderField(field) {
        const {filters, filtersMetadata} = this.props;
        if (!filtersMetadata[field]) {
            return null;
        }
        let text = filtersMetadata[field].label;
        let checked = typeof filters[field] !== 'undefined';
        return <li key={field}>
            <InputCheckbox value={field} text={text} checked={checked} onClickHandler={this.handleClickFilterOnList} reverse={true}  />
        </li>;
    }

    renderCategory(category) {
        const {filtersMetadata} = this.props;
        // TODO: Don't filter to show tags (just use category.fields)
        const filteredCategoryFields = category.fields.filter(field => filtersMetadata[field] && filtersMetadata[field].type !== 'tags');
        const choicesLength = filteredCategoryFields.length || 0;
        return <ul key="1" className="checkbox-filters-list">
                { filteredCategoryFields.map(field => this.renderField(field)) }
            </ul>;
    }

    render() {
        const {categories} = this.props;

        return (
            <div className="list-block">
                {categories.map(category => {
                    return <div key={category.label}>
                        <div className="profile-category"><h3>{category.label}</h3></div>
                        {this.renderCategory(category)}
                    </div>;
                })}
            </div>
        );
    }
}