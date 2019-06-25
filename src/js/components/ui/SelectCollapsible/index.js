import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SelectCollapsible.scss';
import translate from "../../../i18n/Translate";
import AvailabilityEdit from "../../Availability/AvailabilityEdit/";

@translate('SelectCollapsible')
export default class SelectCollapsible extends Component {

    static propTypes = {
        options       : PropTypes.array.isRequired,
        selected      : PropTypes.string.isRequired,
        title         : PropTypes.string,
        onClickSelectCollapsible: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleClickToggle = this.handleClickToggle.bind(this);
        this.handleClickItem = this.handleClickItem.bind(this);

        this.state = {
            open: false,
            selected: props.selected
        };
    }

    handleClickToggle() {
        const {open} = this.state;

        this.setState({open: !open})
    }

    handleClickItem(id) {
        this.setState({
            open: false,
            selected: id,
        });

        this.props.onClickSelectCollapsible(id);
    }

    search(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].id === nameKey) {
                return myArray[i];
            }
        }
    }

    render() {
        const {strings, options, title} = this.props;
        const {open, selected} = this.state;

        const orderStrings = {
            work        : strings.work,
            shows       : strings.shows,
            restaurants : strings.shows,
            plans       : strings.shows,
            sports      : strings.sports,
            hobbies     : strings.sports,
            games       : strings.sports,
        };

        return (
            <div className={styles.selectCollapsible} onClick={this.handleClickToggle}>
                <div className={styles.title + ' small'}>
                    {strings.orderBy} {this.search(selected, options).text}
                </div>
                {open ?
                    <div className={styles.arrow + ' icon icon-chevron-up'}/>
                    :
                    <div className={styles.arrow + ' icon icon-chevron-down'}/>
                }
                {open ?
                    <div className={styles.collapsible}>
                        {options.map((option, index) => {
                            return option.id === selected ?
                                <div key={index} className={styles.option + ' ' + styles.optionSelected}>
                                    {option.text}
                                </div>
                                :
                                <div key={index} className={styles.option} onClick={this.handleClickItem.bind(this, option.id)}>
                                    {option.text}
                                </div>
                        })}
                    </div>
                    : null}
            </div>
        );
    }
}

SelectCollapsible.defaultProps = {
    strings: {
        orderBy     : 'Order by',
    }
};