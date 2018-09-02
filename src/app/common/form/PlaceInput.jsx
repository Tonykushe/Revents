import React, { Component } from 'react'
import { Form, Label } from "semantic-ui-react";
import Script from 'react-load-script';
import PlacesAutoComplete from 'react-places-autocomplete'

const styles = {
    autocompleteContainer: {
        zIndex: 1000
    }
}

class PlaceInput extends Component {
    state = {
        scriptLoaded: false
    }

    handleScriptLoaded = () => this.setState({scriptLoaded: true})
    render() {
        const {input, onSelect, placeholder, options, meta: {touched, error}} = this.props
        return (
            <Form.Field error={touched && !!error}>
                <Script
                    url='https://maps.googleapis.com/maps/api/js?key=AIzaSyBeq2355IkvPuWI6rqb5f-XjDfeY2jgyKI&libraries=places'
                    onLoad={this.handleScriptLoaded}
                />
                {this.state.scriptLoaded && 
                    <PlacesAutoComplete
                        inputProps={{...input, placeholder}}
                        options={options}
                        onSelect={onSelect}
                        styles={styles}
                    />
                }
                {touched && error && <Label basic color='red'> {error} </Label>}
                
            </Form.Field>
        )
    }
}
export default PlaceInput
