import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  progress: number;
}

const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{problem.title}</Text>
      <Text style={styles.difficulty}>Difficulty: {problem.difficulty}</Text>
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficulty: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ProblemCard;
