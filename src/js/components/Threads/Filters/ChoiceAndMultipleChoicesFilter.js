import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectMultiple from '../../ui/SelectMultiple/SelectMultiple.js';
import SelectInline from '../../ui/SelectInline/SelectInline.js';

export default class ChoiceAndMultipleChoicesFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.object,
        handleChangeFilter: PropTypes.func.isRequired,
        color            : PropTypes.string,
    };
    
    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickDetail = this.handleClickDetail.bind(this);
        
        this.state = {
            selectedChoice: props.data && props.data.choice ? props.data.choice : null
        };
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        data.choice = choice[0];
        data.details = [];
        this.setState({selectedChoice: choice[0]});

        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickDetail(detail) {
        let {filterKey, data} = this.props;
        data.details = data.details || [];

        const detailIndex = data.details.findIndex(value => value === detail);
        if (detailIndex !== -1) {
            data.details.splice(detailIndex, 1);
        } else {
            data.details.push(detail);
        }

        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        const {filter, data, color} = this.props;
        const {selectedChoice} = this.state;

        const dataChoice = data !== null ? data.choice : null;

        return(
            <div>
                <SelectInline color={color} title={filter.label} options={filter.choices} defaultOption={dataChoice} onClickHandler={this.handleClickChoice}/>
                <br/>
                {selectedChoice ?
                    <SelectMultiple color={color} labels={data.choice ? Object.keys(filter.doubleChoices[data.choice]).map(doubleChoice => { return({id: doubleChoice, text: filter.doubleChoices[data.choice][doubleChoice]}); }) : []} onClickHandler={this.handleClickDetail} values={data.details || []} />
                    : ''}
            </div>
        );
    }
}