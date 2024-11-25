import { View } from 'react-native';
import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps'; 
//pedir permissao ao usuario
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location'

import { styles } from './styles';


export default function App() {
    //importar lá em cima 
    const [location, setLocation] = useState<LocationObject | null>(null); 

  //criando uma funcao assincrona
  async function requestLocationPermissions() {
    //aguarda a autorizacao do usuario
    const {granted} = await requestForegroundPermissionsAsync(); 

    if (granted) {
      const currentPosition = await getCurrentPositionAsync(); 
      //guarda nesse estado a posicao atual
      setLocation(currentPosition); 

    
    }
  }

  //usando a funcao renderizada pelo método
  useEffect(() =>{
    requestLocationPermissions(); 
  }, []);

  useEffect(() => {
    //acompanha quando ha alteracao na posicao 
    watchPositionAsync({
     //adicionando as propriedades
      accuracy: LocationAccuracy.Highest, //ver se importou lá em cima
     //intervalo 
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => { //mostra os detalhes da mudança em tempo real
      setLocation(response);
    });
    },[]); 
  
  return (
    <View style={styles.container}>
      { //colocar dentro das chaves
      //pegar a localizacao de verdade 
      location && //se tem localizacao utiliza o mapa
        <MapView
        style = {styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          //o quao proximo vai ficar o mapa
          latitudeDelta: 0.005, 
          longitudeDelta: 0.005
        }}
      >
        <Marker 
        //adiciona o marcador 
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
        /> 
      </MapView>
      
      }
      
      
    </View>
  );
};
