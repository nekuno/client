import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ProposalSummary from '../src/js/components/Proposal/ProposalSummary/ProposalSummary.js';

const proposal = {
    id          : 1,
    type        : 'hobbies',
    countMatches: 1,
    hasMatch    : false,
    fields      :
        {title: 'title of proposal'}
};

const owner = {
    user_name: 'owner',
    photos   : ["https://local.nekuno.com/bundles/qnoowlanding/images/user-no-img.jpg"]
};

storiesOf('ProposalSummary', module)
    .add('own created proposal', () => (
        <ProposalSummary proposal={proposal} hasCount={true}/>
    ))
    .add('own liked proposal without match', () => (
        <ProposalSummary proposal={proposal} owner={owner} hasCount={false} hasMatch={false}/>
    ))
    .add('own liked proposal with match', () => (
        <ProposalSummary proposal={proposal} owner={owner} hasCount={false} hasMatch={true}/>
    ));