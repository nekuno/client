import React from 'react';
import OwnProposalsOtherList from '../../../src/js/components/ui/OwnProposalsOtherList/OwnProposalsOtherList.js';
import styles from '../../../src/js/components/ui/OwnProposalsOtherList/OwnProposalsOtherList.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test OwnProposalsOtherList component', () => {
    const mockFn = jest.fn();
    const ownproposalsotherlist = shallow(<OwnProposalsOtherList onClickHandler={mockFn}>Lorem ipsum</OwnProposalsOtherList>);

    it('should be defined', () => {
        expect(ownproposalsotherlist).toBeDefined();
    });
    it('should render correctly', () => {
        expect(ownproposalsotherlist).toMatchSnapshot();
    });
    it('OwnProposalsOtherList click event', () => {
        ownproposalsotherlist.find(`.${styles.ownproposalsotherlist}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
