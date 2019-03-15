import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ContentTypeIcon from '../src/js/components/ui/ContentTypeIcon/ContentTypeIcon.js';

storiesOf('ContentTypeIcon', module)
    .add('Video', () => (
        <ContentTypeIcon type = 'Video'/>
    ))
    .add('Audio', () => (
        <ContentTypeIcon type = 'Audio'/>
    ))
    .add('photo', () => (
        <ContentTypeIcon type = 'Image'/>
    ))
    .add('channels', () => (
        <ContentTypeIcon type = 'Creator'/>
    ))
    .add('game', () => (
        <ContentTypeIcon type = 'Game'/>
    ))
    .add('link', () => (
        <ContentTypeIcon type = 'Web'/>
    ));