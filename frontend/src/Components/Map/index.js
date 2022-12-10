import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import Header from '../header';
import Top_Nav_Menu from '../top_nav_menu';
import Footer from '../footer';

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
          document.getElementById('c5name').innerHTML = json[4]['name'];
          document.getElementById('c6name').innerHTML = json[5]['name'];
          document.getElementById('c7name').innerHTML = json[6]['name'];
          document.getElementById('c8name').innerHTML = json[7]['name'];
          document.getElementById('c9name').innerHTML = json[8]['name'];
          document.getElementById('c10name').innerHTML = json[9]['name'];
          document.getElementById('c11name').innerHTML = json[10]['name'];
          document.getElementById('c12name').innerHTML = json[11]['name'];
          document.getElementById('c13name').innerHTML = json[12]['name'];

          document.getElementById('c1address').innerHTML = json[0]['address'];
          document.getElementById('c2address').innerHTML = json[1]['address'];
          document.getElementById('c3address').innerHTML = json[2]['address'];
          document.getElementById('c4address').innerHTML = json[3]['address'];
          document.getElementById('c5address').innerHTML = json[4]['address'];
          document.getElementById('c6address').innerHTML = json[5]['address'];
          document.getElementById('c7address').innerHTML = json[6]['address'];
          document.getElementById('c8address').innerHTML = json[7]['address'];
          document.getElementById('c9address').innerHTML = json[8]['address'];
          document.getElementById('c10address').innerHTML = json[9]['address'];
          document.getElementById('c11address').innerHTML = json[10]['address'];
          document.getElementById('c12address').innerHTML = json[11]['address'];
          document.getElementById('c13address').innerHTML = json[12]['address'];


          document.getElementById('c1number').innerHTML = json[0]['phone_number'];
          document.getElementById('c2number').innerHTML = json[1]['phone_number'];
          document.getElementById('c3number').innerHTML = json[2]['phone_number'];
          document.getElementById('c4number').innerHTML = json[3]['phone_number'];
          document.getElementById('c5number').innerHTML = json[4]['phone_number'];
          document.getElementById('c6number').innerHTML = json[5]['phone_number'];
          document.getElementById('c7number').innerHTML = json[6]['phone_number'];
          document.getElementById('c8number').innerHTML = json[7]['phone_number'];
          document.getElementById('c9number').innerHTML = json[8]['phone_number'];
          document.getElementById('c10number').innerHTML = json[9]['phone_number'];
          document.getElementById('c11number').innerHTML = json[10]['phone_number'];
          document.getElementById('c12number').innerHTML = json[11]['phone_number'];
          document.getElementById('c13number').innerHTML = json[12]['phone_number'];

          document.getElementById('c1bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out </a> '
          document.getElementById('c2bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c3bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c4bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c5bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out </a> '
          document.getElementById('c6bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c7bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c8bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c9bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out </a> '
          document.getElementById('c10bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c11bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c12bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out  </a> '
          document.getElementById('c13bholder').innerHTML = 
          '<a href="http://localhost:3000/studios"> Check it out </a> '
         
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
      <div>
      <Header />
      <Top_Nav_Menu />
      <MyMapComponent 
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
                  <tr class="studioRow" id="c5">
                    <td id="c5name">  </td>
                    <td  id="c5address">  </td>
                    <td id="c5number">  </td>
                    <td id="c5bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c6">
                    <td id="c6name">  </td>
                    <td  id="c6address">  </td>
                    <td id="c6number">  </td>
                    <td id="c6bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c7">
                    <td id="c7name">  </td>
                    <td  id="c7address">  </td>
                    <td id="c7number">  </td>
                    <td id="c7bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c8">
                    <td id="c8name">  </td>
                    <td  id="c8address">  </td>
                    <td id="c8number">  </td>
                    <td id="c8bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c9">
                    <td id="c9name">  </td>
                    <td  id="c9address">  </td>
                    <td id="c9number">  </td>
                    <td id="c9bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c10">
                    <td id="c10name">  </td>
                    <td  id="c10address">  </td>
                    <td id="c10number">  </td>
                    <td id="c10bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c11">
                    <td id="c11name">  </td>
                    <td  id="c11address">  </td>
                    <td id="c11number">  </td>
                    <td id="c11bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c12">
                    <td id="c12name">  </td>
                    <td  id="c12address">  </td>
                    <td id="c12number">  </td>
                    <td id="c12bholder">  </td>
                  </tr>
                  <tr class="studioRow" id="c13">
                    <td id="c13name">  </td>
                    <td  id="c13address">  </td>
                    <td id="c13number">  </td>
                    <td id="c13bholder">  </td>
                  </tr>
                  

                </tbody>
            </table>
        <Footer />
      </div>
     


    )
  }
}

export default MapLoader;




