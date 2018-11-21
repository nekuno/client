import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProposalCard from '../src/js/components/Proposal/ProposalCard/ProposalCard.js';

storiesOf('ProposalCard', module)
    .add('with short title', () => {
        const proposal = { type: 'work', fields: {
                title      : 'Lorem ipsum dolor',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                photo      : 'http://via.placeholder.com/360x180'
            }
        };
        const user = {
            photo     : {url: 'http://via.placeholder.com/100x100'},
            username  : 'JohnDoe',
            age       : 36,
            location  : {locality: 'New York'},
            matching  : 12,
            similarity: 35,
        };
        return <ProposalCard proposal={proposal} user={user}/>
    })
    .add('with long title', () => {
        const proposal = { type: 'work', fields: {
                title      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                photo      : 'http://via.placeholder.com/360x180'
            }
        };
        const user = {
            photo     : {url: 'http://via.placeholder.com/100x100'},
            username  : 'JohnDoe',
            age       : 36,
            location  : {locality: 'New York'},
            matching  : 12,
            similarity: 35,
        };
        return <ProposalCard proposal={proposal} user={user}/>

    })
    .add('with very long title', () => {
        const proposal = { type: 'work', fields: {
                title      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                photo      : 'http://via.placeholder.com/360x180'
            }
        };
        const user = {
            photo     : {url: 'http://via.placeholder.com/100x100'},
            username  : 'JohnDoe',
            age       : 36,
            location  : {locality: 'New York'},
            matching  : 12,
            similarity: 35,
        };
        return <ProposalCard proposal={proposal} user={user}/>
    });