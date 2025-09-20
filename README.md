# User Stories

## Epic: Core Application Layout & Navigation

### Story 1: Main Navigation
**As a user,** I want to see a persistent navigation bar at the top of the screen, so that I can easily navigate between the main sections of the application.  

**Acceptance Criteria:**
- The navigation bar is always visible.
- The navigation bar contains links for "Overview," "Contacts," and "Favorites."
- The navigation bar contains a primary button labeled "New."

***

## Epic: Contact Management

### Story 2: Create a New Contact
**As a user,** I want to click a "New" button that opens a form, so that I can add a new person to my contact list.  

**Acceptance Criteria:**
- Clicking the "New" button in the navigation bar displays a contact creation form.
- The form contains input fields for First Name, Last Name, and Email.
- The form includes an option (e.g., a checkbox or toggle) to set the new contact's "favorite" status.
- A "Save" button on the form, when clicked, adds the contact to the list and closes the form.

### Story 3: Delete a Contact
**As a user,** I want to be able to delete a contact from the main "Contacts" view, so that I can remove outdated or incorrect entries.  

**Acceptance Criteria:**
- On the "Contacts" screen, each contact card has a "Delete" button.
- Clicking the "Delete" button removes the contact from the application permanently and updates the UI.

***

## Epic: Contact Viewing & Interaction

### Story 4: View Overview Screen
**As a user,** I want to see my contacts separated into "Favorites" and "Other Contacts" on the main overview screen, so that I can quickly find my most important contacts.  

**Acceptance Criteria:**
- The "Overview" screen contains a distinct section at the top for favorite contacts.
- A second section displays all non-favorite contacts.
- Favorite contact cards show the full name, email, picture, and a "Remove from Favorites" button.
- Non-favorite contact cards show the full name, email, picture, and an "Add to Favorites" button.
- Changing a contact's favorite status on this screen seamlessly moves it to the correct group in real-time.

### Story 5: View All Contacts Screen
**As a user,** I want to view an alphabetized list of all my contacts, so that I can easily find and manage any individual.  

**Acceptance Criteria:**
- The "Contacts" view displays all contacts in a single list, sorted alphabetically by name.
- Each contact card shows the full name, email, and picture.
- Users can upload a picture for each contact card.
- Favorite contacts are visually distinguished by a colored border around their picture.
- Each card contains a button to toggle the contact's favorite status and a separate button for deletion.

### Story 6: View Favorites Screen
**As a user,** I want to view a screen that shows only my favorite contacts, so that I can have a focused view of my key people.  

**Acceptance Criteria:**
- The "Favorites" view displays only contacts that have been marked as a favorite.
- Each contact card shows the full name, email, picture, and a "Remove from Favorites" button.
- Clicking the remove button updates the UI instantly, removing the contact from this view.

### Story 7: Paginate Contact Lists
**As a user,** I want to see contact lists broken into pages when they become too long, so that the interface remains clean and performs well.  

**Acceptance Criteria:**
- On any view that displays contacts ("Contacts", "Favorites", etc.), a maximum of 16 contacts (a 4x4 grid) are shown at a time.
- If more than 16 contacts exist in a given list, pagination controls appear at the bottom.
- The pagination controls allow me to navigate between pages of contacts.

***

## Epic: User Authentication

### Story 8: User Login
**As a user**, I want to log in with a username and password, so that I can securely access my account.

**Acceptance Criteria:**
- A login screen prompts for username and password.
- Invalid credentials show an error message.
- Successful login redirects me to the main application.

### Story 9: User Signup with Email Verification
**As a user**, I want to sign up by providing a username, password, and email, so I can create an account. 

**Acceptance Criteria:**
- Signup form requires username, password, and email.
- After submitting, I receive a verification code at my email.
- Entering the correct code completes the signup process.

### Story 10: Password Recovery
**As a user**, I want to reset my password using my registered email, so that I can regain access if I forget it.

**Acceptance Criteria:**
- Password reset form asks for email. 
- A recovery email with a code or link is sent. 
- Entering the code or following the link allows me to set a new password. 

***
