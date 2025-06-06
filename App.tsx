import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import { Session } from '@supabase/supabase-js';
import React from 'react';
import Home from './components/Home';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './routes/navigationTypes';
import { NavigationContainer } from '@react-navigation/native';
import Playlists from './components/Playlists';
import PlaylistProblems from './components/PlaylistProblems';
import ProblemCard from './components/ProblemCard';
import Auth from './components/Auth';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session === null) {
    return <Auth />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">{props => <Home {...props} session={session} />}</Stack.Screen>
        <Stack.Screen name="Playlists" component={Playlists} />
        <Stack.Screen name="PlaylistProblems" component={PlaylistProblems} />
        <Stack.Screen name="ProblemCard" component={ProblemCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
