import React from 'react'
import { Grid, Segment, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const UserDetailedSidebar = ({ iscurrentUser }) => {
    return (
        <Grid.Column width={4}>
            <Segment>
                {iscurrentUser ?
                    <Button as={Link} to='/settings' color='teal' fluid basic content='Edit Profile' /> :
                    <Button color='teal' fluid basic content='Follow' />
                }
            </Segment>
        </Grid.Column>
    )
}

export default UserDetailedSidebar
