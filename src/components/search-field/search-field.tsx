import React from 'react';
import { UIButton } from '@ui/button';
import { UIInput } from '@ui/input';

import styles from './search-field.module.css';

type SearchFieldProps = {
  initialValue: string;
  onSearch: (value: string) => void;
};

type SearchFieldState = {
  value: string;
};

export class SearchField extends React.Component<SearchFieldProps, SearchFieldState> {
  state: SearchFieldState = {
    value: this.props.initialValue,
  };

  componentDidUpdate(prevProps: SearchFieldProps) {
    if (prevProps.initialValue !== this.props.initialValue) {
      this.setState({ value: this.props.initialValue });
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value });
  };

  handleClick = () => {
    this.props.onSearch(this.state.value);
  };

  render(): React.ReactNode {
    return (
      <>
        <h1 className={styles.title}>Rick and Morty - look up characters from the show</h1>
        <div className={styles.container}>
          <UIInput
            placeholder="Look up Rick and Morty characters"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <UIButton handleClick={this.handleClick} text="search" />
        </div>
        <p className={styles.hint}>
          Try typing in names of the characters from the show: Summer, Beth, Rick
        </p>
      </>
    );
  }
}
