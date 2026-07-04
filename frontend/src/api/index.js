import apiClient from './apiClient'

export const authApi = {
  /** Register a new user */
  register: (data) => apiClient.post('/auth/register', data),

  /** Login and receive JWT token */
  login: (data) => apiClient.post('/auth/login', data),

  /** Fetch current authenticated user's profile */
  getMe: () => apiClient.get('/auth/me'),
}

export const dashboardApi = {
  /** Fetch dashboard summary stats */
  getSummary: () => apiClient.get('/dashboard/summary'),
}

export const phishingApi = {
  /** Analyze email/text for phishing indicators using Gemini */
  analyze: (data) => apiClient.post('/phishing/analyze', data),
}

export const passwordApi = {
  /** Analyze password strength using Gemini */
  analyze: (data) => apiClient.post('/password/analyze', data),
}

export const urlScannerApi = {
  /** Scan a URL for suspicious indicators */
  scan: (data) => apiClient.post('/url-scanner/scan', data),
}

export const chatbotApi = {
  /** Send a message to the cybersecurity chatbot */
  sendMessage: (data) => apiClient.post('/chatbot/message', data),
  /** Fetch conversation history */
  getHistory: () => apiClient.get('/chatbot/history'),
}

export const recommendationsApi = {
  /** Get personalized security recommendations */
  get: () => apiClient.get('/recommendations'),
}

export const threatScoreApi = {
  /** Get user's overall threat risk score */
  getScore: () => apiClient.get('/threat-score'),
  /** Re-calculate threat score */
  calculate: () => apiClient.post('/threat-score/calculate'),
}

export const checklistApi = {
  /** Generate a personalized security checklist */
  generate: (data) => apiClient.post('/checklist/generate', data),
  /** Get saved checklists */
  getAll: () => apiClient.get('/checklist'),
}

export const alertsApi = {
  /** Get all real-time alerts for the user */
  getAll: () => apiClient.get('/alerts'),
  /** Mark an alert as read */
  markRead: (id) => apiClient.patch(`/alerts/${id}/read`),
  /** Mark all alerts as read */
  markAllRead: () => apiClient.patch('/alerts/read-all'),
}

export const historyApi = {
  /** Get paginated user activity history */
  getAll: (params) => apiClient.get('/history', { params }),
}
