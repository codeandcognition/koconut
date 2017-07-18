import {configure, setAddon} from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import {exampleQuestions} from '../backend/Questions';

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
import ShortResponse from '../ui/components/ShortResponse';

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
            question={exampleQuestions[3]}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'ShortResponse Problem',
    '',
    () => (
        <Problem
            question={exampleQuestions[4]}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'FillBlank Problem',
    '',
    () => (
        <Problem
            question={exampleQuestions[1]}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'HighlightCode Problem',
    '',
    () => (
        <Problem
            question={exampleQuestions[2]}
        />
    ),
    {inline: true},
);

storiesOf('Problem', module).addWithInfo(
    'WriteCode Problem',
    '',
    () => (
        <Problem
            question={exampleQuestions[0]}
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

storiesOf('ShortReponse', module).addWithInfo(
    'ShortResponse Component',
    'Example short response form',
    () => (
        <ShortResponse />
    ),
);