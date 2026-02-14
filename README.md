# 🏠 Smart Household App

A collaborative household management app built with React Native, Expo, and Firebase. Manage shopping lists and coordinate with your household members in real-time.

## 📱 Features

- **Multi-household support** - Join or create multiple households
- **Real-time shopping lists** - Collaborate with household members instantly
- **Invite system** - Share invite codes to add members to your household
- **User authentication** - Secure sign-in/sign-up with Firebase Auth
- **Persistent sessions** - Stay logged in across app restarts
- **Serbian language UI** - Native Serbian interface

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Firestore + Authentication)
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Storage**: AsyncStorage for local persistence
- **Language**: TypeScript

## 📁 Project Structure

```
smart-household-app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home screen
│   │   └── shoppingList.tsx     # Shopping list screen
│   ├── _layout.tsx              # Root layout with auth logic
│   ├── sign-in.tsx              # Authentication screen
│   └── household-setup.tsx      # Household selection/creation
├── components/                   # Reusable components
│   └── ShoppingListItem.tsx     # Shopping list item component
├── context/                      # React Context providers
│   ├── AuthContext.tsx          # Authentication state
│   └── HouseholdContext.tsx     # Selected household state
├── hooks/                        # Custom React hooks
│   ├── useUserProfile.tsx       # User profile data
│   └── useUserName.tsx          # Fetch user names
├── services/                     # Firebase services
│   ├── firebase.ts              # Firebase configuration
│   ├── householdService.ts      # Household operations
│   ├── shoppingListService.ts   # Shopping list operations
│   └── userService.ts           # User operations
└── types/                        # TypeScript types
    └── ShoppingItem.ts          # Shopping item interface
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-household-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Update `services/firebase.ts` with your Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Set up Firestore Security Rules**
   
   Apply the rules from `FIRESTORE_RULES.md` in Firebase Console

5. **Start the development server**
   ```bash
   npx expo start --clear
   ```

## 🔐 Firestore Structure

```
users/
  {userId}/
    - email: string
    - householdIds: string[]
    - createdAt: timestamp

households/
  {householdId}/
    - name: string
    - members: string[]
    - createdAt: timestamp
    - updatedAt: timestamp
    
    shoppingLists/
      default/
        items/
          {itemId}/
            - name: string
            - quantity: number
            - completed: boolean
            - addedBy: string
            - createdAt: timestamp
            - updatedAt: timestamp

invites/
  {inviteCode}/
    - householdId: string
    - createdBy: string
    - createdAt: timestamp
```

## 🔑 Key Features Explained

### Authentication Flow
1. User signs up/logs in
2. Always shown household selection screen
3. Can create new household or join existing via invite code
4. Selected household persists across sessions

### Household Management
- Create households with unique names
- Generate 6-character invite codes
- Share codes to invite members
- Switch between households anytime

### Shopping Lists
- Real-time collaboration using Firestore snapshots
- Add items with quantity
- Mark items as complete
- See who added each item
- Automatic sorting (newest first)

### Real-time Sync
- All household members see changes instantly
- No manual refresh needed
- Uses Firestore `onSnapshot` listeners

## 🎨 UI Features

- **Dark theme** - Easy on the eyes
- **Serbian language** - Fully localized interface
- **Loading states** - Clear feedback during operations
- **Error handling** - User-friendly error messages
- **Empty states** - Helpful messages when lists are empty

## 🔒 Security

- Authentication required for all operations
- Users can only access their own households
- Shopping lists scoped to household membership
- Firestore security rules enforce access control
- Invite codes validate household access

## 📝 Scripts

```bash
# Start with cache clearing (recommended)
npx expo start --clear

# Start with tunnel (for testing on physical devices)
npx expo start --tunnel

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

## 🐛 Known Issues

- Metro bundler cache may require periodic clearing
- Console logs may not update without app restart during development

## 🔮 Future Enhancements

- [ ] Multiple shopping lists per household (Weekly, Party, etc.)
- [ ] Shopping list categories (Produce, Dairy, etc.)
- [ ] Push notifications for list updates
- [ ] Item history and analytics
- [ ] Bulk delete completed items
- [ ] User profile customization
- [ ] Household admin roles
- [ ] Export shopping lists

---

Built with ❤️ using React Native and Firebase
