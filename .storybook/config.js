/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories/index');
}

configure(loadStories, module);

import infoAddon, { setDefaults } from '@storybook/addon-info';

// addon-info
setDefaults({
    inline: true,
    maxPropsIntoLine: 1,
    maxPropObjectKeys: 10,
    maxPropArrayLength: 10,
    maxPropStringLength: 100,
});
setAddon(infoAddon);