import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import { firestoreConnect } from "react-redux-firebase";
import EventList from '../EventList/EventList'
import EventActivity from '../EventActivity/EventActivity'
import { deleteEvent } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const mapState = (state) => ({
    events: state.firestore.ordered.events,
    loading: state.async.loading
})

const actions = {
    deleteEvent
}

class EventDashboard extends Component {

    deleteEventHandler = (eventID) => () => {
        this.props.deleteEvent(eventID)
    }
    render() {
        const {events, loading} = this.props
        if (loading) {
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