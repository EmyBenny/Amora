# Amora — Cross-Platform Dating & Matchmaking Mobile App

> A modern, mobile-first dating and matching platform built with Flutter, Dart, React, and TypeScript. Designed for dating and matching lovers (male and female) with mutual passion scoring, marching band & rhythm harmonies, hardware-level secure authentication, and real-time messaging.

---

## 🌟 Executive Overview

**Amora** is an intentional, romance-focused cross-platform mobile application. While standard dating apps rely solely on superficial appearance, Amora combines:
1. **Mathematical Chemistry Scoring**: A multi-factor matching algorithm considering strict preference gating, Jaccard similarity across lifestyle interests, age proximity, geographic distance decay, and love languages.
2. **Marching & Musical Harmony**: Deep connection vectors for brass enthusiasts, drumline & percussion players, parade marchers, fanfare performers, and live music lovers.
3. **Hardware-Encrypted Authentication**: Support for Email/Password, Google Sign-In, and Facebook Login with cryptographic token persistence using `flutter_secure_storage` (Android AES-256 EncryptedSharedPreferences and iOS Keychain Services).
4. **Interactive Profile Customization**: Multi-photo gallery management, interactive interest tag toggles, detailed relationship prompts, and customizable discovery radius.
5. **Interactive Live Web Simulator + Full Flutter 3.x Source Export**: A synchronized desktop/mobile preview environment allowing instant browser simulation and 1-click source code export for Android Studio, VS Code, and Xcode.

---

## 📱 Architecture & Features

### 1. Fluid Swipe Discovery Deck
- **Motion Physics**: 60fps drag-and-tilt physics with directional rotation, dynamic green `LIKE` stamp, red `PASS` stamp, and blue/gold `SUPER LIKE` trigger.
- **Micro-Actions**: Rewind/undo last swipe, instant pass, super-like star, like heart, and deep profile inspection modal.
- **Audio Voice Prompts**: Inline playable voice note player with live animated frequency bars.
- **Photo Carousel**: Touch zone navigation (tap left/right edges to flip photos, tap center to open profile).

### 2. Matching Recommendation Engine
- **Strict Preference Filtering**:
  - Gender preference (`all`, `female`, or `male`).
  - Age bracket restriction $[Age_{min}, Age_{max}]$.
  - Distance perimeter in kilometers.
  - Selfie-verification status filter.
- **Weighted Compatibility Formula** ($\text{Score} \in [62\%, 99\%]$):
  $$\text{Score} = \text{Score}_{\text{Passions}} (40\,\text{pts}) + \text{Bonus}_{\text{Marching}} (20\,\text{pts}) + \text{Score}_{\text{Distance}} (15\,\text{pts}) + \text{Score}_{\text{Age}} (15\,\text{pts}) + \text{Score}_{\text{LoveLanguage}} (10\,\text{pts})$$
- **Inspectable Chemistry Engine**: Tapping any match badge displays an itemized breakdown of compatibility points.

### 3. Authentication & Secure Storage
- **Email & Password**: Real-time form validation with password masking/unmasking.
- **Social Login**: Native Google Sign-In and Facebook Auth flows.
- **Secure Persistence**: Credentials stored in hardware-backed keystore/keychain, preventing unauthorized extraction.

### 4. User Profile & Editing Suite
- **Photo Management**: Upload from gallery/camera (`image_picker`), rearrange cover photo, delete photos.
- **Identity Fields**: Name, Age, Profession, Education, Height ($\text{cm}$), Zodiac sign, Love Language, and Headline.
- **Marching Heartbeat**: Custom field for musical role (e.g. Trumpet lead, Snare drummer, Colorguard captain, Trombone fanfare).
- **Interests Selector**: Interactive multi-chip selector across 14+ lifestyle categories.
- **Persona Switcher**: Instantly toggle between testing as a male lover (Liam) and female lover (Maya).

### 5. Conversations & Date Planning
- **New Matches Reel**: Horizontal story avatars with online presence rings.
- **Interactive Messenger**: Real-time chat bubbles, simulated audio voice notes, and automated replies.
- **Date Invitation Widget**: Single-tap in-chat date proposal (e.g., "Grab iced cortados at Velvet Coffee on Friday").

---

## 📂 Repository File Tree

