import React from 'react';
import { storiesOf } from '@storybook/react';
import RoundOption from '../src/js/components/ui/RoundOption/RoundOption.js';

storiesOf('RoundOption', module)
    .add('with imagine image', () => (
        <RoundOption picture={'https://i.imgur.com/bLgcS46.jpg'}/>
    ));