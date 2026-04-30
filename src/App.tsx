import React from 'react';

type AppState = {
  someProperty: number;
};

class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    someProperty: 0,
  };

  render() {
    return (
      <>
        <p>This will be a search app, work in progress</p>
      </>
    );
  }
}

export default App;
