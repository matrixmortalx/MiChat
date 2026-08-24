# MiChat - Modern Real-Time Chat Application

A full-stack, production-ready chat application built with Flutter, Node.js, PostgreSQL, and WebSocket technology.

## 🌟 Features

### Core Features
- ✅ One-to-one messaging (Private chats)
- ✅ Group chats with admin controls
- ✅ Real-time message delivery with WebSocket
- ✅ Message status (sent, delivered, read)
- ✅ Typing indicators
- ✅ Last seen/Online status
- ✅ Message edit and delete
- ✅ Image and file sharing
- ✅ Message search and filtering

### Authentication
- ✅ Email/Password authentication
- ✅ Phone number authentication (SMS OTP)
- ✅ Google OAuth integration
- ✅ Apple Sign-In
- ✅ JWT token-based sessions
- ✅ Two-factor authentication (2FA)

### User Features
- ✅ User profiles with avatar
- ✅ Status messages
- ✅ Block/Unblock users
- ✅ User presence (online/offline)
- ✅ Contact list management
- ✅ Push notifications

### Mobile (Flutter)
- ✅ iOS & Android support
- ✅ Dark mode support
- ✅ Responsive UI
- ✅ Offline message queue
- ✅ Local message caching

### Backend (Node.js)
- ✅ RESTful API
- ✅ WebSocket for real-time communication
- ✅ File upload to cloud storage
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling

## 📁 Project Structure

```
MiChat/
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/    # API Controllers
│   │   ├── models/         # Database Models
│   │   ├── routes/         # API Routes
│   │   ├── services/       # Business Logic
│   │   ├── middleware/     # Custom Middleware
│   │   ├── socket/         # WebSocket Handlers
│   │   ├── utils/          # Utilities
│   │   ├── config/         # Configuration
│   │   └── app.js          # Main App
│   ├── .env.example        # Environment Variables
│   ├── package.json
│   └── Dockerfile
│
├── mobile/                  # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/         # Data Models
│   │   ├── screens/        # UI Screens
│   │   ├── widgets/        # Reusable Widgets
│   │   ├── services/       # API & WebSocket Services
│   │   ├── providers/      # State Management (Provider)
│   │   ├── utils/          # Utility Functions
│   │   └── config/         # App Configuration
│   ├── pubspec.yaml
│   ├── ios/
│   └── android/
│
├── database/                # PostgreSQL Database
│   ├── migrations/         # Database Migrations
│   ├── seeds/              # Seed Data
│   └── schema.sql          # Database Schema
│
├── docker-compose.yml      # Docker Compose Configuration
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Real-time**: Socket.io (WebSocket)
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: AWS S3 / Cloudinary
- **Validation**: Joi
- **Testing**: Jest

### Mobile
- **Framework**: Flutter (Dart)
- **State Management**: Provider + Riverpod
- **API Client**: Dio
- **WebSocket**: socket_io_client
- **Local Storage**: Hive + SharedPreferences
- **Push Notifications**: Firebase Cloud Messaging

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL 15

## 📋 Prerequisites

- Node.js >= 18.0.0
- Flutter >= 3.0.0
- PostgreSQL >= 15
- Docker & Docker Compose
- Dart SDK

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/matrixmortalx/MiChat.git
cd MiChat
```

### 2. Environment Setup

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

#### Database
```bash
# PostgreSQL connection details in .env
```

### 3. Start with Docker
```bash
docker-compose up --build
```

This will start:
- Backend API on `http://localhost:5000`
- PostgreSQL on `localhost:5432`
- WebSocket on `ws://localhost:5000`

### 4. Start Mobile App (Manual)

#### iOS
```bash
cd mobile
flutter pub get
flutter run -d ios
```

#### Android
```bash
cd mobile
flutter pub get
flutter run -d android
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/refresh-token` - Refresh JWT token
- `POST /auth/logout` - User logout

#### Users
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `GET /users/search` - Search users
- `POST /users/block/:userId` - Block user

#### Chats
- `GET /chats` - Get all chats
- `POST /chats` - Create new chat
- `GET /chats/:id` - Get chat details
- `PUT /chats/:id` - Update chat info

#### Messages
- `GET /chats/:id/messages` - Get messages
- `POST /chats/:id/messages` - Send message
- `PUT /messages/:id` - Edit message
- `DELETE /messages/:id` - Delete message
- `POST /messages/:id/read` - Mark as read

#### Groups
- `POST /groups` - Create group
- `GET /groups/:id` - Get group details
- `PUT /groups/:id` - Update group
- `POST /groups/:id/members` - Add member
- `DELETE /groups/:id/members/:userId` - Remove member

## 🔄 WebSocket Events

### Client → Server
- `message:send` - Send message
- `message:typing` - Typing indicator
- `user:online` - User online
- `user:offline` - User offline
- `message:read` - Mark message as read

### Server → Client
- `message:received` - Message received
- `message:read` - Message read
- `user:typing` - User typing
- `user:status` - User status changed
- `notification:push` - New notification

## 🗄️ Database Schema

See `database/schema.sql` for complete database structure.

### Main Tables
- `users` - User accounts
- `chats` - Conversations
- `messages` - Chat messages
- `chat_members` - Chat participants
- `groups` - Group chats
- `files` - Uploaded files
- `notifications` - Push notifications
- `blocked_users` - Blocked users list

## 🔐 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- CORS protection
- Rate limiting
- Input validation & sanitization
- SQL injection prevention (Parameterized queries)
- XSS protection
- HTTPS support

## 📱 Mobile Features

- Offline message queue
- Local caching
- Image compression
- Push notifications
- Background message sync
- Encrypted local storage

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Mobile
```bash
cd mobile
flutter test
```

## 📦 Deployment

### Heroku
```bash
cd backend
heroku create michat-api
git push heroku main
```

### AWS / DigitalOcean
See deployment guide in `docs/deployment.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Authors

- **matrixmortalx** - Initial work

## 📧 Contact & Support

- GitHub Issues: [Report a bug](https://github.com/matrixmortalx/MiChat/issues)
- Email: support@michat.app

## 🙏 Acknowledgments

- Flutter community
- Node.js community
- PostgreSQL documentation
- Socket.io documentation

---

**Made with ❤️ by matrixmortalx**
