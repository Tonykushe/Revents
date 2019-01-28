import React, { Component } from 'react'
import { connect } from "react-redux";
import { withFirestore, firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Grid } from "semantic-ui-react";
import EventDetailHeader from './EventDetailHeader';
import EventDetailSidebar from './EventDetailSidebar';
import EventDetailChat from "./EventDetailChat";
import EventDetailInfo from './EventDetailInfo';
import { objectToArray } from "../../../app/utils/helpers";
import { goingToEvent, cancelGoingToEvent } from "../../user/UserActions";
import { addEventComment } from "../eventActions";

const mapState = (state, ownProps) => {
    let event = {}

    if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
        event = state.firestore.ordered.events[0];
    }
    return {
        event,
        auth: state.firebase.auth
    }
}

const actions = {
    goingToEvent,
    cancelGoingToEvent,
    addEventComment
}


class EventDetail extends Component {

    async componentDidMount() {
        const { firestore, match } = this.props;
        await firestore.setListener(`events/${match.params.id}`);
    }

    async componentWillUnmount() {
        const { firestore, match } = this.props;
        await firestore.unsetListener(`events/${match.params.id}`);
    }
    



    render() {
        const {event, auth, goingToEvent, cancelGoingToEvent, addEventComment} = this.props
        const attendees = event && event.attendees && objectToArray(event.attendees)
        const isHost = event.hostUid === auth.uid;
        const isGoing = attendees && attendees.some(a => a.id === auth.uid)
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventDetailHeader 
                        event={event} 
                        isHost={isHost} 
                        isGoing={isGoing} 
                        goingToEvent={goingToEvent}
                        cancelGoingToEvent={cancelGoingToEvent}
                    />
                    <EventDetailInfo event={event} />
                    <EventDetailChat addEventComment={addEventComment} eventId={event.id}/>

                </Grid.Column>
                <Grid.Column width={6}>
                    <EventDetailSidebar attendees={attendees} />
                </Grid.Column>
            </Grid>
        )
    }
}


export default compose(
    withFirestore,
    (connect(mapState, actions),
    firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
))(EventDetail)
