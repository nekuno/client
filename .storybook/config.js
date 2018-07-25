import { configure } from '@storybook/react';
import '../src/scss/layout.scss';

function loadStories() {
    require('../src/js/stories/Banner.stories');
    require('../src/js/stories/Chip.stories');
    require('../src/js/stories/Frame.stories');

    // require as many stories as you need.
}

configure(loadStories, module);