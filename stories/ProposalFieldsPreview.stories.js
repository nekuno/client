import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ProposalFieldsPreview from '../src/js/components/ui/ProposalFieldsPreview/ProposalFieldsPreview.js';

storiesOf('ProposalFieldsPreview', module)
    .add('with text', () => (
        <ProposalFieldsPreview onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </ProposalFieldsPreview>
    ))
    .add('with HTML', () => (
        <ProposalFieldsPreview onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </ProposalFieldsPreview>
    ));