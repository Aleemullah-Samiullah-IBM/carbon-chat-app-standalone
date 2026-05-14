# Launchpad Chat Widget

A React-based chat widget application built with Carbon Design System, featuring an AI-powered chat interface for seamless user interactions.

## Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

   This should start up successfully and display something like this in terminal:

   ```
   > carbon-chat-app-standalone@0.1.0 dev
   > npm run build:common && vite

   > carbon-chat-app-standalone@0.1.0 build:common
   > cd src/packages/agent-ui-common && npm install && npm run build && cd ../../..

   VITE v8.0.9  ready in 205 ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h + enter to show help
   ```

   Then you should be able to visit the local URL to see the application.

## Configuration

The chat component is configured in `src/packages/launchpad-chat-widget/App.tsx`. Please fill out `API_CONFIG` with your local agent details for development.

## Features

- Integration with Carbon Design System
- AI-powered chat interface
- Shared common package in `src/packages/agent-ui-common`
- Chat widget app in `src/packages/launchpad-chat-widget`
