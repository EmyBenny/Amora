export interface FlutterCodeFile {
  path: string;
  filename: string;
  language: 'dart' | 'yaml';
  description: string;
  content: string;
}

export const FLUTTER_CODEBASE: FlutterCodeFile[] = [
  {
    path: 'pubspec.yaml',
    filename: 'pubspec.yaml',
    language: 'yaml',
    description: 'Flutter dependencies with Firebase Auth, Social Login, Secure Storage & Image Picker',
    content: `name: amora_dating_app
description: "A modern cross-platform mobile application for dating and matching lovers."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.3.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  # UI & Components
  flutter_card_swiper: ^7.0.1
  google_fonts: ^6.2.1
  lucide_icons: ^0.257.0
  cached_network_image: ^3.3.1
  confetti: ^0.7.0
  provider: ^6.1.2
  intl: ^0.19.0
  flutter_animate: ^4.5.0

  # Authentication & Secure Credential Storage
  firebase_core: ^3.1.0
  firebase_auth: ^5.1.0
  google_sign_in: ^6.2.1
  flutter_facebook_auth: ^7.1.1
  flutter_secure_storage: ^9.2.2

  # Media & Profile Management
  image_picker: ^1.1.2
  audioplayers: ^6.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`,
  },
  {
    path: 'lib/services/matching_algorithm.dart',
    filename: 'matching_algorithm.dart',
    language: 'dart',
    description: 'Pure Dart matching algorithm: preference gates, Jaccard passion overlap, marching harmony & distance decay',
    content: `import 'dart:math';
import '../models/lover_profile.dart';

class UserPreferences {
  final String genderPreference; // 'all', 'female', 'male'
  final RangeValues ageRange;
  final double maxDistanceKm;
  final bool onlyVerified;
  final String? passionFilter;

  const UserPreferences({
    this.genderPreference = 'all',
    this.ageRange = const RangeValues(20, 35),
    this.maxDistanceKm = 25.0,
    this.onlyVerified = false,
    this.passionFilter,
  });
}

class CompatibilityResult {
  final int totalScore; // 0 to 100
  final int passionScore; // max 40
  final int marchingBonus; // max 20
  final int distanceScore; // max 15
  final int ageScore; // max 15
  final int loveLanguageScore; // max 10
  final List<String> sharedPassions;
  final bool isHardMatch;

  const CompatibilityResult({
    required this.totalScore,
    required this.passionScore,
    required this.marchingBonus,
    required this.distanceScore,
    required this.ageScore,
    required this.loveLanguageScore,
    required this.sharedPassions,
    required this.isHardMatch,
  });
}

class DatingMatchingEngine {
  /// Core recommendation algorithm calculating compatibility between user and candidate
  static CompatibilityResult calculateCompatibility({
    required LoverProfile user,
    required UserPreferences preferences,
    required LoverProfile candidate,
  }) {
    // 1. Preference Gating
    final genderMatch = preferences.genderPreference == 'all' ||
        candidate.gender == preferences.genderPreference;

    final ageMatch = candidate.age >= preferences.ageRange.start &&
        candidate.age <= preferences.ageRange.end;

    final distanceMatch = candidate.distanceKm <= preferences.maxDistanceKm;
    final verifiedMatch = !preferences.onlyVerified || candidate.verified;

    final isHardMatch = genderMatch && ageMatch && distanceMatch && verifiedMatch;

    // 2. Jaccard Similarity on Shared Passions (Max 40 points)
    final userPassions = user.passions.map((p) => p.toLowerCase().trim()).toSet();
    final candidatePassions = candidate.passions.map((p) => p.toLowerCase().trim()).toSet();

    final sharedPassions = candidatePassions.intersection(userPassions).toList();
    final unionCount = userPassions.union(candidatePassions).length;

    final double jaccardRatio = unionCount > 0 ? sharedPassions.length / unionCount : 0.0;
    final int passionScore = min(40, (jaccardRatio * 60 + sharedPassions.length * 6).round());

    // 3. Marching Band & Musical Harmony Bonus (Max 20 points)
    int marchingBonus = 6;
    const marchingKeywords = ['marching', 'brass', 'trumpet', 'drumline', 'percussion', 'trombone', 'cadence'];

    final bool userHasMarching = user.marchingLoveInterest != null ||
        user.passions.any((p) => marchingKeywords.any((kw) => p.toLowerCase().contains(kw)));
    final bool candidateHasMarching = candidate.marchingLoveInterest != null ||
        candidate.passions.any((p) => marchingKeywords.any((kw) => p.toLowerCase().contains(kw)));

    if (userHasMarching && candidateHasMarching) {
      marchingBonus = 20; // Maximum music & marching connection
    } else if (userHasMarching || candidateHasMarching) {
      marchingBonus = 12;
    }

    // 4. Geographic Proximity Decay (Max 15 points)
    final double distRatio = max(0.0, 1.0 - (candidate.distanceKm / (preferences.maxDistanceKm * 1.5)));
    final int distanceScore = (5 + distRatio * 10).round();

    // 5. Age Proximity Affinity (Max 15 points)
    final double targetMidAge = (preferences.ageRange.start + preferences.ageRange.end) / 2.0;
    final double ageDelta = (candidate.age - targetMidAge).abs();
    final int ageScore = max(4, (15 - ageDelta * 1.2).round());

    // 6. Love Language Compatibility (Max 10 points)
    int loveLanguageScore = 5;
    if (user.loveLanguage.toLowerCase() == candidate.loveLanguage.toLowerCase() ||
        user.loveLanguage.toLowerCase().contains(candidate.loveLanguage.toLowerCase())) {
      loveLanguageScore = 10;
    }

    final int rawTotal = passionScore + marchingBonus + distanceScore + ageScore + loveLanguageScore;
    final int totalScore = min(99, max(62, rawTotal));

    return CompatibilityResult(
      totalScore: totalScore,
      passionScore: passionScore,
      marchingBonus: marchingBonus,
      distanceScore: distanceScore,
      ageScore: ageScore,
      loveLanguageScore: loveLanguageScore,
      sharedPassions: sharedPassions,
      isHardMatch: isHardMatch,
    );
  }

  /// Returns sorted candidate suggestions ranked by compatibility score
  static List<LoverProfile> getSuggestedMatches({
    required LoverProfile user,
    required UserPreferences preferences,
    required List<LoverProfile> candidates,
  }) {
    final list = <MapEntry<LoverProfile, int>>[];

    for (final candidate in candidates) {
      final res = calculateCompatibility(
        user: user,
        preferences: preferences,
        candidate: candidate,
      );
      if (res.isHardMatch) {
        list.add(MapEntry(candidate.copyWith(matchScore: res.totalScore), res.totalScore));
      }
    }

    // Sort descending by calculated compatibility
    list.sort((a, b) => b.value.compareTo(a.value));
    return list.map((e) => e.key).toList();
  }
}
`,
  },
  {
    path: 'lib/services/auth_service.dart',
    filename: 'auth_service.dart',
    language: 'dart',
    description: 'Firebase Auth & Social Login (Google & Facebook) with Flutter Secure Storage',
    content: `import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  User? _currentUser;
  bool _isLoading = false;

  User? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoading => _isLoading;

  AuthService() {
    _auth.authStateChanges().listen((user) {
      _currentUser = user;
      notifyListeners();
    });
  }

  /// Email & Password Sign Up
  Future<UserCredential> signUpWithEmail({
    required String email,
    required String password,
    required String displayName,
  }) async {
    try {
      _setLoading(true);
      final cred = await _auth.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      await cred.user?.updateDisplayName(displayName);

      // Securely store credentials / session tokens
      await _saveSecureSession(cred.user?.uid ?? '', email, 'email');
      return cred;
    } finally {
      _setLoading(false);
    }
  }

  /// Email & Password Log In
  Future<UserCredential> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      _setLoading(true);
      final cred = await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      await _saveSecureSession(cred.user?.uid ?? '', email, 'email');
      return cred;
    } finally {
      _setLoading(false);
    }
  }

  /// Google Social Sign In
  Future<UserCredential?> signInWithGoogle() async {
    try {
      _setLoading(true);
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null;

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final cred = await _auth.signInWithCredential(credential);
      await _saveSecureSession(
        cred.user?.uid ?? '',
        cred.user?.email ?? '',
        'google',
        token: googleAuth.idToken,
      );
      return cred;
    } finally {
      _setLoading(false);
    }
  }

  /// Facebook Social Sign In
  Future<UserCredential?> signInWithFacebook() async {
    try {
      _setLoading(true);
      final LoginResult result = await FacebookAuth.instance.login(
        permissions: ['email', 'public_profile'],
      );

      if (result.status == LoginStatus.success && result.accessToken != null) {
        final OAuthCredential credential = FacebookAuthProvider.credential(
          result.accessToken!.tokenString,
        );
        final cred = await _auth.signInWithCredential(credential);
        await _saveSecureSession(
          cred.user?.uid ?? '',
          cred.user?.email ?? '',
          'facebook',
          token: result.accessToken!.tokenString,
        );
        return cred;
      }
      return null;
    } finally {
      _setLoading(false);
    }
  }

  /// Secure Storage Persistence using Hardware Keystore / iOS Keychain
  Future<void> _saveSecureSession(String uid, String email, String provider, {String? token}) async {
    await _secureStorage.write(key: 'auth_uid', value: uid);
    await _secureStorage.write(key: 'auth_email', value: email);
    await _secureStorage.write(key: 'auth_provider', value: provider);
    if (token != null) {
      await _secureStorage.write(key: 'auth_token', value: token);
    }
  }

  /// Sign Out and Clear Secure Storage
  Future<void> signOut() async {
    await _auth.signOut();
    await _googleSignIn.signOut();
    await FacebookAuth.instance.logOut();
    await _secureStorage.deleteAll();
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
`,
  },
  {
    path: 'lib/screens/auth_screen.dart',
    filename: 'auth_screen.dart',
    language: 'dart',
    description: 'Flutter Authentication Screen: Email/Password, Google & Facebook Login UI',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _loginFormKey = GlobalKey<FormState>();
  final _signUpFormKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authService = context.watch<AuthService>();

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Brand Logo & Heading
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFE11D48), Color(0xFFFB7185)],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFE11D48).withOpacity(0.3),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.favorite, size: 40, color: Colors.white),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Amora',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Fraunces',
                  ),
                ),
                const Text(
                  'Dating & Matching for Music & Marching Lovers',
                  style: TextStyle(fontSize: 13, color: Colors.grey),
                ),
                const SizedBox(height: 24),

                // Social Login Buttons
                OutlinedButton.icon(
                  onPressed: authService.isLoading ? null : () => authService.signInWithGoogle(),
                  icon: const Icon(Icons.g_mobiledata, size: 28, color: Colors.red),
                  label: const Text('Continue with Google'),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 10),
                FilledButton.icon(
                  onPressed: authService.isLoading ? null : () => authService.signInWithFacebook(),
                  icon: const Icon(Icons.facebook, size: 22, color: Colors.white),
                  label: const Text('Continue with Facebook'),
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF1877F2),
                    minimumSize: const Size.fromHeight(48),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),

                const SizedBox(height: 20),
                const Row(
                  children: [
                    Expanded(child: Divider()),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12),
                      child: Text('OR EMAIL', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    ),
                    Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: 16),

                // Tab Switcher (Log In / Sign Up)
                TabBar(
                  controller: _tabController,
                  indicatorColor: const Color(0xFFE11D48),
                  labelColor: const Color(0xFFE11D48),
                  tabs: const [Tab(text: 'Log In'), Tab(text: 'Sign Up')],
                ),
                const SizedBox(height: 16),

                SizedBox(
                  height: 280,
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      // LOGIN FORM
                      Form(
                        key: _loginFormKey,
                        child: Column(
                          children: [
                            TextFormField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              decoration: InputDecoration(
                                labelText: 'Email',
                                prefixIcon: const Icon(Icons.email_outlined),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              validator: (v) => v!.contains('@') ? null : 'Invalid email',
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              decoration: InputDecoration(
                                labelText: 'Password',
                                prefixIcon: const Icon(Icons.lock_outline),
                                suffixIcon: IconButton(
                                  icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                                ),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              validator: (v) => v!.length >= 6 ? null : 'Min 6 characters',
                            ),
                            const Spacer(),
                            FilledButton(
                              onPressed: authService.isLoading
                                  ? null
                                  : () {
                                      if (_loginFormKey.currentState!.validate()) {
                                        authService.signInWithEmail(
                                          email: _emailController.text,
                                          password: _passwordController.text,
                                        );
                                      }
                                    },
                              style: FilledButton.styleFrom(
                                backgroundColor: const Color(0xFFE11D48),
                                minimumSize: const Size.fromHeight(50),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              ),
                              child: const Text('Log In Securely'),
                            ),
                          ],
                        ),
                      ),

                      // SIGN UP FORM
                      Form(
                        key: _signUpFormKey,
                        child: Column(
                          children: [
                            TextFormField(
                              controller: _nameController,
                              decoration: InputDecoration(
                                labelText: 'Full Name',
                                prefixIcon: const Icon(Icons.person_outline),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              validator: (v) => v!.isNotEmpty ? null : 'Enter name',
                            ),
                            const SizedBox(height: 10),
                            TextFormField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              decoration: InputDecoration(
                                labelText: 'Email',
                                prefixIcon: const Icon(Icons.email_outlined),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              validator: (v) => v!.contains('@') ? null : 'Invalid email',
                            ),
                            const SizedBox(height: 10),
                            TextFormField(
                              controller: _passwordController,
                              obscureText: true,
                              decoration: InputDecoration(
                                labelText: 'Password',
                                prefixIcon: const Icon(Icons.lock_outline),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              validator: (v) => v!.length >= 6 ? null : 'Min 6 characters',
                            ),
                            const Spacer(),
                            FilledButton(
                              onPressed: authService.isLoading
                                  ? null
                                  : () {
                                      if (_signUpFormKey.currentState!.validate()) {
                                        authService.signUpWithEmail(
                                          displayName: _nameController.text,
                                          email: _emailController.text,
                                          password: _passwordController.text,
                                        );
                                      }
                                    },
                              style: FilledButton.styleFrom(
                                backgroundColor: const Color(0xFFE11D48),
                                minimumSize: const Size.fromHeight(50),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              ),
                              child: const Text('Create Account'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/profile_edit_screen.dart',
    filename: 'profile_edit_screen.dart',
    language: 'dart',
    description: 'Flutter Profile Page: Photo upload with ImagePicker, Bio, Interests & Dating Preferences',
    content: `import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/lover_profile.dart';
import '../services/matching_algorithm.dart';

class ProfileEditScreen extends StatefulWidget {
  final LoverProfile profile;
  final UserPreferences preferences;
  final Function(LoverProfile, UserPreferences) onSave;

  const ProfileEditScreen({
    super.key,
    required this.profile,
    required this.preferences,
    required this.onSave,
  });

  @override
  State<ProfileEditScreen> createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends State<ProfileEditScreen> {
  final _picker = ImagePicker();
  late TextEditingController _headlineController;
  late TextEditingController _bioController;
  late TextEditingController _marchingController;
  late List<String> _photos;
  late List<String> _selectedPassions;

  // Preferences
  late String _genderPreference;
  late RangeValues _ageRange;
  late double _maxDistance;

  final List<String> _allPassions = [
    'Marching & Brass',
    'Drumline & Percussion',
    'Coffee Crawls',
    'Vinyl Records',
    'Jazz Fusion',
    '35mm Film',
    'Trail Running',
    'Italian Cooking',
    'Pottery & Ceramics',
    'Acoustic Jamming',
    'Bouldering',
  ];

  @override
  void initState() {
    super.initState();
    _headlineController = TextEditingController(text: widget.profile.headline);
    _bioController = TextEditingController(text: widget.profile.bio);
    _marchingController = TextEditingController(text: widget.profile.marchingLoveInterest ?? '');
    _photos = List.from(widget.profile.photos);
    _selectedPassions = List.from(widget.profile.passions);

    _genderPreference = widget.preferences.genderPreference;
    _ageRange = widget.preferences.ageRange;
    _maxDistance = widget.preferences.maxDistanceKm;
  }

  Future<void> _pickPhoto() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (image != null) {
      setState(() {
        _photos.add(image.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Dating Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.check, color: Color(0xFFE11D48)),
            onPressed: () {
              final updatedProfile = widget.profile.copyWith(
                headline: _headlineController.text,
                bio: _bioController.text,
                marchingLoveInterest: _marchingController.text,
                photos: _photos,
                passions: _selectedPassions,
              );
              final updatedPreferences = UserPreferences(
                genderPreference: _genderPreference,
                ageRange: _ageRange,
                maxDistanceKm: _maxDistance,
              );
              widget.onSave(updatedProfile, updatedPreferences);
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 1. Photos Section
          const Text('Photos', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          SizedBox(
            height: 120,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                ..._photos.asMap().entries.map((entry) {
                  final idx = entry.key;
                  final path = entry.value;
                  return Stack(
                    children: [
                      Container(
                        width: 90,
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          image: DecorationImage(image: NetworkImage(path), fit: BoxFit.cover),
                        ),
                      ),
                      Positioned(
                        top: 4,
                        right: 12,
                        child: GestureDetector(
                          onTap: () => setState(() => _photos.removeAt(idx)),
                          child: const CircleAvatar(
                            radius: 10,
                            backgroundColor: Colors.black54,
                            child: Icon(Icons.close, size: 12, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  );
                }),
                InkWell(
                  onTap: _pickPhoto,
                  child: Container(
                    width: 90,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade400, style: BorderStyle.solid),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.add_a_photo, color: Colors.grey),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 2. Headline & Bio Section
          const Text('About You', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          TextField(
            controller: _headlineController,
            decoration: const InputDecoration(
              labelText: 'Headline',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _bioController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Bio',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _marchingController,
            decoration: const InputDecoration(
              labelText: 'Marching & Musical Passions',
              prefixIcon: Icon(Icons.music_note, color: Colors.amber),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 24),

          // 3. Passions & Interests Chips
          const Text('Select Interests', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _allPassions.map((passion) {
              final isSelected = _selectedPassions.contains(passion);
              return FilterChip(
                label: Text(passion),
                selected: isSelected,
                selectedColor: const Color(0xFFE11D48).withOpacity(0.2),
                checkmarkColor: const Color(0xFFE11D48),
                onSelected: (val) {
                  setState(() {
                    if (val) {
                      _selectedPassions.add(passion);
                    } else {
                      _selectedPassions.remove(passion);
                    }
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // 4. Dating Preferences
          const Text('Dating Preferences', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'all', label: Text('Everyone')),
              ButtonSegment(value: 'female', label: Text('Women')),
              ButtonSegment(value: 'male', label: Text('Men')),
            ],
            selected: {_genderPreference},
            onSelectionChanged: (val) => setState(() => _genderPreference = val.first),
          ),
          const SizedBox(height: 16),
          Text('Age Range: \${_ageRange.start.round()} - \${_ageRange.end.round()} years'),
          RangeSlider(
            values: _ageRange,
            min: 18,
            max: 65,
            divisions: 47,
            activeColor: const Color(0xFFE11D48),
            onChanged: (vals) => setState(() => _ageRange = vals),
          ),
          const SizedBox(height: 12),
          Text('Max Distance: \${_maxDistance.round()} km'),
          Slider(
            value: _maxDistance,
            min: 2,
            max: 50,
            divisions: 48,
            activeColor: const Color(0xFFE11D48),
            onChanged: (v) => setState(() => _maxDistance = v),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/main.dart',
    filename: 'main.dart',
    language: 'dart',
    description: 'Flutter App Entry point with Material 3 Theme & Navigation',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/discover_swipe_screen.dart';
import 'screens/matches_screen.dart';
import 'screens/explore_screen.dart';
import 'screens/profile_screen.dart';
import 'services/auth_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
      ],
      child: const AmoraDatingApp(),
    ),
  );
}

class AmoraDatingApp extends StatelessWidget {
  const AmoraDatingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Amora - Dating & Matching Lovers',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFFAF9F6),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFE11D48),
          primary: const Color(0xFFE11D48),
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF090D16),
        colorScheme: ColorScheme.fromSeed(
          brightness: Brightness.dark,
          seedColor: const Color(0xFFF43F5E),
          primary: const Color(0xFFF43F5E),
          surface: const Color(0xFF131B2E),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DiscoverSwipeScreen(),
    ExploreScreen(),
    MatchesScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          HapticFeedback.selectionClick();
          setState(() => _currentIndex = index);
        },
        height: 64,
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        indicatorColor: const Color(0xFFF43F5E).withOpacity(0.15),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.favorite_border),
            selectedIcon: Icon(Icons.favorite, color: Color(0xFFE11D48)),
            label: 'Discover',
          ),
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore, color: Color(0xFFE11D48)),
            label: 'Explore',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_bubble_outline),
            selectedIcon: Icon(Icons.chat_bubble, color: Color(0xFFE11D48)),
            label: 'Matches',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: Color(0xFFE11D48)),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/models/lover_profile.dart',
    filename: 'lover_profile.dart',
    language: 'dart',
    description: 'Data model class for Lover Profiles and Prompts',
    content: `class DatingPrompt {
  final String question;
  final String answer;

  const DatingPrompt({
    required this.question,
    required this.answer,
  });
}

class LoverProfile {
  final String id;
  final String name;
  final int age;
  final String gender;
  final String headline;
  final String bio;
  final double distanceKm;
  final List<String> photos;
  final bool verified;
  final int matchScore;
  final List<String> passions;
  final String? marchingLoveInterest;
  final String occupation;
  final String education;
  final int heightCm;
  final String loveLanguage;
  final String zodiac;
  final List<DatingPrompt> prompts;

  const LoverProfile({
    required this.id,
    required this.name,
    required this.age,
    required this.gender,
    required this.headline,
    required this.bio,
    required this.distanceKm,
    required this.photos,
    required this.verified,
    required this.matchScore,
    required this.passions,
    this.marchingLoveInterest,
    required this.occupation,
    required this.education,
    required this.heightCm,
    required this.loveLanguage,
    required this.zodiac,
    required this.prompts,
  });

  LoverProfile copyWith({
    String? id,
    String? name,
    int? age,
    String? gender,
    String? headline,
    String? bio,
    double? distanceKm,
    List<String>? photos,
    bool? verified,
    int? matchScore,
    List<String>? passions,
    String? marchingLoveInterest,
    String? occupation,
    String? education,
    int? heightCm,
    String? loveLanguage,
    String? zodiac,
    List<DatingPrompt>? prompts,
  }) {
    return LoverProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      headline: headline ?? this.headline,
      bio: bio ?? this.bio,
      distanceKm: distanceKm ?? this.distanceKm,
      photos: photos ?? this.photos,
      verified: verified ?? this.verified,
      matchScore: matchScore ?? this.matchScore,
      passions: passions ?? this.passions,
      marchingLoveInterest: marchingLoveInterest ?? this.marchingLoveInterest,
      occupation: occupation ?? this.occupation,
      education: education ?? this.education,
      heightCm: heightCm ?? this.heightCm,
      loveLanguage: loveLanguage ?? this.loveLanguage,
      zodiac: zodiac ?? this.zodiac,
      prompts: prompts ?? this.prompts,
    );
  }
}
`,
  },
];
