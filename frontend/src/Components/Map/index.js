import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const  key = "AIzaSyAoaeqCybD4qXceoxt6gqB-guv4_ZCEKMM"

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key="+key+"&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    onClick={ev => {
      console.log("latitide = ", ev.latLng.lat());
      console.log("longitude = ", ev.latLng.lng());
    }}
    defaultZoom={3}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.isMarkerShown && (
      <Marker
        position={{ lat: -34.397, lng: 150.644 }}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

class MapLoader extends React.PureComponent {
  state = {
    isMarkerShown: false
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  render() {
    return (
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}
export default MapLoader;









// import {Component} from "react";
// import {Map, GoogleApiWrapper, GoogleMap} from 'google-maps-react'


// class MapLoader extends Component{
//     render(){
//         return (
//           //   <Map google = {this.props.google}
//           //   style = {{width:"100%", height:"100%"}}
//           // zoom = {10}
//           // initialCenter = {
//           //   {lat:44,
//           //   log:-79
//           //   }
//           // }></Map>

//           <GoogleMap
//           onClick={ev => {
//             console.log("latitide = ", ev.latLng.lat());
//             console.log("longitude = ", ev.latLng.lng());
//           }}
//           defaultZoom={3}
//           defaultCenter={{ lat: -34.397, lng: 150.644 }}
//         ></GoogleMap>
//         )
//     }
// }

// export  default GoogleApiWrapper({apiKey: "AIzaSyAoaeqCybD4qXceoxt6gqB-guv4_ZCEKMM"})(MapLoader)