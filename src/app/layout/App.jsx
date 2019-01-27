import React, { Component } from 'react';
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import Loadable from 'react-loadable'
import LoadingComponent from './LoadingComponent'

const AsyncHomePage = Loadable({
    loader: () => import('../../features/home/HomePage'),
    loading: LoadingComponent
})

const AsyncEventForm = Loadable({
  loader: () => import("../../features/event/EventForm/EventForm"),
  loading: LoadingComponent
});

const AsyncNavBar = Loadable({
  loader: () => import("../../features/nav/NavBar/NavBar"),
  loading: LoadingComponent
});

const AsyncEventDashboard = Loadable({
    loader: () => import("../../features/event/EventDashboard/EventDashboard"),
  loading: LoadingComponent
});
const AsyncSettingsDashboard = Loadable({
    loader: () => import("../../features/user/Settings/SettingsDashboard"),
  loading: LoadingComponent
});
const AsyncUserDetailedPage= Loadable({
    loader: () => import("../../features/user/UserDetailed/UserDetailedPage"),
  loading: LoadingComponent
});
const AsyncPeopleDashboard = Loadable({
    loader: () => import("../../features/user/PeopleDashboard/PeopleDashboard"),
  loading: LoadingComponent
});
const AsyncEventDetailPage = Loadable({
  loader: () => import("../../features/event/EventDetail/EventDetail"),
  loading: LoadingComponent
});
const AsyncModalManager = Loadable({
  loader: () => import("../../features/modals/ModalManager"),
  loading: LoadingComponent
});


class App extends Component {
  render() {
    return (
        <div>
            <AsyncModalManager/>
            <Switch>
                <Route exact path='/' component={AsyncHomePage} />
            </Switch>

            <Route path='/(.+)' render={() => (
                <div>
                    <AsyncNavBar />
                    <Container className="main">
                        <Switch>
                            <Route path='/events' component={AsyncEventDashboard} />
                            {/* <Route path='/test' component={TestComponent} /> */}
                            <Route path='/event/:id' component={AsyncEventDetailPage} />
                            <Route path='/manage/:id' component={AsyncEventForm} />
                            <Route path='/people' component={AsyncPeopleDashboard} />
                            <Route path='/profile/:id' component={AsyncUserDetailedPage} />
                            <Route path='/settings' component={AsyncSettingsDashboard} />
                            <Route path='/createEvent' component={AsyncEventForm} />
                        </Switch>
                    </Container>
                </div>
            )} />
            
        </div> 
    );
  }
}

export default App; 