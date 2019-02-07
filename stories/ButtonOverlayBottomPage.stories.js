import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ButtonOverlayBottomPage from '../src/js/components/ui/ButtonOverlayBottomPage/ButtonOverlayBottomPage.js';

storiesOf('ButtonOverlayBottomPage', module)
    .add('with short text', () => (
        <ButtonOverlayBottomPage onClickHandler={action('clicked')} text={'Short text'} />
    ))
    .add('with long text', () => (
        <ButtonOverlayBottomPage onClickHandler={action('clicked')} text={'Let´s see what happens with a somewhat long text'} />
    ));