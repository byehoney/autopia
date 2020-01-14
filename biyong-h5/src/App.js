import React from 'react';
import { HashRouter as Router, Route ,Link} from "react-router-dom";
import './App.css';
import routes from './config/routes';

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
function App() {
  return (
    <Router>
      <div>
          {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}  
      </div>
    </Router>
  );
}

export default App;
