import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {model} from 'models/model';

model.init();

var rootEl = document.getElementById('root');

ReactDOM.render(<App model={model}/>, rootEl);

if (module.hot) {
  module.hot.accept('./App', function () {
    var NextApp = require('./App');
    ReactDOM.render(<NextApp model={model}/>, rootEl);
  });
}
