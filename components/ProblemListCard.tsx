import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the "+" button
import { RootStackParamList } from '../routes/navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  relatedTopics: string;
}

const ProblemListCard: React.FC<{
  problem: Problem;
  addToPlaylist: (id: number) => void;
  handleNavigate: (id: number) => void;
}> = ({ problem, addToPlaylist, handleNavigate }) => {
  return (
    <TouchableOpacity onPress={() => handleNavigate(problem.id)}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{problem.title}</Text>
            <Text style={styles.difficulty}>Difficulty: {problem.difficulty}</Text>
            <Text style={styles.relatedTopics}>Related Topics: {problem.relatedTopics}</Text>
          </View>
          <TouchableOpacity onPress={() => addToPlaylist(problem.id)} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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

export default ProblemListCard;
