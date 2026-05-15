import React from 'react';

type TErrorThrowerState = { shouldThrow: boolean };

export class ErrorThrowerComponent extends React.Component<
  Record<string, never>,
  TErrorThrowerState
> {
  state: TErrorThrowerState = { shouldThrow: false };

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render(): React.ReactNode {
    if (this.state.shouldThrow) {
      throw new Error('Test error');
    }

    return <button onClick={this.handleClick}>Test ErrorBoundary</button>;
  }
}
