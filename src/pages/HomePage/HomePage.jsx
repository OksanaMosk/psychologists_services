import css from './HomePage.module.css';
import BackdropHome from '../../components/BackdropHome/BackdropHome';

const HomePage = () => {
  return (
    <div className={css.homeContainer}>
      <BackdropHome />
    </div>
  );
};
export default HomePage;
