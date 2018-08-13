import React, { Component } from 'react'
import EventListItem from './EventListItem'

class EventList extends Component {
    render() {
        const { events, eventOpen, deleteEvent } = this.props
        return (
            <div>
                {events.map((event) => (
                    <EventListItem 
                        key={event.id} 
                        event={event} 
                        eventOpen={eventOpen} 
                        deleteEvent={deleteEvent}/>
                ))}
                
            </div>
        );
    }
}

export default EventList
