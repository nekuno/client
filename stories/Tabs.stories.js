import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TabList from '../src/js/components/ui/TabList/TabList.js';
import Tab from '../src/js/components/ui/Tab/Tab.js';
import TabPanel from '../src/js/components/ui/TabPanel/TabPanel.js';
import Frame from '../src/js/components/ui/Frame/Frame.js';
import Banner from '../src/js/components/ui/Banner/Banner.js';
import ProgressBar from '../src/js/components/ui/ProgressBar/ProgressBar.js';
import { Tabs } from 'react-tabs';

storiesOf('Tabs', module)
    .add('Two tabs', () => (
        <Tabs>
            <TabList>
                <Tab columns={2}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Tab>
                <Tab columns={2}>
                    Etiam et elit ante
                </Tab>
            </TabList>
            <TabPanel>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </TabPanel>
            <TabPanel>
                <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</h2>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
            </TabPanel>
        </Tabs>
    ))
    .add('Three tabs', () => (
        <Tabs>
            <TabList>
                <Tab columns={3}>
                    Lorem ipsum dolor sit amet
                </Tab>
                <Tab columns={3}>
                    Etiam et elit ante
                </Tab>
                <Tab columns={3}>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                </Tab>
            </TabList>
            <TabPanel>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </TabPanel>
            <TabPanel>
                <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</h2>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
            </TabPanel>
            <TabPanel>
                <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</div>
            </TabPanel>
        </Tabs>
    ))
    .add('Three tabs with other components', () => (
        <Tabs>
            <TabList>
                <Tab columns={3}>
                    Lorem ipsum
                </Tab>
                <Tab columns={3}>
                    Etiam et elit ante
                </Tab>
                <Tab columns={3}>
                    Sed ut perspiciatis
                </Tab>
            </TabList>
            <TabPanel>
                <Frame>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Frame>
            </TabPanel>
            <TabPanel>
                <Banner onClickHandler={action('click')} onSkipHandler={action('skip')} title="Banner title" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut" buttonText="Action" skipText="Skip" icon="comments"/>
            </TabPanel>
            <TabPanel>
                <ProgressBar size={'large'} percentage={50} title="Progress bar" onClickHandler={action('click')}/>
            </TabPanel>
        </Tabs>
    ));