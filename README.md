# Transformers Web Application

Welcome to the Transformers Web Application repository. This application aims to educate users on proper recycling practices, provide tools to identify recyclable materials, and incentivize participation through gamification and rewards.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Software Requirements Specification (SRS)](#software-requirements-specification-srs)

## Introduction
The Transformers app is a web-based, fully responsive recycling application. It features interactive games, barcode scanning for recycling, a trash calendar, educational content, and a user profile system. The app supports real-time notifications and provides a dashboard for user statistics. It is accessible via web browsers on desktop and mobile devices.

## Features
- **User Authentication:** Users can register and log in using email/password or third-party authentication providers (Google, Facebook).
- **Barcode Packaging Detection:** Users can scan barcodes using their device's camera and receive real-time feedback on recyclability and disposal instructions.
- **Trash Sorting Game:** An interactive game to sort waste items into the correct bins.
- **Quiz Game:** Multiple-choice quizzes on recycling topics.
- **Challenges and Rewards:** Participate in challenges and redeem points for rewards.
- **Educational Content:** Modules, videos, and news related to recycling and sustainability.
- **Community Engagement:** Leaderboards, daily challenges, and user rankings.
- **Waste Management Tools:** Trash calendar, local disposal locations, and a map feature.
- **Personal Statistics:** Dashboard displaying total weight of recyclables sorted and contributions to local recycling goals.

## Technologies Used
- **Frontend:** HTML, CSS, Bootstrap, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Real-time Features:** Firebase Cloud Messaging
- **Barcode Scanning:** ZXing library

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/transformers-app.git
   cd transformers-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Firebase configuration and reCAPTCHA secret key:
   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage
1. **Access the application:**
   Open your web browser and navigate to `http://localhost:3000`.

2. **Sign up or log in:**
   Use the sign-up page to create an account or log in with existing credentials. You can also use Google or Facebook authentication.

3. **Profile Setup:**
   After signing up, set up your profile by adding a display name, profile picture, and recycling goals.

4. **Barcode Scanning:**
   Use the barcode scanner feature to scan items and receive feedback on their recyclability.

5. **Participate in Games and Quizzes:**
   Engage in trash sorting games and quizzes to earn points and improve your recycling knowledge.

6. **Track Your Progress:**
   Use the dashboard to track your recycling statistics and contributions to local recycling goals.

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Software Requirements Specification (SRS)
The detailed Software Requirements Specification (SRS) document for the Transformers App is included in this repository. This document outlines the purpose, scope, features, and requirements for the application.

- [Transformers App - Software Requirements Specification (SRS) V1](https://github.com/your-username/transformers-app/blob/main/Transformers%20App%20-%20Software%20Requirements%20Specification%20(SRS)%20V1.docx)

For more details, refer to the SRS document to understand the complete set of requirements and the planned features for future development.

---

We hope you find this application useful and engaging. Happy recycling! 🌍♻️

If you have any questions or need further assistance, please feel free to contact us or open an issue on GitHub.
