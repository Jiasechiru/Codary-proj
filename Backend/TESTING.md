# Quick API Testing

Use these examples after starting the server with `npm run dev`.

## Variables

```bash
BASE_URL="http://localhost:4000"
COOKIE_JAR="./cookies.txt"
```

## 1) Register

```bash
curl -i -c "$COOKIE_JAR" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","password":"demo_pass_123"}'
```

## 2) Login (stores httpOnly JWT cookie)

```bash
curl -i -c "$COOKIE_JAR" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","password":"demo_pass_123"}'
```

## 3) Auth-protected requests

```bash
curl -b "$COOKIE_JAR" "$BASE_URL/auth/me"
curl -b "$COOKIE_JAR" "$BASE_URL/users/profile"
curl -b "$COOKIE_JAR" "$BASE_URL/courses"
```

## 4) Task submit stub

Correct submit (`code` contains `correct`):

```bash
curl -X POST -b "$COOKIE_JAR" "$BASE_URL/tasks/1/submit" \
  -H "Content-Type: application/json" \
  -d '{"code":"// correct solution"}'
```

Incorrect submit:

```bash
curl -X POST -b "$COOKIE_JAR" "$BASE_URL/tasks/1/submit" \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(\"wrong\")"}'
```

## 5) Quiz submit

```bash
curl -X POST -b "$COOKIE_JAR" "$BASE_URL/quizzes/1/submit" \
  -H "Content-Type: application/json" \
  -d '{"answer":"let"}'
```

## 6) Progress and AI stub

```bash
curl -b "$COOKIE_JAR" "$BASE_URL/progress/overview"
curl -X POST -b "$COOKIE_JAR" "$BASE_URL/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Help me with variables"}'
curl -X POST -b "$COOKIE_JAR" "$BASE_URL/ai/tasks/1/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Need a hint"}'
```

## 7) Leaderboard

```bash
curl -b "$COOKIE_JAR" "$BASE_URL/leaderboard"
```

## Postman

Import: `postman/Codary-Backend.postman_collection.json`

Run order recommendation:
1. `Auth -> Register`
2. `Auth -> Login`
3. Any protected endpoint
