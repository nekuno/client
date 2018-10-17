import React from 'react';
import BottomNotificationBar from '../../../src/js/components/ui/BottomNotificationBar/BottomNotificationBar.js';
import styles from '../../../src/js/components/ui/BottomNotificationBar/BottomNotificationBar.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test BottomNotificationBar component', () => {
    const bottomNotificationBar = shallow(<BottomNotificationBar>Lorem ipsum</BottomNotificationBar>);

    it('should be defined', () => {
        expect(bottomNotificationBar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(bottomNotificationBar).toMatchSnapshot();
    });
});
