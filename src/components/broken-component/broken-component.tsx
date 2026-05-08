import React from 'react';

type State = { shouldThrow: boolean };

export class BrokenComponent extends React.Component<Record<string, never>, State> {
  state = { shouldThrow: false };

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render(): React.ReactNode {
    if (this.state.shouldThrow) {
      throw new Error('Test error');
    }

    return <button onClick={this.handleClick}>Crash the app</button>;
  }
}
