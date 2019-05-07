import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import OwnProposalsOtherList from '../src/js/components/ui/OwnProposalsOtherList/OwnProposalsOtherList.js';

storiesOf('OwnProposalsOtherList', module)
    .add('with text', () => (
        <OwnProposalsOtherList onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </OwnProposalsOtherList>
    ))
    .add('with HTML', () => (
        <OwnProposalsOtherList onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </OwnProposalsOtherList>
    ));