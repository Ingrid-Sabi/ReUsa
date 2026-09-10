import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
// Importación actualizada apuntando a la nueva carpeta de servicios
import { db } from '../services/firebase';

export default function Inicio({ navigation }) {
  const [objetos, setObjetos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerObjetos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "objetos"));
        const listaObjetos = [];
        
        querySnapshot.forEach((doc) => {
          // Extraemos el ID del documento y lo unimos con el resto de los datos
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

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <Text style={styles.nombreObjeto}>{item.nombre}</Text>
      
      {/* Mostramos una pequeña descripción si existe */}
      <Text style={styles.descripcionObjeto} numberOfLines={2}>
        {item.descripcion || "Sin descripción adicional."}
      </Text>
      
      <TouchableOpacity 
        style={styles.botonDetalle}
        // Aquí pasamos los datos del objeto a la pantalla de Detalle
        onPress={() => navigation.navigate('Detalle', { objeto: item })}
      >
        <Text style={styles.textoBoton}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Catálogo TdeA</Text>
      <Text style={styles.subtitulo}>Objetos disponibles para donación</Text>

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
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#0066cc', marginBottom: 5, marginTop: 30 },
  subtitulo: { fontSize: 16, color: '#555', marginBottom: 20 },
  loader: { marginTop: 50 },
  lista: { paddingBottom: 30 },
  tarjeta: { 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 15, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  nombreObjeto: { fontSize: 19, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  descripcionObjeto: { fontSize: 14, color: '#666', marginBottom: 15, lineHeight: 20 },
  botonDetalle: { backgroundColor: '#0066cc', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  vacio: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 }
});