import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

export default function App() {
  // HOOK DE REACT USESTATE (ESTADO)
  const [pokemon, setPokemon] = useState([]);
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
  const [detallesPokemon, setDetallesPokemon] = useState(null);

  const getUnPokemon = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
      );
      const data = await response.json();
      console.log("Pokemon", data);
      setPokemon(data.results);
    } catch (error) {
      console.log("ERROR. No fue posible acceder a la API");
    }
  };

  //FUNCION PARA LLAMAR A UNA API
  //fetch y async await

  const getPokemon = async (item) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${item.name}`
      );
      const data = await response.json();
      console.log("Pokemon", data);
      setDetallesPokemon(data);
      console.log("Pokeon elegido", detallesPokemon);
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

  const Home = () => {
    const navigation = useNavigation();
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
                // Ahora actualiza el estado al hacer click
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
                onPress={() => navigation.navigate("detalles", { pokemon: detallesPokemon })}>
                <Text style={styles.btnText}>Ver Detalles</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.placeholder}>
              No se seleccionó ningún pokémon
            </Text>
          )}
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    );
  };

const Detalles = ({ route, navigation }) => {
    const { pokemon } = route.params;
    const [activeTab, setActiveTab] = useState('Base Stats');
    const [evolutions, setEvolutions] = useState([]);
  
    // Buscar la cadena de evolución
    useEffect(() => {
      const fetchEvolutions = async () => {
        try {
          // 1. Busca la especie
          const speciesRes = await fetch(pokemon.species.url);
          const speciesData = await speciesRes.json();
          
          // 2. Busca la cadena de evolución
          const evoRes = await fetch(speciesData.evolution_chain.url);
          const evoData = await evoRes.json();
  
          // 3. Extrae los nombres y las IDs para las imágenes
          let chain = [];
          let current = evoData.chain;
          while (current) {
            const urlParts = current.species.url.split('/').filter(Boolean);
            const id = urlParts[urlParts.length - 1]; 
            
            chain.push({
              name: current.species.name,
              id: id,
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            });
            current = current.evolves_to[0]; 
          }
          setEvolutions(chain);
        } catch (error) {
          console.log("Error al buscar evoluciones", error);
        }
      };
  
      fetchEvolutions();
    }, [pokemon]);
  
    // Colores según el tipo principal
    const typeColors = {
      grass: '#48D0B0', fire: '#FB6C6C', water: '#609FB5', bug: '#C6D16E',
      normal: '#D2D2C6', poison: '#C68CC6', electric: '#FAD536', ground: '#EBD69D',
      fairy: '#EE99AC', fighting: '#C03028', psychic: '#F366B9', rock: '#C6B675',
      ghost: '#705898', ice: '#98D8D8', dragon: '#6F35FC', dark: '#705848',
      steel: '#B8B8D0', flying: '#A890F0',
    };
  
    const mainType = pokemon.types[0].type.name;
    const bgColor = typeColors[mainType] || '#48D0B0';
    const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  
    return (
      <View style={[styles.detailContainer, { backgroundColor: bgColor }]}>
        <View style={styles.detailHeader}>
          <Pressable onPress={() => navigation.goBack()} style={{ padding: 10 }}>
            <Text style={styles.headerIcon}>←</Text>
          </Pressable>
        </View>
  
        <View style={styles.titleContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.detailName}>{pokemon.name}</Text>
            <Text style={styles.detailId}>{formattedId}</Text>
          </View>
          <View style={styles.typesRow}>
            {pokemon.types.map((t) => (
              <View key={t.type.name} style={styles.typePill}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>
        </View>
  
        <View style={styles.whiteSheet}>
          <Image source={{ uri: imageUrl }} style={styles.overlapImage} />
  
          <View style={styles.tabRow}>
            {['About', 'Base Stats', 'Evolution', 'Moves'].map((tab) => (
              <Pressable key={tab} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabActive]}>
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.activeIndicator} />}
              </Pressable>
            ))}
          </View>
  
          <View style={styles.tabContent}>
            
            {/* PESTAÑA: ABOUT */}
            {activeTab === 'About' && (
              <View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Height</Text>
                  <Text style={styles.statValue}>{pokemon.height / 10} m</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Weight</Text>
                  <Text style={styles.statValue}>{pokemon.weight / 10} kg</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Abilities</Text>
                  <Text style={[styles.statValue, { textTransform: 'capitalize' }]}>
                    {pokemon.abilities.map((a) => a.ability.name).join(', ')}
                  </Text>
                </View>
              </View>
            )}
  
            {/* PESTAÑA: BASE STATS */}
            {activeTab === 'Base Stats' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {pokemon.stats.map((s) => {
                  const statVal = s.base_stat;
                  const barColor = statVal >= 50 ? '#48D0B0' : '#FB6C6C';
                  const statNames = { hp: 'HP', attack: 'Attack', defense: 'Defense', 'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed' };
                  
                  return (
                    <View key={s.stat.name} style={styles.statRow}>
                      <Text style={styles.statLabel}>{statNames[s.stat.name] || s.stat.name}</Text>
                      <Text style={styles.statNumber}>{statVal}</Text>
                      <View style={styles.barContainer}>
                        <View style={[styles.barFill, { width: `${(statVal / 255) * 100}%`, backgroundColor: barColor, maxWidth: '100%' }]} />
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
  
            {/* PESTAÑA: EVOLUTION */}
            {activeTab === 'Evolution' && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.evoContainer}>
                {evolutions.length > 0 ? evolutions.map((evo, index) => (
                  <View key={evo.name} style={styles.evoWrapper}>
                    <View style={styles.evoItem}>
                      <Image source={{ uri: evo.imageUrl }} style={styles.evoImage} />
                      <Text style={styles.evoName}>{evo.name}</Text>
                    </View>
                    {/* Flecha para apuntar a la siguiente evolución */}
                    {index < evolutions.length - 1 && (
                      <Text style={styles.evoArrow}>↓</Text>
                    )}
                  </View>
                )) : (
                  <Text style={{textAlign: 'center', color: 'gray'}}>Cargando evoluciones...</Text>
                )}
              </ScrollView>
            )}
  
            {/* PESTAÑA: MOVES */}
            {activeTab === 'Moves' && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.movesContainer}>
                {pokemon.moves.map((m) => (
                  <View key={m.move.name} style={styles.movePill}>
                    <Text style={styles.moveText}>{m.move.name}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
  
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen 
            name="detalles" 
            component={Detalles} 
            options={{ headerShown: false }} 
            />
          </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  listaContent: {
    paddingBottom: 20,
  },
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
  
  // --- ESTILOS MODO OSCURO PARA DETALLES ---
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
  pokemonImage: {
    width: 180, 
    height: 180,
  },
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

  // --- ESTILOS PANTALLA DETALLES (Diseño Pokedex) ---

  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50, 
  },
  headerIcon: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  titleContainer: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailName: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  detailId: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  typesRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  typePill: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  typeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  whiteSheet: {
    backgroundColor: "white",
    flex: 1,
    marginTop: 220, 
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
  },
  overlapImage: {
    width: 260,
    height: 260,
    position: "absolute",
    top: -210, 
    alignSelf: "center",
    zIndex: 10,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60, 
    marginBottom: 20,
  },
  tabText: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "600",
  },
  tabActive: {
    color: "#333333",
    fontWeight: "bold",
  },
  activeIndicator: {
    height: 3,
    backgroundColor: "#6C79DB",
    marginTop: 5,
    borderRadius: 2,
  },
  tabContent: {
    flex: 1,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statLabel: {
    width: 100,
    color: "#757575",
    fontSize: 15,
    fontWeight: "600",
  },
  statValue: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },
  statNumber: {
    width: 40,
    color: "#333",
    fontSize: 15,
    fontWeight: "bold",
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginLeft: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
  // --- ESTILOS EVOLUCIONES ---
  evoContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  evoWrapper: {
    alignItems: "center",
  },
  evoItem: {
    alignItems: "center",
    marginBottom: 10,
  },
  evoImage: {
    width: 120,
    height: 120,
  },
  evoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
    marginTop: 5,
  },
  evoArrow: {
    fontSize: 24,
    color: "#E0E0E0",
    marginBottom: 10,
    fontWeight: "bold",
  },

  // --- ESTILOS MOVIMIENTOS ---
  movesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 40,
  },
  movePill: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  moveText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});