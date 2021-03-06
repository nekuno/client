import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import DailyInputRange from '../src/js/components/ui/DailyInputRange/DailyInputRange.js';

let data = ['Morning', 'Afternoon', 'Night'];

function handleClick(id, newData) {
    data = newData;
    forceReRender();
}

storiesOf('DailyInputRange', module)
    .add('with all selected', () => (
        <DailyInputRange data={data} onClickHandler={handleClick}/>
    ));