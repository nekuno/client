import { configure } from '@storybook/react';
import '../src/scss/layout.scss';

function loadStories() {
    require('../stories/AvailabilityEdit.stories');
    require('../stories/Banner.stories');
    require('../stories/BottomNavBar.stories');
    require('../stories/Button.stories');
    require('../stories/CardUser.stories');
    require('../stories/Chip.stories');
    require('../stories/DateInputRange.stories');
    require('../stories/DailyInputRange.stories');
    require('../stories/ErrorMessage.stories');
    require('../stories/Frame.stories');
    require('../stories/IconNotification.stories');
    require('../stories/Input.stories');
    require('../stories/InputSelectImage.stories');
    require('../stories/InputSelectText.stories');
    require('../stories/InputTag.stories');
    require('../stories/LastMessage.stories');
    require('../stories/LeftPanel.stories');
    require('../stories/OwnProposalCard.stories');
    require('../stories/Overlay.stories');
    require('../stories/ProgressBar.stories');
    require('../stories/ProposalCard.stories');
    require('../stories/RoundedIcon.stories');
    require('../stories/RoundedImage.stories');
    require('../stories/SelectInline.stories');
    require('../stories/StepsBar.stories');
    require('../stories/Tabs.stories');
    require('../stories/TopBar.stories');
    require('../stories/TopNavBar.stories');

    // require as many stories as you need.
}

configure(loadStories, module);