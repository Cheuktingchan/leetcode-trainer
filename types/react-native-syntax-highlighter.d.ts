declare module 'react-native-syntax-highlighter' {
  import { Component } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  export interface SyntaxHighlighterProps {
    language: string;
    children: string;
    style: object;
    customStyle?: TextStyle | ViewStyle;
  }

  export default class SyntaxHighlighter extends Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/styles/hljs' {
  const value: any;
  export = value;
}
