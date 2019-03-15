import React from 'react';
import TabList from '../../../src/js/components/ui/TabList/TabList.js';
import Tab from '../../../src/js/components/ui/Tab/Tab.js';
import TabPanel from '../../../src/js/components/ui/TabPanel/TabPanel.js';
import { Tabs } from 'react-tabs';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Tabs component', () => {
    const tabs = shallow(
        <Tabs>
            <TabList>
                <Tab columns={2}>Foo</Tab>
                <Tab columns={2}>Bar</Tab>
            </TabList>
            <TabPanel>
                <div>Lorem ipsum.</div>
            </TabPanel>
            <TabPanel>
                <div>Etiam et elit ante</div>
            </TabPanel>
        </Tabs>
    );

    it('should be defined', () => {
        expect(Tabs).toBeDefined();
    });
    it('should render correctly', () => {
        expect(tabs).toMatchSnapshot();
    });
});
