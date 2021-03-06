import React from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import Loading from './components/Loading';
import axios from 'axios';
import Weather from './Weather';
import { API_KEY } from './src/constant';


export default class extends React.Component {

  state = {
    isLoading: true,
  };

  getWeather = async (lat, lon) => {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
    const { data: { main: { temp }, weather } } = response;
    this.setState({ isLoading : false, temp, condition: weather[0].main })
  }

  getLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync();
      const { coords: { latitude, longitude } } = location;
      this.getWeather(latitude, longitude);
      console.log(location);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad")
    }
  }

  componentDidMount() {
    this.getLocation()
  }

  render() {

    const { isLoading, temp, condition } = this.state;

    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
  }
}
