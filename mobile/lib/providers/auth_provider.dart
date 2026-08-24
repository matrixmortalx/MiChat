import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  Future<void> login(String email, String password) async {
    // TODO: Implement login logic with API call
    state = state.copyWith(isAuthenticated: true, userEmail: email);
  }

  Future<void> register(String email, String password, String fullName) async {
    // TODO: Implement register logic with API call
    state = state.copyWith(isAuthenticated: true, userEmail: email);
  }

  Future<void> logout() async {
    // TODO: Implement logout logic
    state = const AuthState();
  }
}

class AuthState {
  final bool isAuthenticated;
  final String? userEmail;
  final String? userId;
  final String? accessToken;

  const AuthState({
    this.isAuthenticated = false,
    this.userEmail,
    this.userId,
    this.accessToken,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    String? userEmail,
    String? userId,
    String? accessToken,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      userEmail: userEmail ?? this.userEmail,
      userId: userId ?? this.userId,
      accessToken: accessToken ?? this.accessToken,
    );
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(),
);
