import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import UserTopData from '../src/js/components/ui/UserTopData/UserTopData.js';

storiesOf('UserTopData', module)
    .add('with all', () => (
        <UserTopData username={'usertest'} location={{locality:'One Locality'}} age={'23'}/>
    ));