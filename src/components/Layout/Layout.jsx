import { Header } from '../Header/Header';

import css from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={css.container}>
      <Header />
      <main>{children}</main>
    </div>
  );
};
export default Layout;
