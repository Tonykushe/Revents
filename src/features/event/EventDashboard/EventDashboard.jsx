import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import EventList from '../EventList/EventList'
import EventActivity from '../EventActivity/EventActivity'
import { deleteEvent } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const mapState = (state) => ({
    events: state.firestore.ordered.events,
})

const actions = {
    deleteEvent
}

class EventDashboard extends Component {

    deleteEventHandler = (eventId) => () => {
        this.props.deleteEvent(eventId)
    }
    render() {
        const {events} = this.props
        if (!isLoaded(events) || isEmpty(events)) {
            return <LoadingComponent inverted={true}/>
        }
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList 
                        deleteEvent={this.deleteEventHandler} 
                        events={events}/>
                </Grid.Column>

                <Grid.Column width={6}>
                    <EventActivity/>
                </Grid.Column>

            </Grid>
        );
    }
}

export default connect(mapState, actions)(firestoreConnect([{collection: 'events'}])(EventDashboard));