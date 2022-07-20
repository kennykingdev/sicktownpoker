import { FC } from 'react';
import 'normalize.css';
import styles from './Layout.module.css';
import Menu from './Menu';
import Titlebar from './Titlebar';

// TODO: fix props type
const Layout = ({ children }: any) => {
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
