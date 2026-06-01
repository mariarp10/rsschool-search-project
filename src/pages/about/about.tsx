import classNames from 'classnames/bind';
import styles from './about.module.css';

const cn = classNames.bind(styles);

export const AboutPage: React.FC = () => {
  return (
    <section className={cn('container')}>
      <h1>{`Howdy y'all`}</h1>
      <article className={cn('wrapper')}>
        <div className={cn('content')}>
          <p>
            This is a search application for Rick and Morty characters. It
            allows users to search characters from a popular TV-show called
            &quot;Rick and Morty&quot;. Data is provided by{' '}
            <a
              href="https://rickandmortyapi.com/"
              target="_blank"
              rel="noreferrer"
              className={cn('link')}
            >
              Rick and Morty API
            </a>
          </p>
          <p>
            The application is made as a pet-project for{' '}
            <a
              href="https://rs.school/"
              target="_blank"
              rel="noreferrer"
              className={cn('link')}
            >
              RSSchool React Bootcamp
            </a>
            .
          </p>
          <p>
            You can check out my{' '}
            <a
              href="https://github.com/mariarp10"
              target="_blank"
              rel="noreferrer"
              className={cn('link')}
            >
              GitHub
            </a>
            , though it&apos;s a major work in progress.
          </p>
        </div>
        <img src="/images/about-page-picture.jpg" alt="Picture of a meme" />
      </article>
    </section>
  );
};
