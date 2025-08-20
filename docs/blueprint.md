# **App Name**: Detective Nexus

## Core Features:

- Case Loading: Load case structure including title, description, difficulty, characters, and clues from Firestore.
- Progress Tracking: Save and track user progress, including unlocked clues and actions used, in Firestore.
- Clue Display: Display unlocked clues with titles, images and descriptions in a dedicated section.
- Suspects List: Show available suspects with image and name
- Confrontation UI: Allow users to select a character and a clue/statement to confront them with.
- Dialogue Lookup: Fetch the appropriate response from the character's dialogue tree based on the selected clue.
- Evidence Management: Automatically unlock new clues based on the character's response, updating the user's session in Firestore.

## Style Guidelines:

- Background: Dark gray (#333333) to set a somber, investigative tone.
- Primary: Desaturated brown (#A69381) for key elements, providing an antique feel.
- Accent: Light gray (#CCCCCC) to highlight interactive elements and improve readability against the dark background.
- Font pairing: 'Literata' (serif) for headlines, lending a literary, vintage feel; 'PT Sans' (sans-serif) for body text
- Use minimalist icons in shades of gray and brown to represent clues, characters, and actions, maintaining a consistent thematic style.
- Employ a card-based layout for displaying clues and characters, ensuring a clean and organized presentation. Cards should have rounded corners and subtle shadows for depth.
- Incorporate subtle transitions and animations (e.g., a fade-in effect when revealing clues) to enhance the user experience without being distracting.