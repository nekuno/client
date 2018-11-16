import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ProposalFilterPreview from '../src/js/components/ui/ProposalFilterPreview/ProposalFilterPreview.js';

storiesOf('ProposalFilterPreview', module)
    .add('with text', () => (
        <ProposalFilterPreview onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </ProposalFilterPreview>
    ))
    .add('with HTML', () => (
        <ProposalFilterPreview onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </ProposalFilterPreview>
    ));