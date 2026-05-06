import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { FlatList } from 'react-native';


export default function App() {
//Hook de react usestate (estado)
const [pokemon, setPokemon] = useState([]);

//funcion para llamar una API
//fetch
//async await

const getPokemon = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();
    console.log("Pokemon", data);   
    setPokemon(data.results);

} catch (error) {
    console.error("ERROR: No fue posible obtener los pokemones", error);
}
};

useEffect(() => {
  getPokemon();
}, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
          <Text>Pokedex</Text>
          <Text>Pokémon List</Text>
          <FlatList
            data={pokemon}
            renderItem={({item}) => <Text>{item.name}</Text>}
            keyExtractor={item => item.name}
          />
        </View>
        <View style={styles.details}></View>
      </SafeAreaView>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  list: {
    flex: 0.5,
    backgroundColor: "red",
  },
  details: {
    flex: 0.5,
    backgroundColor: "green",
  }
});

