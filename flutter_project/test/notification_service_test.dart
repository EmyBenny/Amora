import 'package:flutter_test/flutter_test.dart';
import 'package:amora_dating_app/models/app_notification.dart';
import 'package:amora_dating_app/services/notification_service.dart';

void main() {
  group('NotificationService Tests', () {
    late NotificationService service;

    setUp(() {
      service = NotificationService();
    });

    test('Initial notification list is empty with 0 unread', () {
      expect(service.notifications.isEmpty, true);
      expect(service.unreadCount, 0);
    });

    test('Adding unread notification increments unreadCount', () {
      final notif = AppNotification(
        id: 'n1',
        type: NotificationType.newMatch,
        title: 'New Match!',
        body: 'You and Sophia liked each other.',
        timestamp: DateTime.now(),
        read: false,
      );

      service.addNotification(notif);
      expect(service.notifications.length, 1);
      expect(service.unreadCount, 1);
    });

    test('Marking notification as read decrements unreadCount', () {
      final notif = AppNotification(
        id: 'n2',
        type: NotificationType.message,
        title: 'New Message',
        body: 'Hey Liam, see you at the brass fanfare!',
        timestamp: DateTime.now(),
        read: false,
      );

      service.addNotification(notif);
      expect(service.unreadCount, 1);

      service.markAsRead('n2');
      expect(service.unreadCount, 0);
      expect(service.notifications.first.read, true);
    });

    test('Mark all as read sets all items read to true', () {
      service.addNotification(AppNotification(
        id: 'n3',
        type: NotificationType.superLike,
        title: 'Super Like',
        body: 'Someone super liked you.',
        timestamp: DateTime.now(),
        read: false,
      ));
      service.addNotification(AppNotification(
        id: 'n4',
        type: NotificationType.marchingEvent,
        title: 'Marching Parade',
        body: 'Annual drumline rehearsal this Sunday.',
        timestamp: DateTime.now(),
        read: false,
      ));

      expect(service.unreadCount, 2);
      service.markAllAsRead();
      expect(service.unreadCount, 0);
    });

    test('Deleting notification removes it from list', () {
      service.addNotification(AppNotification(
        id: 'n5',
        type: NotificationType.dateInvite,
        title: 'Date Invite',
        body: 'Coffee walk?',
        timestamp: DateTime.now(),
        read: false,
      ));

      expect(service.notifications.length, 1);
      service.deleteNotification('n5');
      expect(service.notifications.isEmpty, true);
    });
  });
}
