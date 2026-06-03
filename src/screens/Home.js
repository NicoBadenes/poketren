import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 20;

export default function Home() {
  const navigation = useNavigation();
  
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
  const [detallesPokemon, setDetallesPokemon] = useState(null);
  
  // Estados de carga
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fetchPokemons = async (currentOffset) => {
    if (currentOffset === 0) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${currentOffset}`);
      const data = await response.json();
      
      // Si es la primera carga, seteamos. Si es paginación, concatenamos.
      setPokemon(prev => currentOffset === 0 ? data.results : [...prev, ...data.results]);
    } catch (error) {
      console.log("Error al cargar la lista de Pokémon:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const fetchPokemonDetails = async (name) => {
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`${API_URL}/${name}`);
      const data = await response.json();
      setDetallesPokemon(data);
    } catch (error) {
      console.log("Error al cargar detalles del Pokémon:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchPokemons(0);
  }, []);

  // Carga de detalles al seleccionar
  useEffect(() => {
    if (pokemonSeleccionado) {
      fetchPokemonDetails(pokemonSeleccionado.name);
    }
  }, [pokemonSeleccionado]);

  // Función para el Infinite Scroll
  const handleLoadMore = () => {
    if (!isFetchingMore && !isLoading) {
      const nextOffset = offset + LIMIT;
      setOffset(nextOffset);
      fetchPokemons(nextOffset);
    }
  };

  const renderFooter = () => {
    if (!isFetchingMore) return <View style={{ height: 20 }} />;
    return <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#ffffff" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lista}>
        <Text style={styles.titulo}>POKEAPP</Text>
        <Text style={styles.subtitulo}>Elige tu Pokémon:</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={pokemon}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.itemPressed,
                  pokemonSeleccionado?.name === item.name && styles.itemSelected
                ]}
                onPress={() => setPokemonSeleccionado(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </Pressable>
            )}
            // Optimización: el nombre ya es único, no hace falta procesar la URL
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.listaContent}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>

      <View style={styles.detalles}>
        {isLoadingDetails ? (
          <ActivityIndicator size="large" color="#3B4CCA" />
        ) : detallesPokemon ? (
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
  itemSelected: {
    borderWidth: 2,
    borderColor: "#3B4CCA",
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