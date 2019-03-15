import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import SelectCollapsible from '../src/js/components/ui/SelectCollapsible/SelectCollapsible.js';

const options = [
    {
        id: 'compatibility',
        text: 'Compatibility'
    },
    {
        id: 'similarity',
        text: 'Similarity'
    },
    {
        id: 'coincidences',
        text: 'Coincidences'
    }
];

storiesOf('SelectCollapsible', module)
    .add('order selection', () => (
        <SelectCollapsible selected={'compatibility'} options={options} title={'Order'} onClickHandler={action('clicked')}/>
    ));