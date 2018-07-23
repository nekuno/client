import { configure } from '@storybook/react';
import '../src/scss/layout.scss';

function loadStories() {
    require('../src/js/stories/Banner.stories');

    // require as many stories as you need.
}

configure(loadStories, module);