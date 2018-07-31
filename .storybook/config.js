import { configure } from '@storybook/react';
import '../src/scss/layout.scss';

function loadStories() {
    require('../src/js/stories/Banner.stories');
    require('../src/js/stories/Chip.stories');
    require('../src/js/stories/Frame.stories');
    require('../src/js/stories/TopBar.stories');
    require('../src/js/stories/BottomBar.stories');
    require('../src/js/stories/LeftPanel.stories');
    require('../src/js/stories/IconNotification.stories');
    require('../src/js/stories/RoundedImage.stories');

    // require as many stories as you need.
}

configure(loadStories, module);