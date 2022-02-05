import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import {Fontisto} from '@expo/vector-icons';
import * as myapi from './secret.js';

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default function App() {

  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  const getWeather = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${myapi.APIKEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  }

  const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning"
  }

  useEffect(getWeather, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}><ActivityIndicator size="large"/></View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={50} color="white"/>
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )
      }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "cornflowerblue",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 38,
    fontWeight: "600",
    color: "white"
  },
  day: {
    flex: 1,
    marginLeft: 25,
    width: 385
  },
  temp: {
    fontSize: 120,
    marginTop: 50,
    marginRight: 80,
    color: "white"
  },
  description: {
    fontSize: 50,
    marginLeft: 10,
    color: "white"
  },
  tinyText: {
    fontSize: 20,
    marginLeft: 10,
    color: "white"
  }
});
