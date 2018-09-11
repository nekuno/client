import { configure } from '@storybook/react';
import '../src/scss/layout.scss';

function loadStories() {
    require('../stories/Banner.stories');
    require('../stories/BottomBar.stories');
    require('../stories/Button.stories');
    require('../stories/CardUser.stories');
    require('../stories/Chip.stories');
    require('../stories/ErrorMessage.stories');
    require('../stories/Frame.stories');
    require('../stories/IconNotification.stories');
    require('../stories/Input.stories');
    require('../stories/InputSelectText.stories');
    require('../stories/InputTag.stories');
    require('../stories/LeftPanel.stories');
    require('../stories/Overlay.stories');
    require('../stories/ProgressBar.stories');
    require('../stories/RoundedIcon.stories');
    require('../stories/RoundedImage.stories');
    require('../stories/StepsBar.stories');
    require('../stories/Tabs.stories');
    require('../stories/TopBar.stories');
    require('../stories/TopNavBar.stories');

    // require as many stories as you need.
}

configure(loadStories, module);