import css from './DetailsAboutCar.module.css';

export const DetailsAboutCar = ({
  id,
  year,
  make,
  model,
  type,
  img,
  description,
  fuelConsumption,
  engineSize,
  accessories,
  functionalities,
  rentalPrice,
  rentalCompany,
  rentalConditions,
  mileage,
  address,
}) => {
  return (
    <li className={css.itemHome} key={id}>
      {img && (
        <img
          src={img}
          alt={`Car ${id}`}
          style={{ width: '274px', height: '268px' }}
        />
      )}
      <div className={css.everyItem}>
        <div className={css.about}>
          <p className={css.price}>{year}</p>
          <p className={css.price}>{make}</p>
          <p className={css.price}>{model}</p>
          <p className={css.price}>{type}</p>

          <p className={css.price}>{description}</p>
          <p className={css.price}>{fuelConsumption}</p>
          <p className={css.price}>{engineSize}</p>
          <p className={css.price}>{accessories}</p>
          {Array.isArray(functionalities) &&
            functionalities.map((func, index) => (
              <p className={css.price} key={index}>
                {func}
              </p>
            ))}
          <p className={css.price}>{rentalPrice}</p>
          <p className={css.price}>{rentalCompany}</p>
          <p className={css.price}>{rentalConditions}</p>
          <p className={css.price}>{mileage}</p>
          <p
            className={css.address}
            style={{
              whiteSpace: 'pre-wrap',
              maxWidth: '25ch',
              overflowWrap: 'break-word',
            }}
          >
            {address.replace(/,([^,]{0,10})$/, ',\u00A0$1')}
          </p>
          <div className={css.aboutDetails}></div>
        </div>
      </div>
    </li>
  );
};
