import React from 'react';
import { storiesOf } from '@storybook/react';
import CardTopData from '../src/js/components/Proposal/CardTopData/CardTopData.js';

storiesOf('CardTopData', module)
    .add('with all data', () => (
        <CardTopData image='http://via.placeholder.com/360x180'
                     defaultImage='http://via.placeholder.com/360x180'
                     type='work'
                     mainText='Main short text'
                     secondaryText='Secondary text a little bit longer than the main text'
        />

    ))
;