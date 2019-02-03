import React, { Component } from 'react';
import { Segment, Comment, Header } from "semantic-ui-react";
import EventChatForm from './EventChatForm'
import distanceInWords from 'date-fns/distance_in_words'
import { Link } from "react-router-dom";


class EventDetailChat extends Component {

    state = {
        showReplyForm: false,
        selectedCommentId: null
    }

    handleOpenReplyForm = (id) => () => {
        this.setState({
            showReplyForm: true,
            selectedCommentId: id
        })
    }

    handleCloseReplyForm = () => {
        this.setState({
            selectedCommentId: null,
            showReplyForm: false
        })
    }

    render() {
        const { addEventComment, eventId, eventChat } = this.props
        const { showReplyForm, selectedCommentId } = this.state
        return (
            <div>
                <Segment
                    textAlign="center"
                    attached="top"
                    inverted
                    color="teal"
                    style={{ border: 'none' }}
                >
                    <Header>Chat about this event</Header>
                </Segment>

                <Segment attached>
                    <Comment.Group>
                        {eventChat && eventChat.map((comment) => (
                            <Comment key={comment.id}>
                                <Comment.Avatar src={comment.photoURL || "/assets/user.png"} />
                                <Comment.Content>
                                    <Comment.Author as={Link} to={`/profile/${comment.uid}`}>{comment.displayName}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>{distanceInWords(comment.date, Date.now())}</div>
                                    </Comment.Metadata>
                                    <Comment.Text>{comment.text}</Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action onClick={this.handleOpenReplyForm(comment.id)}>Reply</Comment.Action>
                                        {showReplyForm && selectedCommentId === comment.id &&
                                            <EventChatForm 
                                                addEventComment={addEventComment} 
                                                eventId={eventId} 
                                                form={`reply_${comment.id}`}
                                                closeForm = {this.handleCloseReplyForm}
                                            />
                                        }
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>
                        ))}

                    </Comment.Group>
                    <EventChatForm 
                        addEventComment={addEventComment} 
                        eventId={eventId} 
                        form={'newComment'}
                    />
                </Segment>
            </div>
        );
    }
}


export default EventDetailChat
