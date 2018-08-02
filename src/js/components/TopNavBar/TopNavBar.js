import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './TopNavBar.scss';
import TopBar from '../ui/TopBar/TopBar.js';
import IconNotification from '../ui/IconNotification/IconNotification.js';
import RoundedIcon from '../ui/RoundedIcon/RoundedIcon.js';
import RoundedImage from '../ui/RoundedImage/RoundedImage.js';
import LeftPanelActionCreators from '../../actions/LeftPanelActionCreators';

export default class TopNavBar extends Component {

    static propTypes = {
        menuIconLeft                 : PropTypes.bool,
        iconLeft                     : PropTypes.string,
        textLeft                     : PropTypes.string,
        textLeftColored              : PropTypes.bool,
        textCenter                   : PropTypes.string,
        firstIconRight               : PropTypes.string,
        secondIconRight              : PropTypes.string,
        iconsRightBackground         : PropTypes.string,
        imageRight                   : PropTypes.string,
        proposalsIcon                : PropTypes.bool,
        proposalsCount               : PropTypes.number,
        messagesIcon                 : PropTypes.bool,
        messagesCount                : PropTypes.number,
        textRight                    : PropTypes.string,
        textRightColored             : PropTypes.bool,
        onLeftLinkClickHandler       : PropTypes.func,
        onRightLinkClickHandler      : PropTypes.func,
        onSecondRightLinkClickHandler: PropTypes.func,
    };

    handleLeftClick() {
        const {menuIconLeft} = this.props;
        if (menuIconLeft) {
            LeftPanelActionCreators.open();
        } else if (this.props.onLeftLinkClickHandler) {
            this.props.onLeftLinkClickHandler();
        }
    }

    goToProposals() {

    }

    goToMessages() {

    }

    render() {
        const {
            menuIconLeft,
            iconLeft,
            textLeft,
            textLeftColored,
            textCenter,
            firstIconRight,
            secondIconRight,
            iconsRightBackground,
            imageRight,
            proposalsIcon,
            proposalsCount,
            messagesIcon,
            messagesCount,
            textRight,
            textRightColored
        } = this.props;
        const textLeftClassName = textLeftColored ? styles.linkColored + ' ' + styles.link : styles.link;
        const textRightClassName = textRightColored ? styles.linkColored + ' ' + styles.link : styles.link;
        const iconLeftModified = menuIconLeft ? 'menu' : iconLeft;

        return (
            <TopBar>
                <div className={styles.left} onClick={this.handleLeftClick.bind(this)}>
                    {iconLeftModified ?
                        <div className={styles.icon + ' icon icon-' + iconLeftModified}/>
                        :
                        <div className={textLeftClassName}>{textLeft}</div>
                    }
                </div>

                <div className={styles.center}>
                    {textCenter || ' '}
                </div>

                <div className={styles.right}>
                    {firstIconRight ?
                        iconsRightBackground ?
                            <div className={styles.roundedIcon}>
                                <RoundedIcon icon={firstIconRight}
                                             size="small"
                                             background={iconsRightBackground}
                                             fontSize={'15px'}
                                             onClickHandler={this.props.onRightLinkClickHandler}
                                />
                            </div>
                            :
                            <div className={styles.icon + ' icon icon-' + firstIconRight} onClick={this.props.onRightLinkClickHandler}/>
                        : null
                    }
                    {secondIconRight ?
                        iconsRightBackground ?
                            <div className={styles.roundedIcon + ' ' + styles.second}>
                                <RoundedIcon icon={secondIconRight}
                                             size="small"
                                             background={iconsRightBackground}
                                             fontSize={'15px'}
                                             onClickHandler={this.props.onSecondRightLinkClickHandler}
                                />
                            </div>
                            :
                            <div className={styles.icon + ' icon icon-' + secondIconRight + ' ' + styles.second} onClick={this.props.onSecondRightLinkClickHandler}/>
                        : null
                    }
                    {imageRight ?
                        <RoundedImage url={imageRight}
                                      size="small"
                                      onClickHandler={this.props.onRightLinkClickHandler}
                        />
                        : null
                    }
                    {messagesIcon ?
                        <IconNotification icon={'mail'}
                                          notifications={messagesCount}
                                          onClickHandler={this.goToMessages.bind(this)}
                        />
                        : null
                    }
                    {proposalsIcon ?
                        <IconNotification icon={'user'}
                                          notifications={proposalsCount}
                                          onClickHandler={this.goToProposals.bind(this)}
                        />
                        : null
                    }
                    {textRight ?
                        <div className={textRightClassName} onClick={this.props.onRightLinkClickHandler}>
                            {textRight}
                        </div>
                        : null
                    }
                </div>
            </TopBar>
        );
    }
}