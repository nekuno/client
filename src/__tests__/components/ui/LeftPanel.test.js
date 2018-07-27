import React from 'react';
import LeftPanel from '../../../js/components/ui/LeftPanel/LeftPanel.js';
import styles from '../../../js/components/ui/LeftPanel/LeftPanel.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test LeftPanel component', () => {
    const mockFn = jest.fn();
    const closeLeftPanel = shallow(<LeftPanel handleClickClose={mockFn} isOpen={false}>Lorem ipsum</LeftPanel>);
    const openLeftPanel = shallow(<LeftPanel handleClickClose={mockFn} isOpen={true}>Lorem ipsum</LeftPanel>);

    it('should be defined', () => {
        expect(LeftPanel).toBeDefined();
    });
    it('should render correctly', () => {
        expect(closeLeftPanel).toMatchSnapshot();
        expect(openLeftPanel).toMatchSnapshot();
    });
    it('LeftPanel click event', () => {
        openLeftPanel.find(`.${styles.outsideWrapper}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
