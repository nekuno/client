import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Frame from '../Frame/';
import styles from './FrameCollapsible.scss';
import IconCollapsible from "../IconCollapsible";

export default class FrameCollapsible extends Component {

    static propTypes = {
        title         : PropTypes.string,
        onToggle : PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            open: false
        };
    }

    handleClick() {
        const {open} = this.state;

        this.setState({open: !open});

        this.props.onToggle();
    }

    render() {
        const {title, children} = this.props;
        const {open} = this.state;

        return (
            <Frame>
                <div className={styles.frameCollapsible}>
                    <div className={styles.frameTop} onClick={this.handleClick}>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <div className={styles.arrow}>
                            <IconCollapsible open={open}/>
                        </div>
                    </div>
                    <div className={styles.content} style={{display: open ? 'block' : 'none'}}>
                        {children}
                    </div>
                </div>
            </Frame>
        );
    }
}

FrameCollapsible.defaultProps = {
    onToggle: () => {},
};