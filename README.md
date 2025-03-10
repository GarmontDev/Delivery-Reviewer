# 📦 Delivery Review App

**Delivery Review App** is a modern barcode-scanning solution to streamline delivery item reviews. With this app, users can scan barcodes to check if items are on a pre-loaded delivery list and update their quantities in real time. Built with React and powered by Firebase, this app ensures smooth functionality for users and administrators, featuring a secure backend for data management.

---

## 🌟 Features

- **Barcode Scanning**: Scan items to verify their presence in the delivery list.
- **Real-Time Feedback**: Get instant messages when an item is found in the list, with prompts to update its quantity.
- **Firebase Backend**: 
  - **Authentication**: Secure login and registration for users and admins.
  - **Database**: Stores and updates item lists, delivery records, and user data.
- **Admin Dashboard**: Manage item lists and delivery statuses.
- **Responsive Design**: Optimized for mobile and desktop use.

---

## 🛠️ Tech Stack

This project leverages modern technologies for an efficient, scalable solution:

- **React**: For building an intuitive and interactive UI.
- **Firebase**:
  - **Authentication**: Secure user sign-in and management.
  - **Firestore**: Cloud-hosted NoSQL database for delivery items and user roles.
- **Vite**: For fast development and production builds.
- **TailwindCSS**: For crafting modern, responsive, and clean UI.

---

## 🚀 Installation and Setup

To run the app locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/garmontdev/delivery-review-app.git

2. **Navigate to the project directory**:
   ```bash
    cd delivery-review-app

3. **Install dependencies**:
   ```bash
    npm install

4. **Set up Firebase**:
   ```bash
    Create a Firebase project at Firebase Console.
    Add your Firebase configuration to the .env file:

    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id

5. **Start the development server**:
   ```bash
    npm run dev

6. **View the app**:
   ```bash
    Open http://localhost:5173 in your browser.


🧑‍💻 Why I Built This

Managing delivery items can be cumbersome without an efficient tracking system. 
This app simplifies the process by integrating real-time barcode scanning with a secure Firebase backend. 
It demonstrates my ability to:

  - Build interactive and responsive UIs using React and TailwindCSS.
  - Integrate barcode scanning for real-world functionality.
  - Leverage Firebase for secure authentication and database management.
  - Design scalable systems for both users and admins.

🔮 What’s Next?

Planned features for future development:

  - **Analytics Dashboard**: For admins to track delivery stats and user activity.
  - **Offline Mode**: Edit data locally for areas with poor connectivity.
  - **Push Notifications**: Notify users of incomplete deliveries or updates.
