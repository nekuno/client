import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import EditProfileCategory from '../src/js/components/ui/EditProfileCategory/EditProfileCategory.js';

storiesOf('EditProfileCategory', module)
    .add('with text', () => (
        <EditProfileCategory onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </EditProfileCategory>
    ))
    .add('with HTML', () => (
        <EditProfileCategory onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </EditProfileCategory>
    ));