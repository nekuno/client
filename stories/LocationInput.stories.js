import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import LocationInput from '../src/js/components/ui/LocationInput/LocationInput.js';
import GeocoderService from '../src/js/services/GeocoderService';

GeocoderService.init();

storiesOf('LocationInput', module)
    .add('with title', () => (
        <LocationInput title={'Lorem ipsum'} placeholder={'Write a location'} onSuggestSelect={action('suggestion selected')}/>
    ))
    .add('without title', () => (
        <LocationInput placeholder={'Write a location'} onSuggestSelect={action('suggestion selected')}/>
    ));