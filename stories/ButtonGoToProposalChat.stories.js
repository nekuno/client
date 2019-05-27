import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ButtonGoToProposalChat from '../src/js/components/ui/ButtonGoToProposalChat/ButtonGoToProposalChat.js';

storiesOf('ButtonGoToProposalChat', module)
    .add('with text', () => (
        <ButtonGoToProposalChat onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </ButtonGoToProposalChat>
    ))
    .add('with HTML', () => (
        <ButtonGoToProposalChat onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </ButtonGoToProposalChat>
    ));