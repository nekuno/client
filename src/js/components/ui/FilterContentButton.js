import React, { PropTypes, Component } from 'react';
import LoadingSpinnerCSS from './LoadingSpinnerCSS'

export default class FilterContentButton extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func,
        text          : PropTypes.string.isRequired,
        icon          : PropTypes.string.isRequired,
        active        : PropTypes.bool,
        count         : PropTypes.number,
        loading       : PropTypes.bool,
    };

    render() {
        const {text, active, onClickHandler, count, loading} = this.props;
        const iconClass = " icon icon-" + this.props.icon;

        return (
            loading && active ? <div className="spinner-wrapper"><LoadingSpinnerCSS small={true}/></div> :
            <div className={active ? "icons-large-wrapper active" : "icons-large-wrapper"} onClick={onClickHandler}>
                <div className={iconClass}></div>
                <div className="icons-large-text">{count}<br/>{text}</div>
            </div>
        );
    }
}

FilterContentButton.defaultProps = {
    onClickHandler: () => {
    },
    active        : false,
    count         : 0,
    loading       : false
};