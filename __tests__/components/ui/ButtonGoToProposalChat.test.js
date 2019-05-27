import React from 'react';
import ButtonGoToProposalChat from '../../../src/js/components/ui/ButtonGoToProposalChat/ButtonGoToProposalChat.js';
import styles from '../../../src/js/components/ui/ButtonGoToProposalChat/ButtonGoToProposalChat.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ButtonGoToProposalChat component', () => {
    const mockFn = jest.fn();
    const buttongotoproposalchat = shallow(<ButtonGoToProposalChat onClickHandler={mockFn}>Lorem ipsum</ButtonGoToProposalChat>);

    it('should be defined', () => {
        expect(buttongotoproposalchat).toBeDefined();
    });
    it('should render correctly', () => {
        expect(buttongotoproposalchat).toMatchSnapshot();
    });
    it('ButtonGoToProposalChat click event', () => {
        buttongotoproposalchat.find(`.${styles.buttongotoproposalchat}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
