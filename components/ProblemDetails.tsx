import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

interface Problem {
  title: string;
  description: string;
  difficulty: string;
}

interface ProblemDetailsProps {
  problem: Problem;
}

const ProblemDetails: React.FC<ProblemDetailsProps> = ({ problem }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{problem.title}</Text>
      <Text style={styles.info}>Difficulty: {problem.difficulty}</Text>
      <Text style={styles.description}>{problem.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 20,
  },
});

export default ProblemDetails;
