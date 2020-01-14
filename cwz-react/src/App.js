import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store.js'
import routes from './config/routes.js';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import Index from './pages/index/index';
const RouteWithSubRoutes = route => (
  <Route
    exact
    path={route.path}  
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);

const RouteConfigExample = () => (
  <Provider store={store}>
    <Router>
      <div>
          <CacheRoute exact path='/' component={Index} when="forward"/>
          {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}  
      </div>
    </Router>
  </Provider>
);

export default RouteConfigExample;
