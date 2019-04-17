import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import AvailabilityPreview from '../src/js/components/ui/AvailabilityPreview/AvailabilityPreview.js';

storiesOf('AvailabilityPreview', module)
    .add('with text', () => (
        <AvailabilityPreview onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </AvailabilityPreview>
    ))
    .add('with HTML', () => (
        <AvailabilityPreview onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </AvailabilityPreview>
    ));