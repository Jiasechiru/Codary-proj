import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { syncThemeForPath } from './lib/theme'
import Layout from './components/Layout/Layout'
import AuthGuard from './components/AuthGuard/AuthGuard'
import LandingPage from './pages/LandingPage/LandingPage'
import RegPage from './pages/RegPage/RegPage'
import LoginPage from './pages/LoginPage/LoginPage'
import AppLayout from './components/AppLayout/AppLayout'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage'
import CoursesPage from './pages/CoursesPage/CoursesPage'
import CoursePage from './pages/CoursePage/CoursePage'
import ChatPage from './pages/ChatPage/ChatPage'
import ProgressPage from './pages/ProgressPage/ProgressPage'
import TheoryPage from './pages/TheoryPage/TheoryPage'
import QuizPage from './pages/QuizPage/QuizPage'
import TaskPage from './pages/TaskPage/TaskPage'
import DailyChallengePage from './pages/DailyChallengePage/DailyChallengePage'
import "./styles/Theme.css"

function App() {
  const location = useLocation()

  useEffect(() => {
    syncThemeForPath(location.pathname)
  }, [location.pathname])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/app" element={<AuthGuard><AppLayout /></AuthGuard>} >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CoursePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="theory/:topicId" element={<TheoryPage />} />
          <Route path="quiz/:topicId" element={<QuizPage />} />
          <Route path="task/:taskId" element={<TaskPage />} />
          <Route path="daily-challenge/:language" element={<DailyChallengePage />} />
        </Route>
      </Routes>
    </Layout>
  )
}

export default App
