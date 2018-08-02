import React from 'react';
import CardUser from '../../../src/js/components/OtherUser/CardUser/CardUser.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test CardUser component', () => {
    const mockFn = jest.fn();
    const cardUser1 = shallow(
        <CardUser onClickHandler={mockFn}
                  photo={'http://via.placeholder.com/100x100'}
                  nickname={'JohnDoe'}
                  age={36}
                  city={'New York'}
                  gender={'Male'}
                  matching={76}
                  similarity={85}
                  coincidences={24}
                  networks={['facebook', 'twitter', 'steam']}
                  size="small"
                  resume="foo"
        />
    );
    const cardUser2 = shallow(
        <CardUser onClickHandler={mockFn}
                  photo={'http://via.placeholder.com/100x100'}
                  nickname={'JaneDoe'}
                  age={30}
                  city={'New Jersey'}
                  gender={'Female'}
                  matching={89}
                  similarity={34}
                  coincidences={101}
                  networks={['tumblr', 'spotify', 'instagram', 'facebook', 'twitter', 'steam']}
                  size="medium"
                  resume="bar"
        />
    );

    it('should be defined', () => {
        expect(CardUser).toBeDefined();
    });
    it('should render correctly', () => {
        expect(cardUser1).toMatchSnapshot();
        expect(cardUser2).toMatchSnapshot();
    });
});
