import React from 'react';
import { UIButton } from '@ui/button';
import { UIInput } from '@ui/input';
import styles from './search.module.css';

type TSearchProps = {
  initialValue: string;
  onSearch: (value: string) => void;
};

type TSearchState = {
  value: string;
};

export class Search extends React.Component<TSearchProps, TSearchState> {
  state: TSearchState = {
    value: this.props.initialValue,
  };

  componentDidUpdate(prevProps: TSearchProps) {
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

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.props.onSearch(this.state.value);
    }
  };

  render(): React.ReactNode {
    return (
      <section className={styles.container}>
        <div className={styles.search}>
          <UIInput
            placeholder="Look up Rick and Morty characters"
            value={this.state.value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <UIButton handleClick={this.handleClick} text="search" />
        </div>
        <p className={styles.hint}>
          Try typing in names of the characters from the show: Summer, Beth, Rick
        </p>
      </section>
    );
  }
}
