import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import DailyInputRange from '../src/js/components/ui/DailyInputRange/DailyInputRange.js';

let data = ['morning', 'afternoon', 'night'];

function handleClick(newData) {
    data = newData;
    forceReRender();
}

storiesOf('DailyInputRange', module)
    .add('with all selected', () => (
        <DailyInputRange data={data} onClickHandler={handleClick}/>
    ));