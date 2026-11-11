import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/app_notification.dart';

class NotificationPreferences {
  final bool matchAlerts;
  final bool messageAlerts;
  final bool marchingAlerts;
  final bool soundEnabled;
  final bool vibrationEnabled;

  const NotificationPreferences({
    this.matchAlerts = true,
    this.messageAlerts = true,
    this.marchingAlerts = true,
    this.soundEnabled = true,
    this.vibrationEnabled = true,
  });

  NotificationPreferences copyWith({
    bool? matchAlerts,
    bool? messageAlerts,
    bool? marchingAlerts,
    bool? soundEnabled,
    bool? vibrationEnabled,
  }) {
    return NotificationPreferences(
      matchAlerts: matchAlerts ?? this.matchAlerts,
      messageAlerts: messageAlerts ?? this.messageAlerts,
      marchingAlerts: marchingAlerts ?? this.marchingAlerts,
      soundEnabled: soundEnabled ?? this.soundEnabled,
      vibrationEnabled: vibrationEnabled ?? this.vibrationEnabled,
    );
  }
}

class NotificationService extends ChangeNotifier {
  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();

  List<AppNotification> _notifications = [];
  NotificationPreferences _preferences = const NotificationPreferences();
  bool _isInitialized = false;

  List<AppNotification> get notifications => List.unmodifiable(_notifications);
  NotificationPreferences get preferences => _preferences;
  int get unreadCount => _notifications.where((n) => !n.read).length;

  Future<void> initialize() async {
    if (_isInitialized) return;

    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(android: androidSettings, iOS: iosSettings);
    await _localNotifications.initialize(initSettings);
    _isInitialized = true;
    notifyListeners();
  }

  void addNotification(AppNotification notification) {
    _notifications = [notification, ..._notifications];
    notifyListeners();

    // Trigger local push banner if preferences allow
    if (_shouldTriggerPush(notification.type)) {
      _showLocalPush(notification);
    }
  }

  bool _shouldTriggerPush(NotificationType type) {
    switch (type) {
      case NotificationType.newMatch:
      case NotificationType.superLike:
      case NotificationType.chemistryAlert:
        return _preferences.matchAlerts;
      case NotificationType.message:
      case NotificationType.dateInvite:
        return _preferences.messageAlerts;
      case NotificationType.marchingEvent:
        return _preferences.marchingAlerts;
    }
  }

  Future<void> _showLocalPush(AppNotification notification) async {
    const androidDetails = AndroidNotificationDetails(
      'amora_notifications',
      'Amora Alerts',
      channelDescription: 'Matches, messages and marching cadence alerts',
      importance: Importance.high,
      priority: Priority.high,
    );
    const iosDetails = DarwinNotificationDetails();
    const details = NotificationDetails(android: androidDetails, iOS: iosDetails);

    await _localNotifications.show(
      notification.id.hashCode,
      notification.title,
      notification.body,
      details,
    );
  }

  void markAsRead(String id) {
    _notifications = _notifications.map((n) {
      if (n.id == id) return n.copyWith(read: true);
      return n;
    }).toList();
    notifyListeners();
  }

  void markAllAsRead() {
    _notifications = _notifications.map((n) => n.copyWith(read: true)).toList();
    notifyListeners();
  }

  void deleteNotification(String id) {
    _notifications = _notifications.where((n) => n.id != id).toList();
    notifyListeners();
  }

  void updatePreferences(NotificationPreferences newPrefs) {
    _preferences = newPrefs;
    notifyListeners();
  }
}
