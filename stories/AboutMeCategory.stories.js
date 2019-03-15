import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import AboutMeCategory from '../src/js/components/profile/AboutMeCategory/AboutMeCategory.js';

storiesOf('AboutMeCategory', module)
    .add('with text', () => (
        <AboutMeCategory text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.'/>
    ))
    .add('without text', () => (
        <AboutMeCategory text='' />
    ));