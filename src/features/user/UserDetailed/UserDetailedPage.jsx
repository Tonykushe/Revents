import React, {Component} from 'react';
import {Button, Grid, Segment} from "semantic-ui-react";
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedAbout from './UserDetailedAbout'
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';

const query = ({ auth }) => {
    return [
        {
            collection: 'users',
            doc: auth.uid,
            subcollections: [{collection: 'photos'}],
            storeAs: 'photos'
        }
    ]
}



const mapState = (state) => ({
    profile: state.firebase.profile,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos
})


class UserDetailedPage extends Component {    
    render() {
        const { profile, photos } = this.props
        return (
            <Grid>
                <UserDetailedHeader profile={profile}/>
                <UserDetailedAbout profile={profile}/>
                
                <Grid.Column width={4}>
                    <Segment>
                        <Button as={Link} to='/settings'color='teal' fluid basic content='Edit Profile'/>
                    </Segment>
                </Grid.Column>
                <UserDetailedPhotos photos={photos} />
                <UserDetailedEvents />
            </Grid>

        );
    }
}

export default compose(
        connect(mapState),
        firestoreConnect(auth => query(auth))
        )(UserDetailedPage);