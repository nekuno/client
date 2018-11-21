import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CandidateCard from '../src/js/components/Proposal/CandidateCard/CandidateCard.js';

storiesOf('CandidateCard', module)
    .add('with text', () => {
        const proposal = {
            type: 'work', fields: {
                title      : 'Lorem ipsum dolor',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                photo      : 'http://via.placeholder.com/120x90'
            }
        };
        const user = {
            photo     : {url: 'http://via.placeholder.com/360x180'},
            username  : 'JohnDoe',
            age       : 36,
            location  : {locality: 'New York'},
            matching  : 12,
            similarity: 35,
        };
        return <CandidateCard proposal={proposal} user={user} />;
    })
    ;