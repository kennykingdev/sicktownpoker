import MenuItem from './MenuItem';
import styles from './Menu.module.css';

const Menu = () => {
  return (
    <div>
      <nav className={styles.menu}>
        <ul>
          <MenuItem url="/" title="Home" />
          <MenuItem url="/" title="Results" />
          <MenuItem url="/players" title="Players" />
          <MenuItem url="/" title="Admin" />
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
