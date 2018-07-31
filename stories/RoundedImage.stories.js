import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RoundedImage from '../src/js/components/ui/RoundedImage/RoundedImage.js';

storiesOf('RoundedImage', module)
    .add('with x-large image', () => (
        <RoundedImage url="http://via.placeholder.com/350x350" size="x-large" onClickHandler={action('clicked')}/>
    ))
    .add('with large image', () => (
        <RoundedImage url="http://via.placeholder.com/250x250" size="large" onClickHandler={action('clicked')}/>
    ))
    .add('with regular image', () => (
        <RoundedImage url="http://via.placeholder.com/150x150" size="regular" onClickHandler={action('clicked')}/>
    ))
    .add('with small image', () => (
        <RoundedImage url="http://via.placeholder.com/50x50" size="small" onClickHandler={action('clicked')}/>
    ))
    .add('with x-small image', () => (
        <RoundedImage url="http://via.placeholder.com/25x25" size="x-small" onClickHandler={action('clicked')}/>
    ));