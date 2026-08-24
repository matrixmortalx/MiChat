import 'package:dio/dio.dart';

class ApiClient {
  static const String baseUrl = 'http://localhost:5000/api/v1';
  late Dio _dio;

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        contentType: 'application/json',
      ),
    );
  }

  Future<Response> get(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
    String? token,
  }) async {
    return _dio.get(
      endpoint,
      queryParameters: queryParameters,
      options: Options(
        headers: _getHeaders(token),
      ),
    );
  }

  Future<Response> post(
    String endpoint, {
    Map<String, dynamic>? data,
    String? token,
  }) async {
    return _dio.post(
      endpoint,
      data: data,
      options: Options(
        headers: _getHeaders(token),
      ),
    );
  }

  Future<Response> put(
    String endpoint, {
    Map<String, dynamic>? data,
    String? token,
  }) async {
    return _dio.put(
      endpoint,
      data: data,
      options: Options(
        headers: _getHeaders(token),
      ),
    );
  }

  Future<Response> delete(
    String endpoint, {
    String? token,
  }) async {
    return _dio.delete(
      endpoint,
      options: Options(
        headers: _getHeaders(token),
      ),
    );
  }

  Map<String, String> _getHeaders(String? token) {
    final headers = {'Content-Type': 'application/json'};
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }
}
