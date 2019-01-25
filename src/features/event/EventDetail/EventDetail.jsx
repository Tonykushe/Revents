import React, { Component } from 'react'
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";
import { toastr } from "react-redux-toastr";
import { Grid } from "semantic-ui-react";
import EventDetailHeader from './EventDetailHeader';
import EventDetailSidebar from './EventDetailSidebar';
import EventDetailChat from "./EventDetailChat";
import EventDetailInfo from './EventDetailInfo';
import { objectToArray } from "../../../app/utils/helpers";

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


class EventDetail extends Component {

    async componentDidMount() {
        const { firestore, match, history } = this.props;
        let event = await firestore.get(`events/${match.params.id}`);
        if (!event.exists) {
            history.push('/events');
            toastr.error('Sorry', 'Event not found')
        }
    }



    render() {
        const {event, auth} = this.props
        const attendees = event && event.attendees && objectToArray(event.attendees)
        const isHost = event.hostUid === auth.uid;
        const isGoing = attendees && attendees.some(a => a.id === auth.uid)
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventDetailHeader event={event} isHost={isHost} isGoing={isGoing}/>
                    <EventDetailInfo event={event} />
                    <EventDetailChat />

                </Grid.Column>
                <Grid.Column width={6}>
                    <EventDetailSidebar attendees={attendees} />
                </Grid.Column>
            </Grid>
        )
    }
}


export default withFirestore(connect(mapState)(EventDetail))
