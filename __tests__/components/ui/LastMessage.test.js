import React from 'react';
import LastMessage from '../../../src/js/components/ui/LastMessage/LastMessage.js';
import styles from '../../../src/js/components/ui/LastMessage/LastMessage.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test LastMessage component', () => {
    const mockFn = jest.fn();
    const userMockFn = jest.fn();
    const message = {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        createdAt: new Date('01-01-1981')
    };

    const lastMessage = shallow(<LastMessage slug={'johndoe'} username={'JohnDoe'} photo={'http://via.placeholder.com/100x100'} message={message} online={true} onUserClickHandler={userMockFn} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(LastMessage).toBeDefined();
    });
    it('should render correctly', () => {
        expect(lastMessage).toMatchSnapshot();
    });
    it('LastMessage click event', () => {
        lastMessage.find(`.${styles.text}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('LastMessage user click event', () => {
        lastMessage.find(`.${styles.photo}`).simulate('click');
        expect(userMockFn).toHaveBeenCalledTimes(1);
    });
});
