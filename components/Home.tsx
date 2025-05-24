import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Alert, Button } from 'react-native';
import ProblemListCard from './ProblemListCard';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import Playlists from './Playlists';
import { RootStackParamList } from '../routes/navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Account from './Account';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeProps {
  navigation: HomeScreenNavigationProp;
  session: Session;
}

const Home: React.FC<HomeProps> = ({ navigation, session }) => {
  const user = session.user;
  const [username, setUsername] = useState<string | null>();

  useEffect(() => {
    async function getUsername() {
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username`)
          .eq('id', user?.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
        }
      } catch (error) {
        setUsername('User');
      }
    }

    getUsername();
  }, [session, supabase, user?.id]);

  if (!username) {
    <Account session={session} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome, {username}!</Text>
      <Button
        title="Go to Playlists"
        onPress={() => navigation.navigate('Playlists', { userId: session.user.id })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Home;
