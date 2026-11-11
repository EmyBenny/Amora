import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/notification_service.dart';
import '../models/app_notification.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  IconData _getTypeIcon(NotificationType type) {
    switch (type) {
      case NotificationType.newMatch:
        return Icons.favorite;
      case NotificationType.superLike:
        return Icons.star;
      case NotificationType.message:
        return Icons.chat_bubble;
      case NotificationType.dateInvite:
        return Icons.calendar_today;
      case NotificationType.marchingEvent:
        return Icons.music_note;
      case NotificationType.chemistryAlert:
        return Icons.auto_awesome;
    }
  }

  Color _getTypeColor(NotificationType type) {
    switch (type) {
      case NotificationType.newMatch:
      case NotificationType.chemistryAlert:
        return const Color(0xFFE11D48);
      case NotificationType.superLike:
        return Colors.amber.shade700;
      case NotificationType.message:
        return Colors.blue;
      case NotificationType.dateInvite:
        return Colors.purple;
      case NotificationType.marchingEvent:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    final notifService = context.watch<NotificationService>();
    final notifications = notifService.notifications;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFFE11D48),
          labelColor: const Color(0xFFE11D48),
          isScrollable: true,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Matches'),
            Tab(text: 'Messages'),
            Tab(text: 'Events'),
          ],
        ),
        actions: [
          if (notifService.unreadCount > 0)
            TextButton.icon(
              onPressed: () => notifService.markAllAsRead(),
              icon: const Icon(Icons.done_all, size: 18),
              label: const Text('Mark read'),
            ),
        ],
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildList(notifications, notifService),
          _buildList(
            notifications.where((n) => n.type == NotificationType.newMatch || n.type == NotificationType.superLike).toList(),
            notifService,
          ),
          _buildList(
            notifications.where((n) => n.type == NotificationType.message || n.type == NotificationType.dateInvite).toList(),
            notifService,
          ),
          _buildList(
            notifications.where((n) => n.type == NotificationType.marchingEvent).toList(),
            notifService,
          ),
        ],
      ),
    );
  }

  Widget _buildList(List<AppNotification> items, NotificationService service) {
    if (items.isEmpty) {
      return const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.notifications_none, size: 54, color: Colors.grey),
            SizedBox(height: 12),
            Text('No notifications here', style: TextStyle(color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: items.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final item = items[index];
        return Dismissible(
          key: Key(item.id),
          direction: DismissDirection.endToStart,
          background: Container(
            color: Colors.red,
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.only(right: 20),
            child: const Icon(Icons.delete, color: Colors.white),
          ),
          onDismissed: (_) => service.deleteNotification(item.id),
          child: ListTile(
            tileColor: item.read ? null : const Color(0xFFE11D48).withOpacity(0.04),
            leading: CircleAvatar(
              backgroundColor: _getTypeColor(item.type).withOpacity(0.15),
              child: Icon(_getTypeIcon(item.type), color: _getTypeColor(item.type), size: 20),
            ),
            title: Text(
              item.title,
              style: TextStyle(fontWeight: item.read ? FontWeight.normal : FontWeight.bold),
            ),
            subtitle: Text(item.body, maxLines: 2, overflow: TextOverflow.ellipsis),
            trailing: item.read
                ? null
                : Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Color(0xFFE11D48),
                      shape: BoxShape.circle,
                    ),
                  ),
            onTap: () {
              if (!item.read) service.markAsRead(item.id);
            },
          ),
        );
      },
    );
  }
}
