import React from 'react'
import { Grid, Segment, Item, Header } from "semantic-ui-react";
import differenceinYears from 'date-fns/difference_in_years';

const UserDetailedHeader = ({ profile }) => {
    let age;
    if (profile.dateOfBirth) {
        age = differenceinYears(Date.now(), profile.dateOfBirth.toDate())
    } else {
        age = 'Unknown age'
    }
    return (
        <Grid.Column width={16}>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image avatar size='small' src={profile.photoURL || '/assets/user.png'} />
                        <Item.Content verticalAlign='bottom'>
                            <Header as='h1'>{profile.displayName}</Header>
                            <br />
                            <Header as='h3'>{profile.occupation}</Header>
                            <br />
                            <Header as='h3'>{age}, Lives in {profile.origin || 'Unknown city'}</Header>
                        </Item.Content>
                    </Item>
                </Item.Group>

            </Segment>
        </Grid.Column>
    )
}

export default UserDetailedHeader