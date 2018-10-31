import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import AvailabilityEdit from '../src/js/components/Availability/AvailabilityEdit/AvailabilityEdit.js';
import {INFINITE_CALENDAR_BLUE_THEME, INFINITE_CALENDAR_THEME} from "../src/js/constants/InfiniteCalendarConstants";

let availability = null;

const save = function(newAvailability) {
    availability = newAvailability;
    forceReRender();

};

storiesOf('AvailabilityEdit', module)
    .add('default', () => (
        <AvailabilityEdit theme={INFINITE_CALENDAR_THEME} availability={availability} onSave={save}/>
    ))
    .add('theme', () => (
        <AvailabilityEdit theme={INFINITE_CALENDAR_BLUE_THEME} color={'blue'} availability={availability} onSave={save}/>
    ));