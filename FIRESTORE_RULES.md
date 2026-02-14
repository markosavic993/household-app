# Firestore Security Rules Update

Add the following rules to your Firestore Security Rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /households/{householdId} {
      // Allow authenticated users to CREATE households if they add themselves as a member
      allow create: if request.auth != null
        && request.auth.uid in request.resource.data.members;
      
      // Allow members to READ and UPDATE their household
      allow read, update, delete: if request.auth != null
        && request.auth.uid in resource.data.members;

      match /shoppingLists/{listId} {
        allow read, write: if request.auth != null
          && request.auth.uid in get(/databases/$(database)/documents/households/$(householdId)).data.members;

        match /items/{itemId} {
          allow read, write: if request.auth != null
            && request.auth.uid in get(/databases/$(database)/documents/households/$(householdId)).data.members;
        }
      }
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // NEW: Invite codes collection
    match /invites/{inviteCode} {
      // Anyone authenticated can read invite codes (to join households)
      allow read: if request.auth != null;
      
      // Only authenticated users can create invite codes
      allow create, update: if request.auth != null;
      
      // Only the creator can delete
      allow delete: if request.auth != null 
        && resource.data.createdBy == request.auth.uid;
    }
  }
}
```

## Changes Made:
1. Added `invites` collection rules
2. Allows any authenticated user to read invites (needed for joining)
3. Allows authenticated users to create/update invites
4. Only creator can delete invites

Apply these rules in Firebase Console → Firestore Database → Rules tab.
