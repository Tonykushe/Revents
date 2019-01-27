import moment from "moment";
import cuid from 'cuid';
import { toastr } from "react-redux-toastr";
import { asyncActionStart, asyncActionFinish, asyncActionError } from "../async/asyncActions";
import firebase from '../../app/config/firebase';
import { ASYNC_ACTION_ERROR, ASYNC_ACTION_FINISH } from "../async/asyncConstants";
import { FETCH_EVENTS } from "../event/eventConstants";

export const updateProfile = (user) => {
    return async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase()
        const {isLoaded, isEmpty, ...updatedUser} = user;
        if (updatedUser.dateOfBirth) {
            updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
        }

        try {
            await firebase.updateProfile(updatedUser);
            toastr.success('Success', 'Profile Updated')
        } catch (error) {
            console.log(error);   
        }
    }
}

export const uploadProfileImage = (file, fileName) => 
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const imageName = cuid()
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;
        const options = {
            name: imageName
        };
        try {
            dispatch(asyncActionStart())
            // upload the file to firebase storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options);
            // get the image url
            let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
            // get userdoc
            let userDoc = await firestore.get(`users/${user.uid}`)
            // check if user has a photo, if not update the profile with image
            if (!userDoc.data().photoURL) {
                await firebase.updateProfile({
                    photoURL: downloadURL
                })
                await user.updateProfile({
                    photoURL: downloadURL
                })
            }
            // add the new photo to the photos collection
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
            }, {
                name: imageName,
                url: downloadURL
            })
            dispatch(asyncActionFinish())
        } catch (error) {
            console.log(error);
            dispatch(asyncActionError())
            throw new Error('Problem uploading photo')
            
        }
    }

export const deletePhoto = photo => 
        async (dispatch, getState, { getFirebase, getFirestore }) => {
            const firebase = getFirebase();
            const firestore = getFirestore();
            const user = firebase.auth().currentUser;
            try {
                await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
                await firestore.delete({
                    collection: 'users',
                    doc: user.uid,
                    subcollections: [{ collection: 'photos', doc: photo.id }]
                });
            } catch (error) {
                console.log(error);
                throw new Error('Problem deleting the photo');
            }
        };

export const setMainPhoto = photo => 
        async (dispatch, getState, {getFirebase}) => {
            const firebase = getFirebase();
            try {
                return await firebase.updateProfile({
                    photoURL: photo.url
                });
            } catch (error) {
                console.log(error);
                throw new Error('Problem setting main photo')
            }
        }

export const goingToEvent = (event) => 
        async (dispatch, getState, {getFirestore}) => {
            const firestore = getFirestore();
            const user = firestore.auth().currentUser;
            const photoURL = getState().firebase.profile.photoURL;
            const attendee = {
                going: true,
                joinDate: Date.now(),
                photoURL: photoURL || '/assets/user.png',
                displayName: user.displayName,
                host: false
            }
            try {
                await firestore.update(`events/${event.id}`, {
                    [`attendees.${user.uid}`] : attendee
                })

                await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
                    eventId: event.id,
                    userUid: user.uid,
                    eventDate: event.date,
                    host: false
                })
                toastr.success('Success', 'You have signed up to the event')
            } catch (error) {
                console.log(error);
                toastr.error('Oops', 'Problem signing up to event')
            }
        }


export const cancelGoingToEvent = (event) => 
        async (dispatch, getState, {getFirestore}) => {
            const firestore = getFirestore();
            const user = firestore.auth().currentUser;
            try {
                await firestore.update(`events/${event.id}`, {
                    [`attendees.${user.uid}`] : firestore.FieldValue.delete()
                })
                await firestore.delete(`event_attendee/${event.id}_${user.id}`);
                toastr.success('Success', 'You have removed yourself from the event')
            } catch (error) {
                console.log(error);
                toastr.error('Oops', 'Something went wrong')
            }
        }

export const getUserEvents = (userUid, activeTab) => 
        async (dispatch, getState) => {
            dispatch(asyncActionStart());
            const firestore = firebase.firestore();
            const today = new Date(Date.now());
            let eventsRef = firestore.collection('event_attendee');
            let query;
            switch (activeTab) {
              case 1: // Past events
                    query = eventsRef
                    .where("userUid", "==", userUid)
                    .where("eventDate", "<=", today)
                    .orderBy("eventDate", "desc");
                break;
              case 2: // Future events
                    query = eventsRef
                    .where("userUid", "==", userUid)
                    .where("eventDate", ">=", today)
                    .orderBy("eventDate");
                    break;
              case 3: // Hosted events
                    query = eventsRef
                    .where("userUid", "==", userUid)
                    .where("host", "==", true)
                    .orderBy("eventDate", "desc");
                    break;

              default:
                    query = eventsRef
                    .where("userUid", "==", userUid)
                    .orderBy("eventDate", "desc");
                    break;
            }
            try {
                let querySnap = await query.get();
                let events = [];

                for (let i = 0; i < querySnap.docs.length; i++) {
                    let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get()
                    events.push({...evt.data(), id: evt.id})
                }

                dispatch({
                    type: FETCH_EVENTS,
                    payload: {events}
                })


                dispatch(asyncActionFinish())
                
            } catch (error) {
                console.log(error);
                dispatch(asyncActionError())
            }
        }