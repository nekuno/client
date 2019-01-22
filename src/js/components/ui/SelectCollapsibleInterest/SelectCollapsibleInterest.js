import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SelectCollapsibleInterest.scss';
import translate from "../../../i18n/Translate";
import ContentTypeIcon from "../ContentTypeIcon/ContentTypeIcon";

@translate('SelectCollapsibleInterest')
export default class SelectCollapsibleInterest extends Component {

    static propTypes = {
        selected                : PropTypes.string,
        title                   : PropTypes.string,
        onClickSelectCollapsible: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleClickToggle = this.handleClickToggle.bind(this);
        this.handleClickItem = this.handleClickItem.bind(this);
        this.buildOptions = this.buildOptions.bind(this);

        this.state = {
            open    : false,
            selected: props.selected
        };
    }

    handleClickToggle() {
        const {open} = this.state;

        this.setState({open: !open})
    }

    handleClickItem(id) {
        this.setState({
            open    : false,
            selected: id,
        });

        this.props.onClickSelectCollapsible(id);
    }

    search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].id === nameKey) {
                return myArray[i];
            }
        }
    }

    buildOptions() {
        const {strings} = this.props;
        return ['audio', 'video', 'image', 'creator', 'game'].map((type) => {
                return {'text': strings[type], 'type': type, 'typeUcFirst': type.charAt(0).toUpperCase() + type.slice(1)}
            }
        )
    }

    render() {
        const {strings} = this.props;
        const {open, selected} = this.state;
        const options = this.buildOptions();

        return (
            <div className={styles.selectCollapsible} onClick={this.handleClickToggle}>
                <div className={styles.title + ' small'}>
                    {strings.orderBy} {strings[selected]}
                </div>
                {open ?
                    <div className={styles.arrow + ' icon icon-chevron-up'}/>
                    :
                    <div className={styles.arrow + ' icon icon-chevron-down'}/>
                }
                {open ?
                    <div className={styles.collapsible}>
                        {options.map((option) => {
                            return option.type === selected ?
                                <div key={option.type} className={styles.option + ' ' + styles.optionSelected} onClick={this.handleClickItem.bind(this, option.type)}>
                                    <ContentTypeIcon type={option.typeUcFirst} background='#756EE5'/>
                                </div>
                                :
                                <div key={option.type} className={styles.option + ' ' +styles.optionUnselected} onClick={this.handleClickItem.bind(this, option.type)}>
                                    <ContentTypeIcon type={option.typeUcFirst} background='#756EE5'/>
                                </div>
                        })}
                    </div>
                    : null}
            </div>
        );
    }
}

SelectCollapsibleInterest.defaultProps = {
    strings: {
        orderBy: 'Order by',
    },
};