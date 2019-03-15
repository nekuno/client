import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ProposalRecommendationList from '../src/js/components/ui/ProposalRecommendationList/ProposalRecommendationList.js';

storiesOf('ProposalRecommendationList', module)
    .add('empty', () => (
        <ProposalRecommendationList recommendations = {[]} />
    ))
    .add('with one proposal', () => {
        const proposal = { fields: {
                title      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                image      : 'http://via.placeholder.com/360x180'
            }
        };
        const user = {
            photo     : 'http://via.placeholder.com/100x100',
            nickname  : 'JohnDoe',
            age       : 36,
            location  : {city: 'New York'},
            matching  : 12,
            similarity: 35,
        };

        const recommendations = [
            {proposal, owner: user}
        ];

        return <ProposalRecommendationList recommendations={recommendations}/>

    })
    .add('with two proposals', () => {
        const proposal = { fields: {
                title      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                image      : 'http://via.placeholder.com/360x180'
            }
        };
        const user = {
            photo     : 'http://via.placeholder.com/100x100',
            nickname  : 'JohnDoe',
            age       : 36,
            location  : {city: 'New York'},
            matching  : 12,
            similarity: 35,
        };

        const recommendations = [
            {proposal, owner: user}, {proposal, owner: user}
        ];

        return <ProposalRecommendationList recommendations={recommendations}/>

    })
    .add('with one user', () => {
        const user = {
            photo     : 'http://via.placeholder.com/100x100',
            nickname  : 'JohnDoe',
            age       : 36,
            location  : {city: 'New York'},
            matching  : 12,
            similarity: 35,
        };

        const recommendations = [user];

        return <ProposalRecommendationList recommendations={recommendations}/>
    });