import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  
  const [pokemon, setPokemon] = useState([]);
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
  const [detallesPokemon, setDetallesPokemon] = useState(null);

  const getUnPokemon = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      const data = await response.json();
      setPokemon(data.results);
    } catch (error) {
      console.log("ERROR. No fue posible acceder a la API");
    }
  };

  const getPokemon = async (item) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.name}`);
      const data = await response.json();
      setDetallesPokemon(data);
    } catch (error) {
      console.log("ERROR. No fue posible acceder a la API");
    }
  };

  useEffect(() => {
    getUnPokemon();
  }, []);

  useEffect(() => {
    if (pokemonSeleccionado) {
      getPokemon(pokemonSeleccionado);
    }
  }, [pokemonSeleccionado]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lista}>
        <Text style={styles.titulo}>POKEAPP</Text>
        <Text style={styles.subtitulo}>Elige tu Pokémon:</Text>
        <FlatList
          data={pokemon}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
              onPress={() => setPokemonSeleccionado(item)}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </Pressable>
          )}
          keyExtractor={(item) => item.url.split("/").filter(Boolean).pop()}
          contentContainerStyle={styles.listaContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.detalles}>
        {detallesPokemon ? (
          <View style={styles.pokemonCard}>
            <Image 
              style={styles.pokemonImage} 
              source={{ uri: detallesPokemon?.sprites?.front_default }} 
            />
            <Text style={styles.pokemonName}>{detallesPokemon.name}</Text>
            <Pressable 
              style={({ pressed }) => [
                styles.btnDetalles,
                pressed && { opacity: 0.8 } 
              ]} 
              onPress={() => navigation.navigate("detalles", { pokemon: detallesPokemon })}
            >
              <Text style={styles.btnText}>Ver Detalles</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.placeholder}>No se seleccionó ningún pokémon</Text>
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lista: {
    flex: 0.5,
    backgroundColor: "#D32F2F",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: "#FFCDD2",
    fontWeight: "bold",
    marginBottom: 15,
  },
  listaContent: { paddingBottom: 20 },
  item: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemPressed: {
    backgroundColor: "#F5F5F5",
    transform: [{ scale: 0.98 }],
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
    textAlign: "center",
  },
  detalles: {
    flex: 0.5,
    backgroundColor: "#121212", 
    justifyContent: "center",
    alignItems: "center",
  },
  pokemonCard: {
    backgroundColor: "#1E1E1E", 
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, 
    shadowRadius: 6,
  },
  pokemonImage: { width: 180, height: 180 },
  pokemonName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E0E0E0", 
    textTransform: "capitalize",
    marginBottom: 20,
  },
  btnDetalles: {
    backgroundColor: "#3B4CCA",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  placeholder: {
    color: "#9E9E9E",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
});