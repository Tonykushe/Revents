import React from 'react'
import { Grid, Segment, List, Item, Icon, Header } from "semantic-ui-react";
import format from 'date-fns/format';

const UserDetailedAbout = ({ profile }) => {
    let createdAt;
    if (profile.createdAt) {
        createdAt = format(profile.createdAt.toDate(), 'D MMM YYYY')
    }
    return (
        <Grid.Column width={12}>
            <Segment>
                <Grid columns={2}>
                    <Grid.Column width={10}>
                        <Header icon='smile' content={profile.displayName} />
                        <p>I am a: <strong>{profile.occupation}</strong></p>
                        <p>Originally from <strong>{profile.origin}</strong></p>
                        <p>Member Since: <strong>{createdAt}</strong></p>
                        <p>{profile.about}</p>

                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Header icon='heart outline' content='Interests' />
                        {profile.interests ? 
                            <List>
                                {profile.interests && profile.interests.map((interest, index) => (
                                    <Item key={index}>
                                        <Icon name='heart' />
                                        <Item.Content>{interest}</Item.Content>
                                    </Item>
                                ))}
                            </List> : <p>No Interests</p>
                        }
                    </Grid.Column>
                </Grid>

            </Segment>
        </Grid.Column>
    )
}

export default UserDetailedAbout
