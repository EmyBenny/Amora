import 'dart:math';
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
  static CompatibilityResult calculateCompatibility({
    required LoverProfile user,
    required UserPreferences preferences,
    required LoverProfile candidate,
  }) {
    final genderMatch = preferences.genderPreference == 'all' ||
        candidate.gender == preferences.genderPreference;

    final ageMatch = candidate.age >= preferences.ageRange.start &&
        candidate.age <= preferences.ageRange.end;

    final distanceMatch = candidate.distanceKm <= preferences.maxDistanceKm;
    final verifiedMatch = !preferences.onlyVerified || candidate.verified;

    final isHardMatch = genderMatch && ageMatch && distanceMatch && verifiedMatch;

    final userPassions = user.passions.map((p) => p.toLowerCase().trim()).toSet();
    final candidatePassions = candidate.passions.map((p) => p.toLowerCase().trim()).toSet();

    final sharedPassions = candidatePassions.intersection(userPassions).toList();
    final unionCount = userPassions.union(candidatePassions).length;

    final double jaccardRatio = unionCount > 0 ? sharedPassions.length / unionCount : 0.0;
    final int passionScore = min(40, (jaccardRatio * 60 + sharedPassions.length * 6).round());

    int marchingBonus = 6;
    const marchingKeywords = ['marching', 'brass', 'trumpet', 'drumline', 'percussion', 'trombone', 'cadence'];

    final bool userHasMarching = user.marchingLoveInterest != null ||
        user.passions.any((p) => marchingKeywords.any((kw) => p.toLowerCase().contains(kw)));
    final bool candidateHasMarching = candidate.marchingLoveInterest != null ||
        candidate.passions.any((p) => marchingKeywords.any((kw) => p.toLowerCase().contains(kw)));

    if (userHasMarching && candidateHasMarching) {
      marchingBonus = 20;
    } else if (userHasMarching || candidateHasMarching) {
      marchingBonus = 12;
    }

    final double distRatio = max(0.0, 1.0 - (candidate.distanceKm / (preferences.maxDistanceKm * 1.5)));
    final int distanceScore = (5 + distRatio * 10).round();

    final double targetMidAge = (preferences.ageRange.start + preferences.ageRange.end) / 2.0;
    final double ageDelta = (candidate.age - targetMidAge).abs();
    final int ageScore = max(4, (15 - ageDelta * 1.2).round());

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

    list.sort((a, b) => b.value.compareTo(a.value));
    return list.map((e) => e.key).toList();
  }
}
