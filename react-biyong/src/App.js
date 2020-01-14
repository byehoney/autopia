import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider, connect } from 'react-redux';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import store from './redux/store.js'
import TopLineList from './pages/TopLineList';
import ServiceList from './pages/ServiceList';
import routes from './config/routes';
// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
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
          {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}  
          <CacheRoute exact path='/topLineList' component={TopLineList}/>
          <CacheRoute exact path='/serviceList' component={ServiceList}/>
      </div>
    </Router>
  </Provider>
);

export default RouteConfigExample;