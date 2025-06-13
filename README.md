# PokemonChallenge

Web application developed with Angular for managing user profiles and hobbies and pokemon, featuring Angular Material integration and dynamic validations.

---

## Features

- User profile registration and editing (name, date of birth, DUI, minority card, hobbies, photo).
- Automatic validations based on user age.
- Hobby management with chips and autocomplete.
- Profile photo upload and display.
- Modern interface using Angular Material.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.io/cli) (v16 or higher)
- [Git](https://git-scm.com/) (optional, to clone the repository)

---

## Installation and Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/pokemon-challenge.git
   cd pokemon-challenge
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the application in development mode:**

   ```bash
   ng serve
   ```

4. **Open your browser at:**

   ```
   http://localhost:4200
   ```

---

## Environment Variables Configuration

Before running the project, you must configure your credentials and endpoints in the environment files:

1. Edit the `environment.ts` and `environment.prod.ts` files and add your API key and URL:

You must visit https://es.imgbb.com/ to obtain your credentials.

   ```typescript
   export const environment = {
     production: false,
     API_KEY: "YOUR_API_KEY_HERE",
     API_URL: "YOUR_API_URL_HERE",
   };
   ```

---

## Project Structure

- `src/app/components/` — UI components (forms, lists, etc.).
- `src/app/services/` — Business logic and data services.
- `src/app/interfaces/` — Type and interface definitions.
- `src/app/validators/` — Custom validators.

---

## Customization

- You can modify the list of hobbies in `user-profile-form.component.ts`.

---

## Support

If you have questions or issues, open an issue in the repository or contact