# Car Rental Application

This is a web application for a car rental company providing car rental
services. The application consists of three main pages:

1. **Home Page**: Provides a general description of the services offered by the
   company.
2. **Catalog Page**: Displays a catalog of cars with different configurations,
   which users can filter by brand, hourly rental price, and mileage.
3. **Favorites Page**: Displays advertisements that have been added to favorites
   by the user.

## Technical Specifications

- The application render 12 advertisements on the catalog page initially, with
  the rest loaded dynamically upon clicking the "Load more" button.
- Users can add advertisements to their favorites list by clicking on a
  heart-shaped button. The button color should change accordingly.
- The user's actions persisted even after refreshing the page. If an
  advertisement is added to favorites and the page is refreshed, the button
  should remain in the "favorite" state.
- Clicking again on the heart-shaped button should remove the advertisement from
  favorites, and the button color should revert to its initial state.
- Clicking on the "Learn more" button should open a modal window with detailed
  information about the car and its rental conditions.
- The modal window should close upon clicking the close button ("X"), clicking
  on the backdrop, or pressing the "Esc" key.
- The car mileage should be displayed in UI with comma separators (e.g., 4,500).

## Backend and API

- Used the MockAPI service to create a custom backend for development purposes.
- Created an `adverts` resource with the following fields: id, year, make,
  model, type, img, description, fuelConsumption, engineSize, accessories,
  functionalities, rentalPrice, rentalCompany, address, rentalConditions,
  mileage.
- Populated the `adverts` resource with at least 32 advertisements with varying
  values.
- Implemented pagination on the backend, with each page containing 12
  advertisements.

## Additional Features

- Implement filtering options:
  - Dropdown menu with car brands (makes.json).
  - Dropdown menu with hourly rental prices (increments of $10).
  - Input fields to specify a mileage range for searching advertisements.

## Routes

- "/" - Home page with a general description of the company's services.
- "/catalog" - Catalog page with a list of car advertisements.
- "/favorites" - Favorites page displaying advertisements added to favorites by
  the user.
- Redirect to the home page if the user tries to access a non-existing route.

## Installation and Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.

## Technologies Used

- React.js for building the frontend.
- React Router for client-side routing.
- CSS for styling the application.
- MockAPI for creating a custom backend.

## Contributors

- [Oksana M](https://github.com/OksanaMosk/) - Developer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
