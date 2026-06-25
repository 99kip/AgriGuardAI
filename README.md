# AgriGuard AI Angular web app

AgriGuard AI is a premium intelligence platform designed to empower smallholder farmers with high-fidelity market data, micro-climate insights, and AI-driven negotiation strategies. Built for the modern agricultural landscape, it bridges the information gap between the field and the market.

Vision
To transform how small-scale agriculturalists interact with markets by providing toolsets previously only available to large-scale commercial operations. We combine neural intelligence with localized data to maximize harvest value and ensure food security

 Key Features

 Intelligence Dashboard
- **Local Micro-Climate:** Real-time professional-grade weather tracking tailored to specific farming regions.
- **Neural Advisory:** Staggered AI-generated strategies that analyze current conditions to provide actionable farming tips.
- **Market Pulse:** Live tracking of crop prices (Maize, Tomatoes, Potatoes, etc.) with trend analysis and historical visualization.

 AI Strategy Assistant (Negotiator)
- **Deep Scan Analysis:** A specialized chat interface that acts as a strategy assistant.
- **Negotiation Scripts:** Helps farmers articulate their value to buyers and negotiate better pricing.
- **Multi-modal Input:** Support for voice interaction (Speech-to-Text) to lower the barrier of entry for field-based use.

Regional Mapping & Market Trends
- **Localized Pricing:** Intelligence specific to Kenyan regional markets.
- **Price Forecasting:** Predictive analysis on whether to sell immediately or hold inventory for better margins.
- **Algo-Suggestions:** Automated suggestions based on price gaps between regions.

Professional Profile
- **AgriID:** Unique digital identity for farmers.
- **Multi-lingual Interface:** Support for English and **Sheng**, ensuring inclusivity for local communities.
- **Offline Sync:** Visual indicators for synchronization status ensuring data integrity in low-connectivity areas.

---

Tech Stack

- **Frontend:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Animation:** [motion/react](https://motion.dev/) (formerly Framer Motion)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Intelligence Engine:** [Google Gemini 1.5 Pro](https://ai.google.dev/)
- **Database & Auth:** [Firebase Firestore](https://firebase.google.com/products/firestore) & [Firebase Auth](https://firebase.google.com/products/auth)
- **Icons:** [Google Material Symbols](https://fonts.google.com/icons) & [Lucide React](https://lucide.dev/)

---

 Project Structure

```bash
src/
├── components/          # Reusable UI components (Navigation, Header, SyncStatus)
├── context/             # Global states (AuthContext, LanguageContext)
├── hooks/               # Custom React hooks
├── services/            # API & AI logic (intelligenceService, chatService)
├── screens/             # Main application views
│   ├── Dashboard.tsx    # Neural Intelligence Hub
│   ├── Chat.tsx         # AI Strategy Session
│   └── Settings.tsx     # Profile & System Configuration
├── utils/               # Numerical & Date formatting utilities
└── App.tsx              # Main Entry & Routing
```

---

 Security & Privacy

AgriGuard AI follows industry-standard security protocols:
- **AgriGuard Secure Protocol:** All neural links and data transactions are verified.
- **Anonymous Authentication:** Users can interact with the platform securely using Google identity.
- **Data Sovereignty:** Farmers maintain control over their localized data and profile information.

---

## 🏁 Getting Started

1. **Authentication:** Log in via Google to initialize your unique AgriID.
2. **Scan:** Allow location permissions for the "Local Micro-Climate" scan.
3. **Analyze:** Check the Market Pulse for regional trends before selling your harvest.
4. **Consult:** Visit the Chat screen to refine your negotiation script with the AI Assistant.

---

*AgriGuard AI — Optimizing Kenyan agriculture through AI-driven market intelligence.*
