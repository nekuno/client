import React from 'react';
import UnconnectedNetworkCard from '../../../src/js/components/ui/UnconnectedNetworkCard/UnconnectedNetworkCard.js';
import styles from '../../../src/js/components/ui/UnconnectedNetworkCard/UnconnectedNetworkCard.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test UnconnectedNetworkCard component', () => {
    const mockFn = jest.fn();
    const unconnectednetworkcard = shallow(<UnconnectedNetworkCard onClickHandler={mockFn}>Lorem ipsum</UnconnectedNetworkCard>);

    it('should be defined', () => {
        expect(unconnectednetworkcard).toBeDefined();
    });
    it('should render correctly', () => {
        expect(unconnectednetworkcard).toMatchSnapshot();
    });
    it('UnconnectedNetworkCard click event', () => {
        unconnectednetworkcard.find(`.${styles.unconnectednetworkcard}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
