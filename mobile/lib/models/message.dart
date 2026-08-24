class Message {
  final String id;
  final String chatId;
  final String senderId;
  final String senderName;
  final String? senderAvatarUrl;
  final String content;
  final String type; // text, image, video, file
  final String status; // sent, delivered, read
  final DateTime createdAt;
  final DateTime? editedAt;
  final DateTime? deletedAt;
  final String? replyToId;

  Message({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.senderName,
    this.senderAvatarUrl,
    required this.content,
    this.type = 'text',
    this.status = 'sent',
    required this.createdAt,
    this.editedAt,
    this.deletedAt,
    this.replyToId,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'],
      chatId: json['chat_id'],
      senderId: json['sender_id'],
      senderName: json['full_name'],
      senderAvatarUrl: json['avatar_url'],
      content: json['content'],
      type: json['type'] ?? 'text',
      status: json['status'] ?? 'sent',
      createdAt: DateTime.parse(json['created_at']),
      editedAt: json['edited_at'] != null ? DateTime.parse(json['edited_at']) : null,
      deletedAt: json['deleted_at'] != null ? DateTime.parse(json['deleted_at']) : null,
      replyToId: json['reply_to_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'chat_id': chatId,
      'sender_id': senderId,
      'full_name': senderName,
      'avatar_url': senderAvatarUrl,
      'content': content,
      'type': type,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'edited_at': editedAt?.toIso8601String(),
      'deleted_at': deletedAt?.toIso8601String(),
      'reply_to_id': replyToId,
    };
  }
}
