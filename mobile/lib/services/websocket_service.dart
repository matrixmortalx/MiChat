import 'package:socket_io_client/socket_io_client.dart' as IO;

class WebSocketService {
  static const String url = 'http://localhost:5000';
  late IO.Socket _socket;

  void connect(String userId) {
    _socket = IO.io(
      url,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    _socket.connect();

    _socket.onConnect((_) {
      print('WebSocket connected');
      _socket.emit('user:online', userId);
    });

    _socket.onDisconnect((_) {
      print('WebSocket disconnected');
    });
  }

  void sendMessage(String chatId, String message, String recipientId) {
    _socket.emit('message:send', {
      'chatId': chatId,
      'message': message,
      'recipientId': recipientId,
    });
  }

  void onMessageReceived(Function(dynamic) callback) {
    _socket.on('message:received', callback);
  }

  void onTyping(Function(dynamic) callback) {
    _socket.on('user:typing', callback);
  }

  void setTyping(String chatId, String userId) {
    _socket.emit('message:typing', {
      'chatId': chatId,
      'userId': userId,
    });
  }

  void disconnect() {
    _socket.disconnect();
  }
}
