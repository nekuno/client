import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import OwnProposalCard from '../src/js/components/Proposal/OwnProposalCard/OwnProposalCard.js';

storiesOf('OwnProposalCard', module)
    .add('with short title', () => (
        <OwnProposalCard title={'Lorem ipsum dolor'}
                         image={'http://via.placeholder.com/360x180'}
                         type={'work'}
                         photos={['http://via.placeholder.com/100x100/928BFF', 'http://via.placeholder.com/100x100/2B3857', 'http://via.placeholder.com/100x100/818FA1', 'http://via.placeholder.com/100x100/63CAFF', 'http://via.placeholder.com/100x100/009688']}
                         description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                         onClickHandler={action('clicked')}/>
    ))
    .add('with long title', () => (
        <OwnProposalCard title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}
                         image={'http://via.placeholder.com/360x180'}
                         type={'leisure-plan'}
                         photos={['http://via.placeholder.com/100x100/928BFF', 'http://via.placeholder.com/100x100/2B3857', 'http://via.placeholder.com/100x100/818FA1']}
                         description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                         onClickHandler={action('clicked')}/>
    ))
    .add('with very long title', () => (
        <OwnProposalCard title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                         image={'http://via.placeholder.com/360x180'}
                         type={'leisure-plan'}
                         photos={['http://via.placeholder.com/100x100/928BFF', 'http://via.placeholder.com/100x100/2B3857', 'http://via.placeholder.com/100x100/818FA1']}
                         description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                         onClickHandler={action('clicked')}/>
    ))
    .add('with short description', () => (
        <OwnProposalCard title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                         image={'http://via.placeholder.com/360x180'}
                         type={'experience-plan'}
                         photos={['http://via.placeholder.com/100x100/928BFF', 'http://via.placeholder.com/100x100/2B3857', 'http://via.placeholder.com/100x100/818FA1']}
                         description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                         onClickHandler={action('clicked')}/>
    ));