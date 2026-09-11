import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';

export default function Inicio({ navigation }) {
  const [objetos, setObjetos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerObjetos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "objetos"));
        const listaObjetos = [];
        
        querySnapshot.forEach((doc) => {
          listaObjetos.push({ id: doc.id, ...doc.data() });
        });
        
        setObjetos(listaObjetos);
      } catch (error) {
        console.log("Error obteniendo objetos: ", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerObjetos();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    }).catch((error) => {
      console.log("Error al cerrar sesión:", error);
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <View style={styles.infoContainer}>
        {item.imagenUrl ? (
          <Image source={{ uri: item.imagenUrl }} style={styles.imagen} />
        ) : (
          <View style={styles.imagenPlaceholder}>
            <Text style={styles.textoPlaceholder}>Sin foto</Text>
          </View>
        )}
        
        <View style={styles.textoContainer}>
          <Text style={styles.nombreObjeto}>{item.nombre}</Text>
          <Text style={styles.textoDetalle}>Categoría: {item.categoria || "Material de estudio"}</Text>
          <Text style={styles.textoDetalle}>Estado: {item.estado || "Usado"}</Text>
          <Text style={styles.textoUbicacion}>📍 {item.ubicacion || "TdeA"}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.botonDetalle}
        onPress={() => navigation.navigate('Detalle', { objeto: item })}
      >
        <Text style={styles.textoBoton}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Catálogo ReUsa</Text>
        <TouchableOpacity style={styles.botonSalir} onPress={handleLogout}>
          <Text style={styles.textoSalir}>Salir</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : (
        <FlatList
          data={objetos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay objetos disponibles en este momento.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 30 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  botonSalir: { backgroundColor: '#dc3545', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  textoSalir: { color: '#fff', fontWeight: 'bold' },
  loader: { marginTop: 50 },
  lista: { paddingBottom: 30 },
  tarjeta: { 
    backgroundColor: '#eaeef2', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
  },
  infoContainer: { flexDirection: 'row', marginBottom: 15 },
  imagen: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  imagenPlaceholder: { width: 80, height: 80, borderRadius: 8, marginRight: 15, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  textoPlaceholder: { color: '#666', fontSize: 12 },
  textoContainer: { flex: 1, justifyContent: 'center' },
  nombreObjeto: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  textoDetalle: { fontSize: 14, color: '#555', marginBottom: 2 },
  textoUbicacion: { fontSize: 14, color: '#0066cc', fontWeight: 'bold', marginTop: 4 },
  botonDetalle: { backgroundColor: '#0047b3', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  vacio: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 }
});