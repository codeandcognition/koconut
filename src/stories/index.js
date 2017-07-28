import {configure, setAddon} from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import {exampleExercises} from '../backend/data/Exercises';

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
import Problem from '../ui/containers/Exercise';
import Question from '../ui/components/Question';
import Response from '../ui/containers/Response';
import Choice from '../ui/components/Choice';
import Code from '../ui/components/Code';
import MultipleChoice from '../ui/components/MultipleChoice';
import ShortResponse from '../ui/components/ShortResponse';
import Hint from '../ui/components/Hint';

storiesOf('App', module).addWithInfo(
    'App Component',
    'Simple usage of the App component. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad, beatae distinctio et fugiat molestiae natus nihil quasi tenetur voluptatibus. A aperiam dolorum et facilis id ipsam nulla repellat saepe?',
    () => (
        <App className="App" prop="property"/>
    ),
    {inline: true},
);

storiesOf('Exercise', module).addWithInfo(
    'MultipleChoice Exercise',
    '',
    () => (
        <Exercise
            question={exampleExercises[3]}
        />
    ),
    {inline: true},
);

storiesOf('Exercise', module).addWithInfo(
    'ShortResponse Exercise',
    '',
    () => (
        <Exercise
            question={exampleExercises[4]}
        />
    ),
    {inline: true},
);

storiesOf('Exercise', module).addWithInfo(
    'FillBlank Exercise',
    '',
    () => (
        <Exercise
            question={exampleExercises[1]}
        />
    ),
    {inline: true},
);

storiesOf('Exercise', module).addWithInfo(
    'HighlightCode Exercise',
    '',
    () => (
        <Exercise
            question={exampleExercises[2]}
        />
    ),
    {inline: true},
);

storiesOf('Exercise', module).addWithInfo(
    'WriteCode Exercise',
    '',
    () => (
        <Exercise
            question={exampleExercises[0]}
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

storiesOf('ShortResponse', module).addWithInfo(
    'ShortResponse Component',
    'Example short response form',
    () => (
        <ShortResponse/>
    ),
);

// storiesOf('Hint', module).addWithInfo(
//     'Hint Component',
//     'Example hint',
//     () => (
//
//     ),
// );