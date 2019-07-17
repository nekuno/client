import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../../utils/connectToStores';
import shouldPureComponentUpdate from '../../../../../node_modules/react-pure-render/function';
import LoginStore from '../../../stores/LoginStore';
import RouterActionCreators from '../../../actions/RouterActionCreators';
import translate from '../../../i18n/Translate';

import styles from './ToolBar.scss';

function getState() {
    const isGuest = LoginStore.isGuest();

    return {isGuest};
}

@connectToStores([LoginStore], getState)
@translate('ToolBar')
export default class ToolBar extends Component {
    static propTypes = {
        links          : PropTypes.array.isRequired,
        activeLinkIndex: PropTypes.number.isRequired,
        // Injected by @connectToStores:
        isGuest        : PropTypes.bool,
        // Injected by @translate:
        strings        : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onLinkClick = this.onLinkClick.bind(this);
        this.onCentralLinkClick = this.onCentralLinkClick.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);
        this.addProjectProposal = this.addProjectProposal.bind(this);
        this.addLeisurePlan = this.addLeisurePlan.bind(this);
        this.addExperienceProposal = this.addExperienceProposal.bind(this);

        this.state = {
            addingProposal: false
        };
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    onLinkClick(url) {
        RouterActionCreators.replaceRoute(url);
    }

    onCentralLinkClick() {
        this.setState({addingProposal: !this.state.addingProposal});
    }

    closeAddModal() {
        this.setState({addingProposal: false});
    }

    addProjectProposal() {
        // CreatingProposalStore.proposal.type = 'work';
        // this.context.router.push('/proposal-basic-edit');
        this.context.router.push('/proposals-project-introduction');
    }

    addLeisurePlan() {
        // CreatingProposalStore.proposal.selectedType = 'leisure';
        // this.context.router.push('/proposal-basic-edit');
        this.context.router.push('/proposals-leisure-introduction');
    }

    addExperienceProposal() {
        // CreatingProposalStore.proposal.selectedType = 'experience';
        // this.context.router.push('/proposal-basic-edit');
        this.context.router.push('/proposals-experience-introduction');
    }

