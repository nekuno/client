import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './TopNavBar.scss';
import TopBar from '../ui/TopBar/TopBar.js';
import IconNotification from '../ui/IconNotification/IconNotification.js';
import RoundedIcon from '../ui/RoundedIcon/RoundedIcon.js';
import RoundedImage from '../ui/RoundedImage/RoundedImage.js';
import Input from '../ui/Input/Input.js';
import RouterActionCreators from '../../actions/RouterActionCreators';

export default class TopNavBar extends Component {

    static propTypes = {
        position                     : PropTypes.oneOf(['relative', 'absolute']),
        background                   : PropTypes.string,
        color                        : PropTypes.string,
        boxShadow                    : PropTypes.bool,
        textAlign                    : PropTypes.oneOf(['center', 'left']),
        textSize                     : PropTypes.oneOf(['regular', 'small']),
        iconLeft                     : PropTypes.string,
        textLeft                     : PropTypes.string,
        imageLeft                    : PropTypes.string,
        textLeftColored              : PropTypes.bool,
        textCenter                   : PropTypes.string,
        firstIconRight               : PropTypes.string,
        secondIconRight              : PropTypes.string,
        iconsRightBackground         : PropTypes.string,
        iconsRightColor              : PropTypes.string,
        imageRight                   : PropTypes.string,
        proposalsIcon                : PropTypes.bool,
        proposalsCount               : PropTypes.number,
        messagesIcon                 : PropTypes.bool,
        messagesCount                : PropTypes.number,
        textRight                    : PropTypes.string,
        textRightColored             : PropTypes.bool,
        searchInput                  : PropTypes.bool,
        onLeftLinkClickHandler       : PropTypes.func,
        onSearchChange               : PropTypes.func,
        onRightLinkClickHandler      : PropTypes.func,
        onSecondRightLinkClickHandler: PropTypes.func,
        online                       : PropTypes.bool,
        children                     : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);

        this.state = {
            searching: false
        };
    }

    handleLeftClick() {
        if (this.props.onLeftLinkClickHandler) {
            this.props.onLeftLinkClickHandler();
        } else {
            this.goBack.bind(this)();
        }
    }

    handleSearchClick() {
        this.setState({searching: true});
    }

    handleChangeInput(value) {
        if (!value) {
            this.setState({searching: false});
        } else {
            this.props.onSearchChange(value);
        }
    }

    goBack() {
        RouterActionCreators.previousRoute(this.context.router.getCurrentLocation().pathname || '');
    }

    goToProposals() {

    }

    goToMessages() {

    }

    render() {
        const {
            position,
            background,
            color,
            boxShadow,
            textAlign,
            textSize,
            iconLeft,
            textLeft,
            imageLeft,
            textLeftColored,
            textCenter,
            firstIconRight,
            secondIconRight,
            iconsRightBackground,
            iconsRightColor,
            imageRight,
            proposalsIcon,
            proposalsCount,
            messagesIcon,
            messagesCount,
            textRight,
            textRightColored,
            searchInput,
            online,
            children
        } = this.props;
        const {searching} = this.state;
        const leftClassName = textSize === 'small' ? styles.left + ' ' + styles.small : styles.left;
        const centerClassName = textSize === 'small' ? styles.center + ' ' + styles.small : styles.center;
        const rightClassName = textSize === 'small' ? styles.right + ' ' + styles.small : styles.right;
        const textLeftClassName = textLeftColored ? styles.linkColored + ' ' + styles.link : styles.link;
        const textRightClassName = textRightColored ? styles.linkColored + ' ' + styles.link : styles.link;

        return (
            <TopBar position={position} background={background} textAlign={textAlign} color={color} boxShadow={boxShadow}>
                {searching ?
                    <div className={styles.searchInput}>
                        <Input placeholder={''} searchIcon={true} size={'small'} onChange={this.handleChangeInput}/>
                    </div>
                    :
                    <div>
                        <div className={leftClassName} onClick={this.handleLeftClick.bind(this)}>
                            {iconLeft ?
                                <div className={styles.icon + ' icon icon-' + iconLeft}/>
                                : imageLeft ?
                                    <RoundedImage url={imageLeft}
                                                  size="x-small"
                                    />
                                    : <div className={textLeftClassName}>{textLeft}</div>
                            }
                        </div>

                        <div className={centerClassName}>
                            {textCenter || ' '}
                        </div>

                        <div className={rightClassName}>
                            {searchInput ?
                                <div className={styles.icon + ' ' + styles.iconSearch + ' icon icon-search'} onClick={this.handleSearchClick}/>
                                : null
                            }
                            {firstIconRight === 'icon-proyecto' || firstIconRight === 'icon-hobbie' || firstIconRight === 'icon-experiencia' ?
                                <span className={styles.icon + " " + styles.iconProposals + " " + firstIconRight}>
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                    <span className="path3"></span>
                                    <span className="path4"></span>
                                    <span className="path5"></span>
                                    <span className="path6"></span>
                                    <span className="path7"></span>
                                </span>
                                : null
                            }
                            {iconsRightBackground ?
                                <div className={styles.roundedIcon}>
                                    <RoundedIcon icon={firstIconRight}
                                                 size="small"
                                                 background={iconsRightBackground}
                                                 color={iconsRightColor}
                                                 fontSize={'15px'}
                                                 onClickHandler={this.props.onRightLinkClickHandler}
                                    />
                                </div>
                                :
                                    <div className={styles.icon + ' icon icon-' + firstIconRight} style={{color: iconsRightColor}} onClick={this.props.onRightLinkClickHandler}/>
                            }
                            {secondIconRight ?
                                iconsRightBackground ?
                                    <div className={styles.roundedIcon + ' ' + styles.second}>
                                        <RoundedIcon icon={secondIconRight}
                                                     size="small"
                                                     background={iconsRightBackground}
                                                     color={iconsRightColor}
                                                     fontSize={'15px'}
                                                     onClickHandler={this.props.onSecondRightLinkClickHandler}
                                        />
                                    </div>
                                    :
                                    <div className={styles.icon + ' icon icon-' + secondIconRight + ' ' + styles.second} style={{color: iconsRightColor}} onClick={this.props.onSecondRightLinkClickHandler}/>
                                : null
                            }
                            {imageRight ?
                                <div>
                                    <RoundedImage url={imageRight}
                                                  size="small"
                                                  onClickHandler={this.props.onRightLinkClickHandler}
                                    />
                                    {online !== undefined ?
                                        online ?
                                        <div className={styles.online}></div>
                                            : <div className={styles.offline}></div>
                                        : null
                                    }
                                </div>
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
                        {children}
                    </div>
                }
            </TopBar>
        );
    }
}