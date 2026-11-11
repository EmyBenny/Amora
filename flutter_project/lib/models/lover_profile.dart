class DatingPrompt {
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
