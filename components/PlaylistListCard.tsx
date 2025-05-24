import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the "+" button

export interface Playlist {
  id: number;
  name: string;
}

const PlaylistListCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{playlist.name}</Text>
        </View>
        <TouchableOpacity onPress={() => null} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1, // Allows text to take up remaining space
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficulty: {
    fontSize: 14,
    color: 'gray',
  },
  relatedTopics: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    padding: 5,
  },
});

export default PlaylistListCard;
