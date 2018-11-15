import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProposalCard from '../src/js/components/Proposal/ProposalCard/ProposalCard.js';

storiesOf('ProposalCard', module)
    .add('with short title', () => (
        <ProposalCard title={'Lorem ipsum dolor'}
                      image={'http://via.placeholder.com/360x180'}
                      type={'work'}
                      photo={'http://via.placeholder.com/100x100'}
                      nickname={'JohnDoe'}
                      age={36}
                      city={'New York'}
                      matching={12}
                      similarity={35}
                      description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                      onClickHandler={action('clicked')}/>
    ))
    .add('with long title', () => (
        <ProposalCard title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}
                      image={'http://via.placeholder.com/360x180'}
                      type={'leisure-plan'}
                      photo={'http://via.placeholder.com/100x100'}
                      nickname={'JohnDoe'}
                      age={36}
                      city={'New York'}
                      matching={12}
                      similarity={35}
                      description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                      onClickHandler={action('clicked')}/>
    ))
    .add('with very long title', () => (
        <ProposalCard title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                      image={'http://via.placeholder.com/360x180'}
                      type={'experience-plan'}
                      photo={'http://via.placeholder.com/100x100'}
                      nickname={'JohnDoe'}
                      age={36}
                      city={'New York'}
                      matching={12}
                      similarity={35}
                      description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                      onClickHandler={action('clicked')}/>
    ));