import React from 'react';

type UIButtonProps = {
  text: string;
  handleClick: () => void;
};

class UIButton extends React.Component<UIButtonProps> {
  render() {
    return <button onClick={this.props.handleClick} type='button'>{this.props.text}</button>;
  }
}

export default UIButton;
