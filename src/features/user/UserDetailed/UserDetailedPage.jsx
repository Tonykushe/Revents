import React, {Component} from 'react';
import {Grid} from "semantic-ui-react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedAbout from './UserDetailedAbout'
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';
import UserDetailedSidebar from './UserDetailedSidebar';
import { userDetailedQuery } from "../UserQueries";


const mapState = (state, ownProps) => {
    let userUid = null;
    let profile = {};

    if (ownProps.match.params.id === state.auth.uid) {
        profile = state.firebase.profile
    } else {
        profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
        userUid = ownProps.match.params.id
    }
    return {
        profile,
        userUid,
        auth: state.firebase.auth,
        photos: state.firestore.ordered.photos
    }
    
}


class UserDetailedPage extends Component {    
    render() {
        const { profile, photos, auth, match } = this.props
        const iscurrentUser = auth.uid  === match.params.id
        return (
            <Grid>
                <UserDetailedHeader profile={profile}/>
                <UserDetailedAbout profile={profile}/>
                <UserDetailedSidebar iscurrentUser={iscurrentUser}/>
                <UserDetailedPhotos photos={photos} />
                <UserDetailedEvents />
            </Grid>

        );
    }
}

export default compose(
        connect(mapState),
        firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
        )(UserDetailedPage);