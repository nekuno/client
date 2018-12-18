import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import OtherUserProposalCard from '../src/js/components/ui/OtherUserProposalCard/OtherUserProposalCard.js';
import OwnProposalCard from "../src/js/components/Proposal/OwnProposalCard/OwnProposalCard";

storiesOf('OtherUserProposalCard', module)
    .add('without images and short title', () => (
        <OwnProposalCard title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}
                         image={'http://via.placeholder.com/360x180'}
                         type={'work'}
                         description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                         onClickHandler={action('clicked')}/>
    ));