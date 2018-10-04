import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import AvailabilityEdit from '../src/js/components/Availability/AvailabilityEdit/AvailabilityEdit.js';

let availability = null;

const save = function(newAvailability) {
    availability = newAvailability;
    forceReRender();

};

storiesOf('AvailabilityEdit', module)
    .add('default', () => (
        <AvailabilityEdit availability={availability} onSave={save}/>
    ));