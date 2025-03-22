import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import Auth from './components/Auth'
import Account from './components/Account'
import { Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from 'react'
import Home from './components/Home'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './routes/navigationTypes'
import { NavigationContainer } from '@react-navigation/native'
import Playlists from './components/Playlists'
import PlaylistProblems from './components/PlaylistProblems'
import ProblemCard from './components/ProblemCard'

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (session === null) {
    return <Text>Loading session...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => <Home {...props} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="Playlists" component={Playlists} />
        <Stack.Screen name="PlaylistProblems" component={PlaylistProblems} />
        <Stack.Screen name="ProblemCard" component={ProblemCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};