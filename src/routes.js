import React from 'react';
import { Switch, Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'store/index';
import Layout from 'containers/layout';
import App from 'containers/app';
import CreatePerson from 'containers/createPerson';
import Person from 'containers/person';

const routes = (
  <ConnectedRouter history={history}>
    <Layout>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/person/create" component={CreatePerson} />
        <Route path="/person/:id" component={Person} />
      </Switch>
    </Layout>
  </ConnectedRouter>
);

export default routes;
