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
import './style.css'
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
          document.getElementById('c1name').innerHTML = json[0]['name'];
          document.getElementById('c2name').innerHTML = json[1]['name'];
          document.getElementById('c3name').innerHTML = json[2]['name'];
          document.getElementById('c4name').innerHTML = json[3]['name'];
          
          document.getElementById('c1bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> link </a> ';

          document.getElementById('c1address').innerHTML = json[0]['address'];
          document.getElementById('c2address').innerHTML = json[1]['address'];
          document.getElementById('c3address').innerHTML = json[2]['address'];
          document.getElementById('c4address').innerHTML = json[3]['address'];

          document.getElementById('c1number').innerHTML = json[0]['phone_number'];
          document.getElementById('c2number').innerHTML = json[1]['phone_number'];
          document.getElementById('c3number').innerHTML = json[2]['phone_number'];
          document.getElementById('c4number').innerHTML = json[3]['phone_number'];

          document.getElementById('c1bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out </a> '
          document.getElementById('c2bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c3bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c4bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '



        })
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
    return (
      <div onClicked={console.log("changed")}>
      <MyMapComponent onClicked={console.log("CHanged")}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick, console.log("hi")}
      />

      <h1> Closest </h1>
      <table className="plan_table">
                <thead>
                <tr class="row_title">
                    <th> Name </th>
                    <th> Address </th>
                    <th> Number </th>
                    <th> Studio Link</th>
                </tr>
                </thead>
                <tbody>

                <tr class="studioRow" id="c1">
                    <td id="c1name">  </td>
                    <td  id="c1address">  </td>
                    <td id="c1number">  </td>
                    <td id="c1bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c2">
                    <td id="c2name">  </td>
                    <td  id="c2address">  </td>
                    <td id="c2number">  </td>
                    <td id="c2bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c3">
                    <td id="c3name">  </td>
                    <td  id="c3address">  </td>
                    <td id="c3number">  </td>
                    <td id="c3bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c4">
                    <td id="c4name">  </td>
                    <td  id="c4address">  </td>
                    <td id="c4number">  </td>
                    <td id="c4bholder">  </td>
                  </tr>
                  {/* <tr class="studioRow" id="c1">
                    <td id="c1name">  </td>
                    <td  id="c1address">  </td>
                    <td id="c1number">  </td>
                    <td id="c1bholder">  </td>
                  </tr> */}

                </tbody>
            </table>
      </div>
     


    )
  }
}

export default MapLoader;




