import React from 'react';
import { storiesOf } from '@storybook/react';
import MatchingBars from '../src/js/components/ui/MatchingBars/MatchingBars.js';

storiesOf('MatchingBars', module)
    .add('condensed', () => (
        <MatchingBars similarity={0.15} matching={0.30} condensed={true} />
    ))
    .add('expanded', () => (
        <MatchingBars similarity={0.15} matching={0.30} condensed={false} />
    ));