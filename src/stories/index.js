import { configure, setAddon } from '@storybook/react';
import infoAddon from '@storybook/addon-info';

setAddon(infoAddon);

configure(function () {
    //...
}, module);

import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Button, Welcome} from '@storybook/react/demo';

import App from '../ui/containers/App';

storiesOf('Welcome', module).
    add('to Storybook', () => <Welcome showApp={linkTo('Button')}/>);

storiesOf('Button', module).
    add('with text',
        () => <Button onClick={action('clicked')}>Hello Button</Button>).
    add('with some emoji',
        () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('App', module)
    .addWithInfo(
        'Default App Component',
        'Simple usage of the App component. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad, beatae distinctio et fugiat molestiae natus nihil quasi tenetur voluptatibus. A aperiam dolorum et facilis id ipsam nulla repellat saepe?',
        () => (
            <App prop="property" />
        ),
    );