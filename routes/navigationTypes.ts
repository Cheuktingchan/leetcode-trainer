import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';

// Define the type for navigation stack
export type RootStackParamList = {
  Home: { session: Session };
  Playlists: { userId: string };
  PlaylistListCard: {
    id: number;
    name: string;
  };
  PlaylistProblems: { playlistId: number; playlistName: string };
  ProblemCard: { problemId: number };
};

// Define navigation prop for a specific screen
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type PlaylistsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Playlists'>;
export type PlaylistProblemsRouteProp = RouteProp<RootStackParamList, 'PlaylistProblems'>;
export type ProblemCardRouteProp = RouteProp<RootStackParamList, 'ProblemCard'>;