    render() {
        let {activeLinkIndex, links, isGuest, strings} = this.props;
        const {addingProposal} = this.state;

        let className = isGuest ? "toolbar toolbar-guest" : "toolbar";

        return (
            <div id="toolbar-bottom" className={className}>
                {/*<div className="arrow-up" style={{ left: arrowUpLeft }}></div>*/}
                <div className="toolbar-inner">
                    {links.map((link, index) => {
                        if (link.isCenter) {
                            return (
                                <a key={index} className={styles.middleIconWrapper}
                                   href="javascript:void(0)" onClick={this.onCentralLinkClick}>
                                    <div className={styles.middleIconCircle}>
                                        <span className={`${styles.icon} icon mdi ${addingProposal ? 'mdi-close' : 'mdi-plus'}`}></span>
                                    </div>
                                </a>
                            );
                        } else {
                            return (
                                <a key={index} className={`toolbar-link ${activeLinkIndex === index ? 'active' : ''}`}
                                   href="javascript:void(0)" onClick={this.onLinkClick.bind(this, link.url)}>
                                    {link.icon ? <span className={`icon mdi mdi-${link.icon}`}></span> : '' }
                                    <span className="text">{link.text}</span>
                                </a>
                            );
                        }
                    })}
                </div>
                {addingProposal ?
                    <div className={styles.addProposalWrapper} onClick={this.closeAddModal}>
                        <div className={styles.addProposalAbsoluteWrapper}>
                            <div className={styles.addProposal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="291px" height="232px" viewBox="0 0 291 232" version="1.1">
                                    <g transform="translate(13, 12)">
                                        <path id="herradura" style={{ fill: 'none', stroke: '#fff', strokeWidth: 90, strokeLinecap: 'round', strokeDasharray: 397.8 }}
                                              d="M 223.64033,174.15144 C 246.36764,123.81602 223.98685,64.586983 173.65144,41.859672 123.31602,19.132362 64.086983,41.513151 41.359672,91.848564 18.632362,142.18398 41.013151,201.41302 91.348564,224.14033 141.68398,246.86764 200.91302,224.48685 223.64033,174.15144 Z" />
                                        <g className="azul" transform="translate(12.5,71)" onClick={this.addProjectProposal}>
                                            <circle cy="24" cx="24" r="24" style={{ fill: '#63caff' }} />
                                            <path style={{ fill: '#fff' }} d="m 15.440278,27.634757 v -1.14354 h 0.715588 v 1.958849 c 0,0.232121 0.188546,0.424593 0.415931,0.424593 0.232794,0 0.415931,-0.192723 0.415931,-0.424593 v -1.958849 h 0.715589 v 1.14354 c 0,0.232121 0.188546,0.424593 0.415931,0.424593 0.23304,0 0.415932,-0.192723 0.415932,-0.424593 v -1.14354 h 0.720996 v 1.958849 c 0,0.232121 0.183138,0.424593 0.415932,0.424593 0.227385,0 0.415931,-0.192723 0.415931,-0.424593 v -1.958849 h 0.715588 v 1.14354 c 0,0.232121 0.183138,0.424593 0.415932,0.424593 0.227385,0 0.415931,-0.192723 0.415931,-0.424593 v -1.14354 h 0.715588 v 1.958849 c 0,0.232121 0.188546,0.424593 0.415932,0.424593 0.227385,0 0.415931,-0.192723 0.415931,-0.424593 v -1.958849 h 0.715343 v 1.14354 c 0,0.232121 0.188545,0.424593 0.415931,0.424593 0.233039,0 0.415931,-0.192723 0.415931,-0.424593 v -1.14354 h 0.715589 v 1.958849 c 0,0.232121 0.188545,0.424593 0.415685,0.424593 0.233039,0 0.415931,-0.192723 0.415931,-0.424593 v -1.958849 h 1.214608 c 0.687811,0 1.242386,0.566124 1.247794,1.273779 v 1.200002 c -0.0054,0.707655 -0.559983,1.273779 -1.247794,1.273779 H 14.24804 C 13.560229,30.239028 13,29.672904 13,28.965249 v -1.200002 c 0,-0.707655 0.560229,-1.273779 1.24804,-1.273779 h 0.360375 v 1.14354 c 0,0.232121 0.188546,0.424593 0.415931,0.424593 0.227386,-2.51e-4 0.415932,-0.192723 0.415932,-0.424844 z m 5.054842,-5.640513 1.499024,-0.749612 v 1.499024 z m 6.745609,-8.244732 2.998048,3.74756 h -1.888478 c -0.611498,0 -1.10957,-0.579234 -1.10957,-1.303276 z m 4.496829,10.404633 v 9.355907 c 0,0.675577 -0.547867,1.220483 -1.232397,1.225797 H 17.979957 c -0.67919,-0.0053 -1.232397,-0.55022 -1.232397,-1.225797 v -2.332274 h 10.882331 c 1.133602,0 2.048251,-0.910108 2.048251,-2.043397 v -1.155026 c 0,-1.127974 -0.914892,-2.043397 -2.048251,-2.043397 H 16.74756 V 14.226038 C 16.74756,13.544906 17.300767,13 17.979957,13 h 9.06954 v 2.920657 c 0,1.127974 0.919989,2.043396 2.053834,2.043396 h 2.63447 v 2.217786 h -8.949383 c -0.06578,0 -0.131566,0.01087 -0.191766,0.04372 L 19.50777,21.80569 c -0.136906,0.06546 -0.224535,0.206996 -0.224535,0.359647 0,0.157965 0.08763,0.294192 0.224535,0.365203 l 3.088882,1.574817 c 0.0602,0.03261 0.125983,0.04927 0.191766,0.04927 h 8.94914 z m 0.749755,-2.909513 v 2.248536 h -9.743657 v -2.248536 z m 1.499024,2.248536 v -2.248536 c 0.41522,0.02625 0.749512,0.518804 0.749512,1.121713 0,0.60802 -0.334292,1.10057 -0.749512,1.126823 z" />
                                            <foreignObject x="-22.7" y="51.4" width="86.1" height="20.8">
                                                <div className={styles.buttonText}>{strings.project}</div>
                                            </foreignObject>
                                        </g>
                                        <g className="verde" transform="translate(204.5,71)" onClick={this.addExperienceProposal}>
                                            <circle cy="24" cx="24" r="24" style={{ fill: '#7bd47e' }} />
                                            <path style={{ fill: '#fff' }} d="m 30.677666,28.097276 c 2.29141,-3.0693 4.154903,-6.656672 4.154903,-10.201784 C 34.832569,12.983047 31.719131,9 23.944927,9 c -0.005,0 -0.0097,3.13e-4 -0.01503,3.13e-4 -0.0016,0 -0.0031,-3.13e-4 -0.0047,-3.13e-4 -0.0028,0 -0.0059,3.13e-4 -0.0085,3.13e-4 C 16.163523,9.0100171 13,12.969273 13,17.875771 c 0,4.263526 2.507404,8.271615 5.481854,11.492424 l 4.163668,5.966744 h -0.740013 v 0.939103 h 0.438561 v 1.836571 c 0,0.336199 0.273592,0.610104 0.610104,0.610104 h 2.71651 c 0.336512,0 0.610104,-0.273905 0.610104,-0.610104 v -1.836571 h 0.438248 v -0.939103 h -0.832358 z m -5.868452,4.431312 c 0.603217,0 1.206121,0 1.808712,0 l -1.856919,2.805725 h -0.971032 l -1.957716,-2.805725 c 0.476751,0 0.954128,0 1.43088,0 0.515567,0 1.030821,0 1.546075,0 z m 6.460713,-14.680364 c 0,5.124996 -2.977581,10.345467 -5.401405,13.734375 -0.259505,0 -0.518698,0 -0.77789,0 1.044282,-3.594885 2.188109,-8.682003 2.188109,-13.68742 0,-3.778948 -0.56847,-7.006018 -1.920465,-8.2947794 4.197476,0.6257554 5.911651,4.0797744 5.911651,8.2478244 z M 22.482118,9.6054081 c -1.351055,1.2881359 -1.927977,4.4979879 -1.927977,8.2703629 0,5.308747 1.197042,10.219001 2.378746,13.707141 -0.148378,0 -0.29613,0 -0.444508,0 -2.794456,-3.296563 -5.925424,-8.303545 -5.925424,-13.752844 0,-4.158033 1.737966,-7.59014 5.919163,-8.2246599 z" />
                                            <foreignObject x="-14.7" y="51.4" width="86.1" height="20.8">
                                                <div className={styles.buttonText}>{strings.experience}</div>
                                            </foreignObject>
                                        </g>
                                        <g className="rosa" transform="translate(108.5,0)" onClick={this.addLeisurePlan}>
                                            <circle cy="24" cx="24" r="24" style={{ fill: '#d380d3' }} />
                                            <path style={{ fill: '#fff' }} d="m 35.498633,19.912109 c -0.0717,-0.404174 -0.18643,-0.806299 -0.34769,-1.202279 -1.240618,-3.046086 -4.715755,-4.508547 -7.762134,-3.268513 -0.871272,0.355298 -1.612307,0.8941 -2.198227,1.552602 h -3.022673 c -0.585921,-0.658502 -1.326956,-1.197011 -2.198228,-1.552602 -3.046378,-1.239741 -6.521515,0.22272 -7.762134,3.268513 -0.16126,0.396272 -0.275693,0.798398 -0.348275,1.202279 L 11,29.045099 c 0.005,1.666743 0.403589,3.09584 1.834734,3.679419 0.02751,0.01112 0.05502,0.01902 0.08195,0.02956 0.02663,0.012 0.05268,0.02488 0.0799,0.03629 1.431146,0.582701 2.715665,-0.160968 3.883409,-1.349491 l 5.071932,-6.274505 h 3.454065 l 5.07281,6.274505 c 1.167159,1.188523 2.451971,1.932485 3.883116,1.349491 0.02751,-0.01141 0.05268,-0.02429 0.07961,-0.03629 0.02722,-0.01054 0.05502,-0.01844 0.08224,-0.02956 1.431146,-0.583579 1.830052,-2.012383 1.834735,-3.679419 z m -14.969078,1.748397 c 0,0.221257 -0.179698,0.401541 -0.40154,0.401541 h -1.872489 v 1.872488 c 0,0.22272 -0.179698,0.40154 -0.40154,0.40154 h -0.90288 c -0.221549,0 -0.40154,-0.178527 -0.40154,-0.40154 V 22.061754 H 14.6762 c -0.220672,0 -0.40154,-0.179991 -0.40154,-0.40154 v -0.902588 c 0,-0.222134 0.180576,-0.400954 0.40154,-0.400954 h 1.873366 v -1.873074 c 0,-0.222135 0.179698,-0.40154 0.40154,-0.40154 h 0.90288 c 0.22155,0 0.40154,0.179405 0.40154,0.40154 v 1.873074 h 1.872489 c 0.221842,0 0.40154,0.17882 0.40154,0.400954 z m 7.278647,0.522998 c -0.539094,0 -0.976047,-0.436953 -0.976047,-0.975169 0,-0.539387 0.436953,-0.97634 0.976047,-0.97634 0.538801,0 0.975462,0.436953 0.975462,0.97634 0,0.538216 -0.436661,0.975169 -0.975462,0.975169 z m 2.149059,2.149644 c -0.538216,0 -0.976339,-0.437538 -0.976339,-0.975461 0,-0.538802 0.438123,-0.975754 0.976339,-0.975754 0.539387,0 0.97634,0.436952 0.97634,0.975754 0,0.537923 -0.436953,0.975461 -0.97634,0.975461 z m 0,-4.298996 c -0.538216,0 -0.976339,-0.436953 -0.976339,-0.97634 0,-0.538801 0.438123,-0.975754 0.976339,-0.975754 0.539387,0 0.97634,0.436953 0.97634,0.975754 0,0.539387 -0.436953,0.97634 -0.97634,0.97634 z m 2.149938,2.149352 c -0.539387,0 -0.97634,-0.436953 -0.97634,-0.975169 0,-0.539387 0.436953,-0.97634 0.97634,-0.97634 0.539094,0 0.976047,0.436953 0.976047,0.97634 0,0.538216 -0.436953,0.975169 -0.976047,0.975169 z" />
                                            <foreignObject x="-28.7" y="51" width="105.4" height="22.2">
                                                <div className={styles.buttonText}>{strings.leisure}</div>
                                            </foreignObject>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}
