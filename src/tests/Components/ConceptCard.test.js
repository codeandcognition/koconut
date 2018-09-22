import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConceptCard from '../../ui/koconut/components/ConceptCard';

// configure enzyme to work with React version 16
Enzyme.configure({ adapter: new Adapter() });

describe('<ConceptCard /> component', () => {
  const generateExercise = jest.fn()
    .mockImplementation((a,b) => {return {concept: a, type: b}});
  const getInstruction = jest.fn()
    .mockImplementation((a,b) => {return {concept: a, type: b}});
  const title = "abc";
  const key = 2;
  const concept = "zxcv";
  
  it('Mounts correctly with props', () => {
    const wrapper = mount(<ConceptCard 
      title={title}
      key={key}
      concept={concept}
      generateExercise={generateExercise}
      getInstruction={getInstruction}
      />);
    expect(wrapper.state().expand).toBe(false);
    const wrapperProps = wrapper.props();
    expect(wrapperProps.title).toBe(title);
    expect(wrapperProps.concept).toBe(concept);
    wrapper.unmount();
  });

  it('handleExpandClick changes once correctly', () => {
    const wrapper = shallow(<ConceptCard 
      title={title}
      key={key}
      concept={concept}
      generateExercise={generateExercise}
      getInstruction={getInstruction}
      />);
    
    expect(wrapper.state().expand).toBe(false);
    wrapper.instance().handleExpandClick();
    expect(wrapper.state().expand).toBe(true);
    wrapper.unmount();
  });

  it('handleExpandClick changes multiple times correctly', () => {
    const wrapper = shallow(<ConceptCard 
      title={title}
      key={key}
      concept={concept}
      generateExercise={generateExercise}
      getInstruction={getInstruction}
      />);
    
    expect(wrapper.state().expand).toBe(false);
    wrapper.instance().handleExpandClick();
    expect(wrapper.state().expand).toBe(true);

    for(let i = 0; i < 50; i++) {
      let bool = i % 2 == 1;
      wrapper.instance().handleExpandClick();
      expect(wrapper.state().expand).toBe(bool);
    }
    wrapper.unmount();
  });

  // this test may be modified if we do not use a single 'p' tag
  // to contain the title anymore
  it('renders with the title somewhere', () => {
    const wrapper = shallow(<ConceptCard 
      title={title}
      key={key}
      concept={concept}
      generateExercise={generateExercise}
      getInstruction={getInstruction}
      />);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(title);
    wrapper.unmount();
  })
  
  // again, this test may be modified later on if we choose
  // to rewrite parts of the code. 
  // This assumes the thing being clicked is the first inner div:
  //    <div>
  //      <div onClick={expand}>
  //      </div>
  //      {expand &&
  //        <div><p></p><p></p><p></p><p></p></div>
  //      }
  //    <div>
  it('makes more p tags appear when expanding', () => {
    const wrapper = shallow(<ConceptCard 
      title={title}
      key={key}
      concept={concept}
      generateExercise={generateExercise}
      getInstruction={getInstruction}
      />);
    expect(wrapper.find('div').length).toBe(2);
    wrapper.find('div').at(1).simulate('click');
    expect(wrapper.find('div').length).toBe(5);
    expect(wrapper.find('div').at(2).find('a').length).toBe(0);
    wrapper.unmount();
  });

  // this test builds on the previous test
  // it('clicking the get buttons call the correct function', () => {
  //   const wrapper = shallow(<ConceptCard 
  //     title={title}
  //     key={key}
  //     concept={concept}
  //     generateExercise={generateExercise}
  //     getInstruction={getInstruction}
  //     />);
  //   expect(wrapper.find('div').length).toBe(2);
  //   wrapper.find('div').at(1).simulate('click');
  //   expect(wrapper.find('div').length).toBe(5);
  //   const instructButtons = wrapper.find('div').at(2).find('a');
  //   expect(instructButtons.length).toBe(0);

  //   instructButtons.forEach(d => {
  //     d.simulate('click');
  //   });

  //   expect(generateExercise.mock.calls.length).toBe(0);
  //   expect(getInstruction.mock.calls.length).toBe(0);
    
  //   // first button
  //   expect(getInstruction.mock.calls[0][0]).toBe(concept);
  //   expect(getInstruction.mock.calls[0][1]).toBe("READ");
  //   expect(getInstruction.mock.results[0].value.concept).toBe(concept);
  //   expect(getInstruction.mock.results[0].value.type).toBe("READ");

  //   // second button
  //   expect(generateExercise.mock.calls[0][0]).toBe(concept);
  //   expect(generateExercise.mock.calls[0][1]).toBe("READ");
  //   expect(generateExercise.mock.results[0].value.concept).toBe(concept);
  //   expect(generateExercise.mock.results[0].value.type).toBe("READ");

  //   // third button
  //   expect(getInstruction.mock.calls[1][0]).toBe(concept);
  //   expect(getInstruction.mock.calls[1][1]).toBe("WRITE");
  //   expect(getInstruction.mock.results[1].value.concept).toBe(concept);
  //   expect(getInstruction.mock.results[1].value.type).toBe("WRITE");

  //   // fourth button
  //   expect(generateExercise.mock.calls[1][0]).toBe(concept);
  //   expect(generateExercise.mock.calls[1][1]).toBe("WRITE");
  //   expect(generateExercise.mock.results[1].value.concept).toBe(concept);
  //   expect(generateExercise.mock.results[1].value.type).toBe("WRITE");
  // });
})