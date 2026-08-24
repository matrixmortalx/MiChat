class Chat {
  final String id;
  final String type; // direct, group
  final String? name;
  final String? avatarUrl;
  final String lastMessage;
  final DateTime updatedAt;
  final List<String> memberIds;

  Chat({
    required this.id,
    required this.type,
    this.name,
    this.avatarUrl,
    required this.lastMessage,
    required this.updatedAt,
    required this.memberIds,
  });

  factory Chat.fromJson(Map<String, dynamic> json) {
    return Chat(
      id: json['id'],
      type: json['type'],
      name: json['name'],
      avatarUrl: json['avatar_url'],
      lastMessage: json['last_message'] ?? '',
      updatedAt: DateTime.parse(json['updated_at']),
      memberIds: List<String>.from(json['member_ids'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'name': name,
      'avatar_url': avatarUrl,
      'last_message': lastMessage,
      'updated_at': updatedAt.toIso8601String(),
      'member_ids': memberIds,
    };
  }
}
