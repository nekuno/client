import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import Textarea from '../src/js/components/ui/Textarea/Textarea.js';

storiesOf('Textarea', module)
    .add('with text', () => (
        <Textarea onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </Textarea>
    ))
    .add('with HTML', () => (
        <Textarea onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </Textarea>
    ));