import Link from 'next/link';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  url: string;
  title: string;
}

const MenuItem = ({ url, title }: MenuItemProps) => {
  return (
    <li className={styles.item}>
      <Link href={url}>{title}</Link>
    </li>
  );
};

export default MenuItem;
