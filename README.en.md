# Car Rental Application

This is a web application for a car rental company providing car rental
services. The application consists of three main pages:

1. **HomePage**: Provides a general description of the services offered by the
   company.
2. **Psychologists**: Displays a catalog of cars with different configurations,
   which users can filter by brand, hourly rental price, and mileage.
3. **FavoritesPage**: Displays advertisements that have been added to favorites
   by the user.

## Technical Specifications

Firebase Integration: Firebase was utilized for implementing authentication and
database management.

Authentication: User registration, login, retrieving user data, and logout
functionalities were achieved using Firebase Authentication.

Form Handling: Registration/login forms were created and validated using
react-hook-form and yup.

Database Setup: A Realtime Database in Firebase named "psychologists" was
configured with the following fields: name, avatar_url, experience, reviews,
price_per_hour, rating, license, specialization, initial_consultation, about.

UI Design:

React was employed to design components according to the mockup. Psychologists
Page:

Displaying three psychologist cards on the initial page load and loading
additional cards upon user request were implemented. Adding/removing
psychologists to/from the user's favorites list was accomplished using local
storage or Firebase database. Favorites Page: A private page was created to
display psychologists favorited by the user. The design is analogous to the
"Psychologists" page.

Appointment Booking: A modal window for booking appointments with psychologists
was implemented. The form and validation of its fields were done using
react-hook-form and yup.

Routing: React Router was utilized for navigating within the application.

## Contributors

- [Oksana M](https://github.com/OksanaMosk/) - Developer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