```
├── .env.example                          # Environment variable configuration template
├── index.html                            # Web application entry point with synced SEO and fonts
├── metadata.json                         # AI Studio application metadata
├── package.json                          # Node.js dependencies & scripts
├── tsconfig.json                         # TypeScript compiler configuration
├── vite.config.ts                        # Vite bundler configuration
│
├── src/                                  # React & Web Simulator Source Code
│   ├── main.tsx                          # React DOM mount point
│   ├── App.tsx                           # Root application coordinator
│   ├── index.css                         # Global styles & Tailwind v4 dark variant
│   │
│   ├── types/
│   │   └── index.ts                      # TypeScript definitions (Profile, Filters, Chat, etc.)
│   │
│   ├── data/
│   │   ├── profiles.ts                   # Initial male & female lover profiles and chat data
│   │   └── flutterCode.ts                # Production Flutter 3.x / Dart codebase files
│   │
│   ├── services/
│   │   └── matchingAlgorithm.ts          # Mathematical compatibility recommendation engine
│   │
│   ├── components/
│   │   ├── TopBar.tsx                    # 3-Zone navigation header compliant with Top Bar Contract
│   │   ├── DeviceFrame.tsx               # iPhone 16 Pro, Google Pixel 9 & Responsive chassis
│   │   ├── SwipeCardDeck.tsx             # Motion-powered swipeable card deck with audio preview
│   │   ├── ProfileDetailModal.tsx        # Comprehensive profile sheet with vitals & prompts
│   │   ├── FilterSheet.tsx               # Match preference filter sheet (gender, age, distance)
│   │   ├── EditProfileModal.tsx          # Full profile editor (photos, bio, interests, preferences)
│   │   ├── AuthModal.tsx                 # Email/Password, Google & Facebook sign-in modal
│   │   ├── AlgorithmExplainerModal.tsx   # Detailed match chemistry formula breakdown
│   │   ├── MatchCelebrationModal.tsx     # "It's a Match!" celebration modal with confetti
│   │   ├── ChatView.tsx                  # Interactive messenger with simulated responses
│   │   ├── ExploreGrid.tsx               # Curated match collections by interest
│   │   ├── UserProfileView.tsx           # Profile management, settings, and persona switcher
│   │   └── FlutterCodeViewer.tsx         # In-app Flutter/Dart code explorer with 1-click copy
│   │
│   └── assets/
│       └── images/                       # High-fidelity portrait assets for male & female profiles
│           ├── profile_alex_male_*.jpg
│           ├── profile_sophia_female_*.jpg
│           ├── profile_marcus_male_*.jpg
│           ├── profile_elena_female_*.jpg
│           └── dating_lovers_hero_*.jpg
│
└── flutter_project/                      # Generated Flutter Source Files (also viewable in-app)
    ├── pubspec.yaml                      # Flutter dependencies and asset configuration
    ├── lib/
    │   ├── main.dart                     # Flutter application entry point & ThemeData
    │   ├── models/
    │   │   └── lover_profile.dart        # Strongly-typed Dart data classes
    │   ├── services/
    │   │   ├── matching_algorithm.dart   # Pure Dart DatingMatchingEngine class
    │   │   └── auth_service.dart         # FirebaseAuth, GoogleSignIn, FacebookAuth & SecureStorage
    │   ├── screens/
    │   │   ├── auth_screen.dart          # Tabbed Login / Sign-up UI with social buttons
    │   │   ├── discover_swipe_screen.dart# Flutter CardSwiper with like/pass callbacks
    │   │   └── profile_edit_screen.dart  # ImagePicker, Bio, Chips & Preference Sliders
    │   └── widgets/
    │       ├── swipe_card.dart           # Card presentation with scrims and badge overlays
    │       └── match_dialog.dart         # Mutual attraction celebration dialog
```

---

## 🛠️ Step-by-Step Build & Run Guide

### Option A: Running the Web Simulator (Node.js & Vite)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The interactive applet runs on `http://localhost:3000`.

3. **Compile & Lint**:
   ```bash
   npm run build
   npm run lint
   ```

---

### Option B: Building the Native Flutter Mobile App (iOS / Android / Web)

1. **Ensure Flutter SDK is Installed**:
   Make sure you have Flutter 3.3.0 or higher:
   ```bash
   flutter doctor
   ```

2. **Create New Flutter Project**:
   ```bash
   flutter create --org com.amora amora_dating_app
   cd amora_dating_app
   ```

3. **Configure `pubspec.yaml`**:
   Add the following dependencies to your `pubspec.yaml`:
   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     flutter_card_swiper: ^7.0.1
     google_fonts: ^6.2.1
     lucide_icons: ^0.257.0
     cached_network_image: ^3.3.1
     confetti: ^0.7.0
     provider: ^6.1.2
     intl: ^0.19.0
     flutter_animate: ^4.5.0
     firebase_core: ^3.1.0
     firebase_auth: ^5.1.0
     google_sign_in: ^6.2.1
     flutter_facebook_auth: ^7.1.1
     flutter_secure_storage: ^9.2.2
     image_picker: ^1.1.2
     audioplayers: ^6.0.0
   ```

4. **Install Packages**:
   ```bash
   flutter pub get
   ```

5. **Place Source Files in `lib/`**:
   Copy the files from the in-app **Flutter / Dart Source** viewer into your Flutter project:
   - `lib/main.dart`
   - `lib/models/lover_profile.dart`
   - `lib/services/matching_algorithm.dart`
   - `lib/services/auth_service.dart`
   - `lib/screens/auth_screen.dart`
   - `lib/screens/discover_swipe_screen.dart`
   - `lib/screens/profile_edit_screen.dart`
   - `lib/widgets/swipe_card.dart`

6. **Run on Target Device**:
   - **Chrome Web Preview**:
     ```bash
     flutter run -d chrome
     ```
   - **Android Emulator / Device**:
     ```bash
     flutter run -d android
     ```
   - **iOS Simulator** (macOS only):
     ```bash
     flutter run -d ios
     ```

---

## 🔒 Security & Privacy Implementation

- **No Secrets in Frontend**: Client builds use OAuth tokens and secure storage keys.
- **Hardware Keychain**: In iOS, tokens are saved with `KeychainAccessibility.first_unlock`. In Android, AES-256 encrypted shared preferences are protected via the Android Keystore.
- **Incognito Browsing**: Allows users to hide their card from the global discovery deck until they explicitly swipe right on a profile.
- **Selfie Verification**: Verification badge flags authenticity and prevents bot accounts.

---

## 🎨 Design Principles & Compliance

- **Zero-Pill Discipline**: Metadata uses unboxed typography with elegant typographic separators (`·`, `/`).
- **WCAG AA Compliance**: High-contrast scrims (`bg-gradient-to-t from-stone-950 via-stone-950/50`) ensure $\ge 4.5:1$ contrast on photography.
- **Dual-Theme Support**: Dark mode optical compensation with seamless light and dark palette transitions.
- **Touch-First Thumb Ergonomics**: Interactive targets $\ge 44\text{px} \times 44\text{px}$, with critical navigation controls pinned within natural thumb reach.

---

## 📄 License

This application is distributed under the Apache-2.0 License.
