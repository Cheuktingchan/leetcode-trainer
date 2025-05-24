import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

type PseudocodeStep = {
  key: string;
  label: string;
};

const correctOrder: string[] = [
  'Start',
  'Initialize variables',
  'Check input',
  'Perform calculation',
  'Return result',
  'End',
];

const initialSteps: PseudocodeStep[] = correctOrder
  .map((step, index) => ({ key: `${index}`, label: step }))
  .sort(() => Math.random() - 0.5); // Shuffle

const SolveTab: React.FC<{ problemId: number }> = ({ problemId }) => {
  const [steps, setSteps] = useState<PseudocodeStep[]>(initialSteps);

  const checkOrder = () => {
    const userOrder = steps.map(step => step.label);
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    Alert.alert(isCorrect ? 'Correct Order!' : 'Incorrect Order. Try again!');
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<PseudocodeStep>) => {
    return (
      <View style={[styles.item, isActive && styles.activeItem]}>
        <Text onLongPress={drag} style={styles.itemText}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arrange the pseudocode in correct order</Text>

      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={steps}
          onDragEnd={({ data }) => setSteps(data)}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <View style={{ paddingVertical: 10 }}>
        <Button title="Check Order" onPress={checkOrder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  activeItem: {
    backgroundColor: '#e0f7fa',
  },
  itemText: {
    fontSize: 16,
  },
});

export default SolveTab;