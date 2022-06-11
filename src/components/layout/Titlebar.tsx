import Image from 'next/image';
import styles from './Titlebar.module.css';

const Titlebar = () => {
  return (
    <>
      <div className={styles.titlebar}>
        <div className={styles.brand}>
          <Image alt="logo" src="/favicon.ico" width={80} height={80} />
          <h1>Sicktown Poker</h1>
        </div>
        <div className={styles.session}>Login</div>
      </div>
    </>
  );
};

export default Titlebar;
