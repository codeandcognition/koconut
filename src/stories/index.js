import {configure, setAddon} from '@storybook/react';
import infoAddon from '@storybook/addon-info';

setAddon(infoAddon);

configure(function() {
  //...
}, module);

import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Button, Welcome} from '@storybook/react/demo';

import App from '../ui/containers/App';
import Information from '../ui/containers/Information';
import Problem from '../ui/containers/Problem';
import Question from '../ui/components/Question';
import Response from '../ui/components/Response';
import Choice from '../ui/components/Choice';
import Code from '../ui/components/Code';
import MultipleChoice from '../ui/components/MultipleChoice';

storiesOf('App', module).addWithInfo(
    'App Component',
    'Simple usage of the App component. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad, beatae distinctio et fugiat molestiae natus nihil quasi tenetur voluptatibus. A aperiam dolorum et facilis id ipsam nulla repellat saepe?',
    () => (
        <App className="App" prop="property"/>
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'MultipleChoice Problem',
    '',
    () => (
        <Problem
            question={{
              prompt: 'What is x after the following code executes?',
              code: 'int x = 1;',
              type: 'MultipleChoice',
              answers: ['0', '1', '2', '3']
            }}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'ShortResponse Problem',
    '',
    () => (
        <Problem
            question={{
              prompt: 'What is x after the following code executes?',
              code: 'int x = 1;',
              type: 'ShortResponse',
            }}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'FillBlank Problem',
    '',
    () => (
        <Problem
            question={{
              prompt: 'What is x after the following code executes?',
              code: 'int x = 1;\nint y = (*);\nint z = 5;',
              type: 'FillBlank',
            }}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'HighlightCode Problem',
    '',
    () => (
        <Problem
            question={{
              prompt: 'Highlight the expression that evaluates to false.',
              code: 'int x = 2;\nif(x > 5) {\n\tx -= 5;\n}',
              type: 'HighlightCode',
            }}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'WriteCode Problem',
    '',
    () => (
        <Problem
            question={{
              prompt: 'Write an expression that evaluates the sum of x, y, and z.',
              code: 'int x = 1;\nint y = 2;\nint z = 3;',
              type: 'WriteCode',
            }}
        />
    ),
    {inline: true},
);

storiesOf('MultipleChoice', module).addWithInfo(
    'MultipleChoice Component',
    'Example choices',
    () => (
        <MultipleChoice answers={['A', 'B', 'C']}/>
    ),
);

storiesOf('Choice', module).addWithInfo(
    'Choice Component',
    'Example choice with content.',
    () => (
        <Choice className="choice" content="Example"/>
    ),
);

