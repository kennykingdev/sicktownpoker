import { FC } from 'react';
import 'normalize.css';
import styles from './Layout.module.css';
import Menu from './Menu';
import Titlebar from './Titlebar';

const Layout: FC = ({ children }) => {
  return (
    <>
      <main className={styles.main}>
        <Titlebar />
        <Menu />
        <div className={styles.content}>{children}</div>
      </main>
    </>
  );
};

export default Layout;
