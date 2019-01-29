import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import EditProfilePage from '../src/js/pages/OwnUser/EditProfilePage.js';

storiesOf('EditProfilePage', module)
    .add('with text', () => (
        <EditProfilePage onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </EditProfilePage>
    ))
    .add('with HTML', () => (
        <EditProfilePage onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </EditProfilePage>
    ));