import React,{useState,useEffect} from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import './App.css';
import Header from "./components/header/header";
import List from "./components/List/list";
import Map from "./components/Map/map";
import {getPlaceData,getWeatherData} from './api';



// import PlaceDetails from "./components/PlaceDetails/placeDetails";

function App() {
  const [coordinates,setCoordinates]=useState({});
  const [bounds,setBounds]=useState({});

  const [weatherData,setWeatherData]=useState([])

  const [places,setPlaces]=useState([]);
  const [filterplaces,setFilterplaces]=useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const[isLoading,setIsLoading]=useState(false)
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>
    {
      setCoordinates({lat:latitude,lng:longitude});
    })
  },[]);

  useEffect(()=>{
    const filteredPlaces=places.filter((place)=>place.rating>rating)
    setFilterplaces(filteredPlaces)
  },[rating]);

  useEffect(()=>
  { if(bounds.sw && bounds.ne){
    setIsLoading(true);

    getWeatherData(coordinates.lat,coordinates.lng)
        .then((data)=> setWeatherData(data))


    getPlaceData(type,bounds.sw,bounds.ne)
        .then((data)=> {
          
          setPlaces(data?.filter((place)=> place.name && place.num_reviews>0));
          setFilterplaces([]);
          setIsLoading(false);
        })
      }
  },[type,bounds]);

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid items xs={12} md={4}>
          <List place={filterplaces.length?filterplaces: places} 
           childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid items xs={12} md={8}>
          <Map 
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filterplaces.length?filterplaces: places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
     
      
    </>
  );
}

export default App;
