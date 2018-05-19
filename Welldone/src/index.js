import React from 'react';
import ReactDOM from 'react-dom';


import {Provider} from 'react-redux';

import store from './component/store/store.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './component/App';

import 'leaflet/dist/leaflet.css';

ReactDOM.render(
    <Provider store={store}>
       <App/>
    </Provider>,
    document.getElementById('app')
);
