import { configure } from '@storybook/react';
import '../src/scss/layout.scss';

function loadStories() {
    require('../stories/Banner.stories');
    require('../stories/BottomBar.stories');
    require('../stories/CardUser.stories');
    require('../stories/Chip.stories');
    require('../stories/Frame.stories');
    require('../stories/IconNotification.stories');
    require('../stories/LeftPanel.stories');
    require('../stories/ProgressBar.stories');
    require('../stories/RoundedIcon.stories');
    require('../stories/RoundedImage.stories');
    require('../stories/Tabs.stories');
    require('../stories/TopBar.stories');

    // require as many stories as you need.
}

configure(loadStories, module);