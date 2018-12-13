import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import LoadingGif from '../src/js/components/ui/LoadingGif/LoadingGif.js';

storiesOf('LoadingGif', module)
    .add('simple', () => (
        <LoadingGif/>
    ));