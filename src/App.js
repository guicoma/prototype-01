import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Transfer from './components/Transfer';
import Login from './components/Login';
import Group from './components/Groups/Group';

import './App.css';


class App extends Component {

  render() {
    return (
      <Router>
        <div className="proto-container">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/transfer">Transfer</Link></li>
            <li><Link to="/groups">Group</Link></li>
          </ul>

          <div className="proto-shelf">
            <Route exact path="/" component={Transfer} />
            <Route path="/login" component={Login} />
            <Route path="/transfer" component={Transfer} />
            <Route path="/groups" component={Group} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;