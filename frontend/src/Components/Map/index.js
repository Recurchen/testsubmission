import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import StudiosAPIContext from '../../Contexts/StudiosAPIContext';
import {useContext, useEffect, useState} from "react";
import StudiosTable from "../Studios/StudiosTable";
import { useNavigate, useLocation } from "react-router-dom";
// import {useContext, useEffect, useState} from "react";
const  key = "AIzaSyAoaeqCybD4qXceoxt6gqB-guv4_ZCEKMM"

const Nav = () => {
  console.log("activated")
  const { setStudios } = useContext(StudiosAPIContext);
  const navigate = useNavigate();
  const toNearMe = () => {
    navigate('/studios')
}

  // fetch(`http://localhost:8000/studio/all/`)
  //   .then(res => res.json())
  //   .then(json => {
  //       console.log(json);
  //       // setStudios(json);
  //     })
  

}

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
      // document.getElementById('position').innerHTML = `${ev.latLng.lat()}`
      // window.location.replace("http://localhost:3000/")
      fetch(`http://localhost:8000/studio/all/`, {
        method:"POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({location:`${ev.latLng.lat()},${ev.latLng.lng()}`},
        )
    })
        .then(res => res.json())
        .then(json => {console.log(json);
          document.getElementById('position').innerHTML = json[0]['name']})
    }}
    defaultZoom={10}
    defaultCenter={{ lat: 43, lng: -79 }}
  >
    {props.isMarkerShown && (
      <Marker
        position={{ lat: 43, lng: -79 }}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

class MapLoader extends React.Component {
// const MapLoader = () => {
  state = {
    isMarkerShown: false,
    position: ''
  }

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    console.log('clickedd')
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

   handleMarkerClick = () => {
    // const { setStudios } = useContext(StudiosAPIContext);
    console.log('clicked')
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  

  render() {
    // const [params, setParams] = useState({input: ""})
    return (
      <div onClicked={console.log("changed")}>
      <MyMapComponent onClicked={console.log("CHanged")}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick, console.log("hi")}
      />
      <h1 id="position"> Here</h1>
      </div>
     


    )
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