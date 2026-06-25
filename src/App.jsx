import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Camera, MapPin, AlertTriangle, CheckCircle2, Menu, X, Lock,
  Settings, ShieldCheck, Home, Droplets, HeartPulse, GraduationCap, Bus, Trees, ArrowRight, ArrowDown, ArrowLeft, Filter, MessageSquare, Users, Flame, Share2, Clock
} from 'lucide-react';
import partyLogo from './assets/party-logo.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  // --- REPLACED: useState(null) + useEffect ---
  // --- WITH: Lazy Initialization Function ---
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('aap_citizen_user');
    const token = localStorage.getItem('aap_citizen_token');
    if (storedUser && token) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const login = async (googleResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/citizen/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleResponse.credential })
      });
      const data = await res.json();

      if (data.success) {
        // Save to browser so they stay logged in
        localStorage.setItem('aap_citizen_token', data.token);
        localStorage.setItem('aap_citizen_user', JSON.stringify(data.user));
        setUser(data.user);
        setShowAuthModal(false);

        // If they were trying to do something (like boosting), do it now!
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      // Used the err variable to satisfy ESLint
      console.error("Google Login Error", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('aap_citizen_token');
    localStorage.removeItem('aap_citizen_user');
    setUser(null);
  };

  const requireAuth = (action, message) => {
    if (user) {
      action(); // They are logged in, let them proceed
    } else {
      setAuthMessage(message);
      setPendingAction(() => action); // Save the action for after they log in
      setShowAuthModal(true); // Show the popup
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, requireAuth, showAuthModal, setShowAuthModal, authMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 2. The Auth Modal Component ---
function AuthModal() {
  const { showAuthModal, setShowAuthModal, authMessage, login } = useContext(AuthContext);

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Secure Login Required</h2>
          <p className="text-slate-500 font-medium text-sm px-4">
            {authMessage || "Please sign in to continue."}
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <GoogleLogin
            onSuccess={login}
            onError={() => console.log('Login Failed')}
            useOneTap
            theme="filled_blue"
            shape="pill"
          />
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mt-6">
          Your data is strictly secured.
        </p>
      </div>
    </div>
  );
}

// --- FALLBACK MOCK DATA ---
// This ensures the preview environment continues to display a rich UI even when the local backend is unreachable.
const fallbackMockFeed = [
  { _id: '1', category: 'Water Logging / Sewage', location: 'NIT 3, Near Post Office', parsedAddress: 'NIT 3, Near Post Office', status: 'Verified', createdAt: new Date(Date.now() - 7200000).toISOString(), assignedWorker: 'Amit Kumar', description: 'Severe water logging after yesterday\'s rain.' },
  { _id: '2', category: 'Broken Road / Pothole', location: 'Sector 15 Market', parsedAddress: 'Sector 15 Market', status: 'Pending', createdAt: new Date(Date.now() - 18000000).toISOString(), assignedWorker: null, description: 'Huge pothole causing traffic jams.' },
  { _id: '3', category: 'Garbage Dump', location: 'Sainik Colony', parsedAddress: 'Sainik Colony', status: 'Resolved', createdAt: new Date(Date.now() - 86400000).toISOString(), assignedWorker: 'Rahul Singh', description: 'Garbage not collected for 3 days.' },
];

// --- BLUEPRINT DATA CONFIGURATION ---
const flowchartSteps = [
  {
    id: 1,
    title: "Daily Infrastructure Stagnation",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: 2,
    title: "AAP Structural Interventions",
    icon: Settings,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: 3,
    title: "Free Financial & Lifeline Upgrades",
    icon: ShieldCheck,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-400"
  },
  {
    id: 4,
    title: "A Thriving Faridabad Household",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-300"
  }
];

const visionPillars = [
  {
    id: 1,
    heading: "Clean Air, Pure Water, 24/7 Power",
    shortHeading: "Air, Water & Power",
    icon: Droplets,
    description: "Guaranteeing a continuous, trip-free power grid, replacing high-cost private water tankers with treated high-pressure direct municipal pipelines, and enforcing strict industrial smog-filtering mandates to permanently drop the city's choking AQI levels.",
    microTag: "⚡ The Break from Reality: Eradicating the era of toxic smog days, unpredictable power cuts, and expensive, corrupt groundwater tanker dependencies."
  },
  {
    id: 2,
    heading: "Accessible Public Healthcare",
    shortHeading: "Public Healthcare",
    icon: HeartPulse,
    description: "Establishing fully air-conditioned, state-of-the-art diagnostic neighborhood clinics within walking distance of every single sector. Providing free expert doctor consultations, standard laboratory tests, and complete medicine distribution under one roof.",
    microTag: "🩺 The Break from Reality: Defending families from predatory private hospital bills and ensuring a medical emergency never wipes out a middle-class family's savings."
  },
  {
    id: 3,
    heading: "Smart Classrooms & Global Skilling",
    shortHeading: "Education & Skills",
    icon: GraduationCap,
    description: "Transforming crumbling municipal structures into world-class smart schools with modern computer networks. Building high-tech incubation centers to train Faridabad's youth in premium digital skills, connecting them directly with neighboring corporate hubs.",
    microTag: "💼 The Break from Reality: Helping parents escape crushing private school fee hikes while aggressively solving the local youth unemployment crisis."
  },
  {
    id: 4,
    heading: "Pothole-Free Roads & Eco-Transit",
    shortHeading: "Roads & Transit",
    icon: Bus,
    description: "Completely re-engineering the city’s outdated storm water drainage networks to ensure flood-free monsoons. Implementing automated door-to-door mechanized waste segregation alongside a high-frequency fleet of electric feeder buses connecting inner colonies straight to Delhi Metro stations.",
    microTag: "🛣️ The Break from Reality: Reclaiming waterlogged sectors, cratered transit lanes, and sprawling open dumping grounds with world-class logistics."
  },
  {
    id: 5,
    heading: "Green Parks & Community Spaces",
    shortHeading: "Parks & Community",
    icon: Trees,
    description: "Reclaiming neglected municipal lands to build beautifully landscaped public parks, open-air neighborhood gyms, and secure walking tracks. Revitalizing regional cultural landmarks and eco-tourism hubs like the Badkhal Lake restoration project.",
    microTag: "🏞️ The Break from Reality: Restoring local civic pride and transforming unsafe, abandoned community plots into vibrant wellness spaces for children and seniors."
  }
];

export default function AppWrapper() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
        <App />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // Access auth state!

  // 1. Initialize React Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // 2. THE BRIDGE: We recreate setActiveTab so you don't have to edit all your other components!
  // This automatically translates your old setTab('feed') clicks into real URLs (/feed)
  const setActiveTab = (tabName) => {
    if (tabName === 'home') navigate('/');
    else if (tabName === 'joinmovement') navigate('/join');
    else navigate(`/${tabName}`);
  };

  // 3. Figure out the active tab from the URL for styling the yellow underlines
  const activeTab = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AuthModal />
      {/* Navigation */}
      <nav className="bg-white border-b-4 border-yellow-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center cursor-pointer gap-2">
              <img
                src={partyLogo}
                alt="Party Symbol"
                className="w-16 h-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-blue-900 leading-none">AAP</span>
                <span className="font-bold text-sm tracking-widest text-slate-800 leading-none uppercase mt-[2px]">Faridabad</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`cursor-pointer font-bold ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Live Radar</Link>
              <Link to="/feed" className={`cursor-pointer font-bold text-sm uppercase tracking-wide transition-colors ${activeTab === 'feed' ? 'text-blue-700' : 'text-slate-500 hover:text-blue-700'}`}>Public Feed</Link>

              {/* Show User Avatar if logged in */}
              {user ? (
                <div className="flex items-center gap-3 border-l border-slate-200 pl-6 ml-2">
                  <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Citizen</span>
                    <span className="text-xs font-black text-slate-700 truncate max-w-[100px] leading-tight">{user.name.split(' ')[0]}</span>
                  </div>
                  <button onClick={logout} className="text-[10px] font-bold text-red-500 uppercase hover:underline ml-2">Logout</button>
                </div>
              ) : null}
              <Link
                to="/report"
                className="cursor-pointer bg-yellow-400 text-black px-6 py-2 rounded-full font-black uppercase tracking-wide hover:bg-yellow-500 transition-colors shadow-sm inline-block"
              >
                Raise your Voice
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
        {/* --- ADD THIS ENTIRE BLOCK FOR THE MOBILE MENU --- */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-2xl absolute w-full left-0 top-16 z-50">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>Live Radar</Link>
            <Link to="/feed" onClick={() => setIsMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-bold uppercase tracking-wide ${activeTab === 'feed' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-blue-700 hover:bg-gray-50'}`}>Public Feed</Link>

            {/* Mobile User Profile Section */}
            {user && (
              <div className="flex items-center justify-between px-4 py-3 border-y border-gray-100 my-2 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Citizen</span>
                    <span className="text-sm font-black text-slate-700 truncate leading-tight">{user.name.split(' ')[0]}</span>
                  </div>
                </div>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-xs font-bold text-red-500 uppercase hover:underline">Logout</button>
              </div>
            )}

            <Link
              to="/report"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center mt-4 bg-yellow-400 text-black px-6 py-3.5 rounded-xl font-black uppercase tracking-wide hover:bg-yellow-500 transition-colors shadow-sm"
            >
              Raise your Voice
            </Link>
          </div>
        )}
        {/* --- END MOBILE MENU BLOCK --- */}
      </nav>

      {/* Main Content Routing */}
      <Routes>
        <Route path="/" element={<HomeView setTab={setActiveTab} activeTab={activeTab} />} />
        <Route path="/report" element={<ReportView setTab={setActiveTab} />} />
        <Route path="/leaders" element={<LeadersPage setTab={setActiveTab} />} />
        <Route path="/join" element={<JoinMovementPage setTab={setActiveTab} />} />
        <Route path="/feed" element={<PublicFeedView setTab={setActiveTab} />} />
        <Route path="/worker-login" element={<WorkerLoginView setTab={setActiveTab} />} />
      </Routes>


      {/* Footer */}
      {/* Updated Light-Mode Footer: Resolves the Section Collapse */}
      <footer className="bg-slate-50 text-slate-800 border-t border-slate-200 pt-16 pb-8 font-sans mt-0 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 pb-12 border-b border-slate-200">

          {/* Column 1: Mission & Identity */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={partyLogo}
                alt="AAP Logo"
                className="w-12 h-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-blue-900 leading-none">AAP</span>
                <span className="font-black text-sm tracking-widest text-slate-800 leading-none uppercase mt-[2px]">Faridabad</span>
              </div>
            </div>
            <p className="text-slate-600 text-xs font-medium leading-relaxed max-w-sm">
              An open civic-tech weapon built to monitor infrastructure stagnation, log public grievances, and drive grassroots accountability across every assembly seat in Faridabad.
            </p>
          </div>

          {/* Column 2: Quick Command Actions */}
          <div className="flex flex-col space-y-3">
            {/* STRATEGIC TWEAK: Darkened Header to text-slate-800 */}
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Quick Portal Shortcuts</h4>
            <div className="flex flex-col space-y-2 text-sm font-bold text-slate-600">
              <Link to="/" onClick={() => window.scrollTo(0, 0)} className="cursor-pointer text-left hover:text-blue-700 transition-colors w-fit">&rarr; Live Accountability Radar</Link>
              <Link to="/feed" onClick={() => window.scrollTo(0, 0)} className="cursor-pointer text-left hover:text-blue-700 transition-colors w-fit">&rarr; Public Citizen Feed</Link>
              <Link to="/report" onClick={() => window.scrollTo(0, 0)} className="cursor-pointer text-left hover:text-blue-700 transition-colors w-fit">&rarr; File a Governance Failure</Link>
              <Link to="/join" onClick={() => window.scrollTo(0, 0)} className="cursor-pointer text-left hover:text-blue-700 transition-colors w-fit">&rarr; Join Ground Command</Link>
            </div>
          </div>

          {/* Column 3: Contact Us (NEW) */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Contact Us</h4>
            <div className="flex flex-col space-y-3 text-sm font-medium text-slate-600">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Faridabad IT Cell</span>
                <a href="mailto:contact@aapfaridabad.in" className="font-bold text-blue-700 hover:underline">contact@aapfaridabad.in</a>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">National Helpline</span>
                <span className="font-bold text-slate-800">97185 00606</span>
              </div>
            </div>
          </div>

          {/* Column 4: Connect & Social Ecosystem */}
          <div className="flex flex-col space-y-4">
            {/* STRATEGIC TWEAK: Darkened Header to text-slate-800 */}
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Follow the Fight</h4>

            {/* Social Media Row */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-black text-xs text-slate-700 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">FB</a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-black text-xs text-slate-700 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">IG</a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-black text-xs text-slate-700 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">X</a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-black text-xs text-slate-700 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">RD</a>
            </div>

            {/* Secure Portal Link */}
            <Link
              to="/worker-login"
              onClick={() => window.scrollTo(0, 0)}
              className="cursor-pointer text-slate-700 hover:text-blue-900 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-colors w-fit bg-white px-4 py-2.5 rounded-lg border border-slate-300 shadow-sm hover:border-slate-400">
              <Lock size={14} className="text-yellow-500" /> Internal Ground Worker Login
            </Link>
          </div>

        </div>

        {/* Bottom Metadata & Credits Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 gap-4">
          <div>
            &copy; 2026 Aam Aadmi Party. All Rights Reserved.
          </div>
          {/* STRATEGIC TWEAK: Bolder styling for the Youth Wing badge */}
          <div className="text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm font-bold flex items-center gap-1.5">
            WEBSITE MANAGED BY <span className="text-blue-900 font-black">AAP FARIDABAD YOUTH WING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
function PublicFeedView({ setTab }) {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { requireAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/complaints`);
        const result = await response.json();
        if (result.success) {
          setFeed(result.data);
        } else {
          setFeed(fallbackMockFeed);
        }
      } catch (error) {
        console.log(error);
        setFeed(fallbackMockFeed);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
    window.scrollTo(0, 0);
  }, []);

  const handleBoostClick = (id) => {
    // Before doing anything, check if they are logged in!
    requireAuth(async () => {
      // 1. Optimistic UI update
      setFeed(prevFeed => prevFeed.map(issue => {
        if (issue._id === id) {
          const isBoosted = issue.hasBoosted;
          return {
            ...issue,
            boosts: isBoosted ? issue.boosts - 1 : (issue.boosts || 0) + 1,
            hasBoosted: !isBoosted
          };
        }
        return issue;
      }));

      // 2. Call the protected backend route
      try {
        const token = localStorage.getItem('aap_citizen_token');
        await fetch(`${API_BASE_URL}/api/complaints/${id}/boost`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}` // Send the token!
          }
        });
      } catch (error) {
        console.error("Failed to boost on server", error);
      }
    }, "Join 400+ active citizens. Sign in securely to boost this issue to the top of the Radar!"); // The custom message
  };

  const getTimeAgo = (dateString) => {
    const hours = Math.abs(new Date() - new Date(dateString)) / 36e5;
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-16 font-sans animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setTab('home')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-700 transition-colors">
            <ArrowLeft size={20} /> Back
          </button>
          <h2 className="text-xl font-black text-blue-950 uppercase tracking-tight">Public <span className="text-yellow-500">Feed</span></h2>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Live Feed...</div>
        ) : (
          <div className="space-y-6">
            {feed.map((issue) => (
              <article key={issue._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                <div className="p-4 flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className={`p-2 rounded-full ${issue.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                        issue.status === 'Verified' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                      }`}>
                      {issue.status === 'Resolved' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg leading-tight">{issue.category}</h3>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                        <Clock size={12} /> {getTimeAgo(issue.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${issue.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-200' :
                      issue.status === 'Verified' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                        'bg-green-50 text-green-600 border-green-200'
                    }`}>
                    {issue.status}
                  </span>
                </div>

                {issue.imageUrl && (
                  <div className="w-full bg-slate-100 border-y border-slate-100">
                    <img
                      src={issue.imageUrl}
                      alt={issue.category}
                      className="w-full h-64 md:h-80 object-cover rounded-xl mb-4 border border-gray-100 shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://dummyimage.com/600x400/f1f5f9/94a3b8&text=Image+Unavailable"; }}
                    />
                  </div>
                )}

                <div className="p-4">
                  <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed mb-3">
                    {issue.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <MapPin size={14} className="text-blue-600" />
                    {issue.parsedAddress || issue.location}
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-gray-100 flex gap-4">
                  <button
                    onClick={() => handleBoostClick(issue._id)}
                    className={`flex items-center gap-2 font-black text-sm px-4 py-2 rounded-full transition-colors ${issue.hasBoosted
                        ? 'bg-orange-100 text-orange-600 border border-orange-200'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-orange-500'
                      }`}
                  >
                    <Flame size={18} className={issue.hasBoosted ? 'fill-orange-500' : ''} />
                    BOOST {issue.boosts ? `(${issue.boosts})` : ''}
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`🚨 AAP Faridabad Radar:\nIssue: ${issue.category}\nLocation: ${issue.parsedAddress || issue.location}\n\nJoin the fight and boost this issue!`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 font-black text-sm px-4 py-2 rounded-full bg-white text-slate-500 border border-slate-200 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 transition-colors"
                  >
                    <Share2 size={18} /> SHARE
                  </a>
                </div>

              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- VIEWS ---

function HomeView({ setTab, activeTab }) {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // FETCH DATA FROM BACKEND WITH FALLBACK
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/complaints`);
        const result = await response.json();

        if (result.success) {
          setFeed(result.data);
        } else {
          setFeed(fallbackMockFeed);
        }
      } catch (error) {
        console.error("Error fetching radar data, using offline fallback:", error);
        // Display mock data if backend isn't running
        setFeed(fallbackMockFeed);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [activeTab]);

  // Calculate stats dynamically
  const totalTracked = feed.length;
  const activeFights = feed.filter(f => f.status === 'Verified').length;
  const resolved = feed.filter(f => f.status === 'Resolved').length;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-4 border-b-8 border-yellow-400">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
            Politics. <span className="text-yellow-400">Reimagined.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-medium mb-10 max-w-2xl mx-auto">
            We don't just talk about Faridabad's problems. We track them. We fight them. We fix them.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/report')}
              className="cursor-pointer bg-yellow-400 text-black px-8 py-4 rounded-md font-black text-lg uppercase tracking-wide hover:bg-yellow-500 transition-transform hover:-translate-y-1"
            >
              RAISE YOUR VOICE
            </button>
            <button 
              onClick={() => { setTab('joinmovement'); window.scrollTo(0, 0); }}
              className="cursor-pointer bg-transparent border-2 border-white text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors">
              Stand With Us
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Bar */}
      <section className="bg-white py-8 border-b border-gray-200 shadow-sm relative z-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-black text-blue-900">{totalTracked}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Public Grievances Logged</div>
          </div>
          <div className="border-l border-r border-gray-200">
            <div className="text-4xl font-black text-yellow-500">{activeFights}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Battles Being Fought</div>
          </div>
          <div>
            <div className="text-4xl font-black text-green-600">{resolved}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Victories Secured</div>
          </div>
        </div>
      </section>
      {/* HIGH-DENSITY LIVE ACCOUNTABILITY RADAR */}
      <section id="live-radar" className="bg-slate-900 py-12 px-4 border-b-4 border-slate-950 shadow-inner">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              Live Accountability Radar
            </h2>
            <span className="text-[10px] md:text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
              {feed.length} Active Issues
            </span>
          </div>

          {/* List Engine Container */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">

            {isLoading ? (
              <div className="text-center py-16 text-slate-500 font-bold uppercase tracking-widest text-sm">Scanning Faridabad...</div>
            ) : feed.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 font-bold mb-3 uppercase tracking-wider text-sm">No issues in the database yet.</p>
                <button onClick={() => setTab('report')} className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs font-black uppercase tracking-widest border-b border-dashed border-yellow-400/50 pb-1">Be the first to report</button>
              </div>
            ) : (
              /* The Fixed Rectangular Window Box with Custom Tailwind Scrollbar */
              <div className="max-h-[440px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="flex flex-col divide-y divide-slate-800/50">
                  {feed.map((issue) => (
                    <div key={issue._id} className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors group cursor-default">

                      {/* Left & Center Segment */}
                      <div className="flex items-center gap-4 overflow-hidden pr-4">
                        {/* Left: The Indicator */}
                        <div className="flex-shrink-0 bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:border-slate-700 transition-colors">
                          {issue.status === 'Pending' && <AlertTriangle size={18} className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />}
                          {issue.status === 'Verified' && <AlertTriangle size={18} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />}
                          {issue.status === 'Resolved' && <CheckCircle2 size={18} className="text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
                        </div>

                        {/* Center: The Core Data (Truncated) */}
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 truncate">
                          <span className="text-sm font-bold text-slate-200 truncate">{issue.category}</span>
                          <span className="hidden md:block text-slate-700 text-xs font-black">|</span>
                          <span className="text-xs font-medium text-slate-500 truncate whitespace-nowrap overflow-hidden max-w-[180px] md:max-w-md">
                            <MapPin size={12} className="inline mr-1 text-slate-600 mb-0.5" />
                            {issue.parsedAddress || issue.detectedSector || issue.location}
                          </span>
                        </div>
                      </div>

                      {/* Right: The Operational Badge */}
                      <div className="flex-shrink-0">
                        <span className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${issue.status === 'Pending' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            issue.status === 'Verified' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                              'bg-green-500/10 text-green-400 border-green-500/20'
                          }`}>
                          {issue.status}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Bottom Gradient Fade */}
            {feed.length > 5 && !isLoading && (
              <div className="bg-gradient-to-t from-slate-950 to-transparent pointer-events-none h-16 absolute bottom-0 left-0 right-0"></div>
            )}
          </div>

          {/* Bottom Action Footer Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => { setTab('feed'); window.scrollTo(0, 0); }}
              className="cursor-pointer text-[10px] font-black text-slate-400 hover:text-yellow-400 uppercase tracking-[0.2em] transition-colors border border-slate-700 hover:border-yellow-400/50 rounded-full px-8 py-3 bg-slate-950 shadow-sm hover:shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              [ VIEW ALL {feed.length} ISSUES ]
            </button>
          </div>

        </div>
      </section>

      {/* --- BLUEPRINT SECTION INTEGRATION --- */}
      <BlueprintSection />
      {/* --- OUR STRENGTH LEADERSHIP SECTION --- */}
      <OurStrengthSection setTab={setTab} />
    </div>
  );
}

      

// --- BLUEPRINT COMPONENTS ---

function TransformationFlowchart() {
  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-400 uppercase tracking-widest mb-1">The Path to Change</h3>
        <p className="text-slate-300 text-sm font-medium max-w-3xl mx-auto">From systemic stagnation to a thriving household: How our governance model directly impacts your daily life.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 max-w-6xl mx-auto relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>

        {flowchartSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="relative z-10 flex flex-col items-center w-full md:w-64 bg-slate-900 border-2 border-slate-700 p-6 rounded-xl shadow-lg transition-transform hover:-translate-y-2 hover:border-yellow-400 duration-300 group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${step.bgColor} ${step.color} border-2 ${step.borderColor} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <step.icon size={28} strokeWidth={2.5} />
              </div>
              <h4 className="text-white font-bold text-center leading-tight tracking-wide">{step.title}</h4>
            </div>

            {index < flowchartSteps.length - 1 && (
              <div className="flex items-center justify-center text-slate-600 md:text-yellow-400 z-10">
                <ArrowDown size={32} className="md:hidden animate-bounce my-2 text-yellow-400" />
                <div className="hidden md:flex bg-slate-900 p-2 rounded-full border-2 border-slate-700">
                  <ArrowRight size={24} />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function VisionGrid() {
  // State tracks which card is expanded (defaults to the first card: id 1)
  const [activePillar, setActivePillar] = useState(1);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto h-auto md:h-[480px]">
      {visionPillars.map((pillar) => {
        const isActive = activePillar === pillar.id;

        return (
          <article
            key={pillar.id}
            onMouseEnter={() => setActivePillar(pillar.id)}
            onClick={() => setActivePillar(pillar.id)}
            className={`relative overflow-hidden rounded-2xl transition-all duration-500 ease-in-out shadow-md flex flex-col bg-white border border-gray-200 cursor-pointer
              md:hover:shadow-2xl
              ${isActive ? 'md:flex-[4] md:border-yellow-400 md:-translate-y-1' : 'md:flex-[1] md:hover:bg-slate-50'}
            `}
          >
            {/* 1. Header Area (Icon + Title) */}
            <header className={`p-5 flex items-center gap-4 transition-colors duration-500 border-b-4 z-20 shrink-0
              bg-blue-950 border-yellow-400 md:border-b-4
              ${isActive ? '' : 'md:bg-slate-900 md:border-slate-700 md:justify-center'}
            `}>
              <div className={`p-3 rounded-lg shadow-sm shrink-0 transition-colors
                bg-yellow-400 text-blue-950
                ${isActive ? '' : 'md:bg-slate-800 md:text-slate-400'}
              `}>
                <pillar.icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="block md:hidden text-base font-black text-white uppercase">
                {pillar.shortHeading}
              </h3>

              {/* Horizontal Title - Fades out and shrinks when collapsed on desktop */}
              <h3 className={`text-lg font-black text-white uppercase tracking-tight leading-tight whitespace-nowrap transition-all duration-500 
                ${isActive ? 'md:opacity-100 md:w-auto' : 'md:opacity-0 md:w-0 md:overflow-hidden'}
              `}>
                {pillar.heading}
              </h3>
            </header>

            {/* 2. Desktop Collapsed Vertical Title (Hidden on mobile or when active) */}
            <div className={`hidden md:flex absolute top-28 left-0 w-full bottom-0 flex-col items-center justify-center z-10 transition-opacity duration-300 pointer-events-none
              ${isActive ? 'opacity-0' : 'opacity-100'}
            `}>
              <h3
                className="text-lg font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {pillar.shortHeading || pillar.heading}
              </h3>
            </div>

            {/* 3. Content Area (Sits in an absolute container to prevent text jumping) */}
            <div className="relative flex-grow bg-white">
              <div className={`p-5 w-full h-full flex flex-col transition-opacity duration-500 delay-100
                md:absolute md:top-0 md:left-0 md:w-[300px] lg:w-[380px]
                ${isActive ? 'md:opacity-100' : 'md:opacity-0 md:pointer-events-none'}
              `}>
                <p className="text-gray-600 text-sm lg:text-base font-medium leading-relaxed mb-4 flex-grow">
                  {pillar.description}
                </p>
                <div className="p-4 bg-slate-50 border-t-2 border-yellow-400 rounded-xl shrink-0">
                  <p className="text-xs font-bold text-slate-800 italic leading-snug">
                    {pillar.microTag}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function BlueprintSection() {
  return (
    <section className="bg-slate-950 pt-6 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans border-t-8 border-yellow-400">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-block bg-yellow-400 text-blue-950 font-black px-4 py-1 rounded-full uppercase tracking-widest text-sm mb-4 shadow-sm">
          The Master Plan
        </div>
        <h2 className="font-black uppercase tracking-tighter leading-none mb-4">
          <span className="block text-2xl md:text-3xl text-white mb-2">The Blueprint for a</span>
          <span className="block text-4xl md:text-5xl text-yellow-400">World-Class Faridabad</span>
        </h2>
        <p className="text-base text-slate-400 font-medium leading-relaxed">
          We are not here to manage the decay. We are here to completely overhaul the system.
          Here is our non-negotiable roadmap for the city's transformation.
        </p>
      </div>

      <TransformationFlowchart />
      <VisionGrid />
    </section>
  );
}
// --- LEADERSHIP COMPONENT (OUR STRENGTH) ---

  // --- IMAGE PLACEHOLDER VARIABLES & MOCK DATA ---
  import nationalSanjayImg from './assets/sanjay-singh.jpg';     
  import nationalKejriwalImg from './assets/kejriwal.png';   
  import nationalSisodiaImg from './assets/sisodia.png';    

  const stateSushilImg = "https://dummyimage.com/400x400/0f172a/facc15&text=Dr.+Sushil+Gupta";
  const stateAnuragImg = "https://dummyimage.com/400x400/0f172a/facc15&text=Anurag+Dhanda";
  const localPlaceholderImg = "https://dummyimage.com/400x400/f3f4f6/94a3b8&text=Ground+Fighter";

  const localCommandData = {
    "Faridabad NIT": [{ id: 1, name: "Amit Kumar", role: "Assembly Coordinator", activeFights: 14, issuesResolved: 8, img: localPlaceholderImg }],
    "Badkhal": [{ id: 2, name: "Rahul Singh", role: "Assembly Coordinator", activeFights: 9, issuesResolved: 12, img: localPlaceholderImg }],
    "Ballabgarh": [{ id: 3, name: "Pooja Sharma", role: "Assembly Coordinator", activeFights: 21, issuesResolved: 15, img: localPlaceholderImg }],
    "Faridabad Central": [{ id: 4, name: "Vikram Chaudhary", role: "Assembly Coordinator", activeFights: 5, issuesResolved: 4, img: localPlaceholderImg }],
    "Tigaon": [{ id: 5, name: "Deepak Yadav", role: "Assembly Coordinator", activeFights: 11, issuesResolved: 19, img: localPlaceholderImg }]
  };

  // --- HOMEPAGE VIEW: OUR STRENGTH (PHASE 1) ---
  function OurStrengthSection({ setTab }) {
    return (
      <section className="bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-3">
              Our <span className="text-yellow-400">Strength</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-4xl mx-auto text-sm">
              A relentless leadership team equipped with the vision to govern and the grit to fight on the streets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
              <img src={nationalSanjayImg}
               alt="Sanjay Singh"
                className="w-full h-60 object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="p-5">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Sanjay Singh</h3>
                <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">Fearless Voice of the Streets</p>
                <div className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-blue-500">
                  <p className="text-slate-300 text-xs font-medium italic">"Fighting for the rights of citizens from parliament directly to Haryana's battlegrounds."</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
              <img src={nationalKejriwalImg} alt="Arvind Kejriwal" className="w-full h-60 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="p-5">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Arvind Kejriwal</h3>
                <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">National Convenor & Ideological Anchor</p>
                <div className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-blue-500">
                  <p className="text-slate-300 text-xs font-medium italic">"The architect of clean governance and free lifeline public utilities."</p>
                </div>
              </div>
            </div>
            

            {/* Card 3 */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
              <img src={nationalSisodiaImg} alt="Manish Sisodia" className="w-full h-60 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="p-5">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Manish Sisodia</h3>
                <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">Pioneer of Public Education</p>
                <div className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-blue-500">
                  <p className="text-slate-300 text-xs font-medium italic">"The transformative force behind India's world-class smart classroom model."</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button: Properly routes state to 'leaders' tab and scrolls up */}
          <div className="text-center">
            <button
              onClick={() => { setTab('leaders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="cursor-pointer inline-flex items-center gap-2 bg-yellow-400 text-blue-950 px-6 py-3 rounded-full font-black text-sm uppercase tracking-wide hover:bg-yellow-500 transition-transform hover:scale-105 shadow-lg"
            >
              Meet Our Haryana Leadership <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // --- DEDICATED FULL-VIEW LEADERS PAGE (PHASE 2) ---
  function LeadersPage({ setTab }) {
    const [selectedAssembly, setSelectedAssembly] = useState("Faridabad NIT");

    return (
      <div className="min-h-screen bg-slate-50 pb-16 animate-in fade-in duration-500">

        {/* Top Breadcrumb Header */}
        <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 mb-8 shadow-sm">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => { setTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} /> Back to Dashboard
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Row 1: The National Row (Compressed Profile Badges) */}
          <div className="mb-12">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={16} /> National Command</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Arvind Kejriwal", role: "National Convenor", img: nationalKejriwalImg },
                { name: "Manish Sisodia", role: "Pioneer of Public Education", img: nationalSisodiaImg },
                { name: "Sanjay Singh", role: "Voice of the Streets", img: nationalSanjayImg }
              ].map((leader, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <img src={leader.img} alt={leader.name} className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover" />
                  <div>
                    <h4 className="font-bold text-blue-950 text-sm leading-tight">{leader.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{leader.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Haryana State Command */}
          <div className="mb-12">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={16} /> Haryana State Leadership</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Dr. Sushil Gupta", role: "State President, Haryana", img: stateSushilImg, desc: "Leading the structural expansion and strategic oversight across all 90 constituencies." },
                { name: "Anurag Dhanda", role: "Senior Vice President", img: stateAnuragImg, desc: "Spearheading ground mobilization and exposing the ruling party's administrative failures." }
              ].map((leader, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-5 bg-blue-950 text-white p-5 rounded-2xl border-l-4 border-yellow-400 shadow-md hover:-translate-y-1 transition-transform duration-300">
                  <img src={leader.img} alt={leader.name} className="w-20 h-20 rounded-full border-4 border-slate-800 object-cover" />
                  <div className="text-center sm:text-left">
                    <h4 className="text-xl font-black text-yellow-400 leading-tight">{leader.name}</h4>
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-widest mb-2">{leader.role}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{leader.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Faridabad Assembly Command (Dynamic Filter Dropdown) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Faridabad Ground Command</h3>
                <p className="text-gray-500 font-medium text-sm mt-1">Select your constituency to find your local AAP fighter.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-inner">
                <Filter size={20} className="text-slate-400 ml-3" />
                <select
                  value={selectedAssembly}
                  onChange={(e) => setSelectedAssembly(e.target.value)}
                  className="bg-transparent text-blue-950 font-bold py-3 pr-8 pl-2 focus:outline-none w-full md:w-56 cursor-pointer"
                >
                  {Object.keys(localCommandData).map(assembly => (
                    <option key={assembly} value={assembly}>{assembly}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamically Filtered Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localCommandData[selectedAssembly].map((local) => (
                <div key={local.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="p-6 text-center">
                    <img src={local.img} alt={local.name} className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md mb-4 object-cover" />
                    <h4 className="text-xl font-black text-slate-800">{local.name}</h4>
                    <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-5">{local.role}</p>

                    <div className="flex justify-center gap-3 mb-6">
                      <div className="bg-white px-3 py-2 rounded-lg border border-red-100 shadow-sm w-1/2">
                        <div className="text-xl font-black text-red-600 leading-none">{local.activeFights}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase mt-1 flex items-center justify-center gap-1">
                          <AlertTriangle size={10} className="text-red-500" /> Active Fights
                        </div>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-lg border border-green-100 shadow-sm w-1/2">
                        <div className="text-xl font-black text-green-600 leading-none">{local.issuesResolved}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase mt-1 flex items-center justify-center gap-1">
                          <CheckCircle2 size={10} className="text-green-500" /> Resolved
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-[#25D366] hover:bg-[#1fae51] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                      <MessageSquare size={18} /> Connect with {local.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }
function JoinMovementPage({ setTab }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const [constituency, setConstituency] = useState('Faridabad NIT');
  const [motivations, setMotivations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);

  const motivationOptions = [
    "💻 Digital Media & IT Campaigning",
    "📢 Ground Protests & Local Rallies",
    "🏡 Booth-Level Coordination & RWA Outreach",
    "🩺 Civic Issue Reporting & Audits"
  ];

  const toggleMotivation = (option) => {
    setMotivations(prev =>
      prev.includes(option) ? prev.filter(m => m !== option) : [...prev, option]
    );
  };
  const handleSendOtp = async () => {
    // --- EDIT THIS PART ---
    if (name.length < 2 || mobile.length < 10 || !email.includes('@')) {
      alert("Please enter a valid name, email, and mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/volunteer-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, email })
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    // --- EDIT THIS PART ---
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/volunteer-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp })
      });

      const data = await response.json();
      if (response.ok) {
        setStep(2); // Success Screen
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/movement/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, constituency, coreMotivations: motivations })
      });
      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setMemberInfo(data.data);
        window.scrollTo(0, 0);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      // Offline fallback: Mocks a successful registration so you can test the UI without the backend!
      setIsSubmitted(true);
      setMemberInfo({ membershipId: `AAP-FBD-2026-${Math.floor(1000 + Math.random() * 9000)}` });
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className={`bg-slate-50 font-sans animate-in fade-in duration-500 ${isSubmitted ? 'pb-8' : 'pb-16'}`}>
      {/* Sticky Back Navigation */}

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
      {!isSubmitted && (
        <button
          onClick={() => { setTab('home'); window.scrollTo(0, 0); }}
          className="group flex items-center gap-2 px-4 py-2 mb-4 text-sm font-bold text-slate-500 bg-white border border-slate-200 rounded-full shadow-sm w-fit hover:text-blue-700 hover:border-blue-200 hover:shadow transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      )}

    
        {!isSubmitted && (
      <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter mb-1">Join the <span className="text-yellow-500">Movement</span></h2>
          <p className="text-slate-500 font-medium text-sm">Step forward to build a world-class Faridabad.</p>
        </div>
        )}

        <div className={`bg-white border border-gray-200 px-6 rounded-2xl shadow-xl relative overflow-hidden ${isSubmitted ? 'py-4' : 'pt-6 pb-8'}`}>
          {isSubmitted ? (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center space-y-4 py-1">
              <div className="bg-green-500/10 p-3 rounded-full border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">🎉 REGISTRATION CONFIRMED!</h3>
                <p className="text-gray-500 text-sm font-medium text-sm mt-1">Welcome to the Faridabad Ground Command.</p>
              </div>

              <div className="bg-yellow-400 text-slate-950 px-4 py-2.5 rounded-xl border-2 border-yellow-400 font-black text-sm md:text-base tracking-widest w-full shadow-sm">
                [ Digital Volunteer Pass ID: {memberInfo?.membershipId} ]
              </div>

              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 w-full shadow-sm">
                <p className="text-gray-600 text-sm font-medium leading-snug">
                  Your details are securely mapped to the <strong className="text-blue-900 text-base">{constituency}</strong> Team.
                  <br />A local assembly coordinator will reach out shortly.
                </p>
              </div>

              <div className="w-full border-t border-gray-200 pt-4 mt-1">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Next Steps To Accelerate The Movement:</h4>

                <a href="#" className="flex flex-col items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-xl font-black uppercase tracking-wide transition-all shadow-md mb-3 group">
                  <span className="flex items-center gap-2 text-xs"><MessageSquare size={16} className="group-hover:animate-pulse" /> [ JOIN OUR OFFICIAL WHATSAPP BROADCAST ]</span>
                  <span className="text-[9px] font-bold text-green-100 mt-0.5 capitalize tracking-normal">(Get daily media leaks and ground protest updates)</span>
                </a>

                <div className="bg-white p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer shadow-sm">
                  <p className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-2">
                    📸 [ FOLLOW AAP FARIDABAD ON INSTAGRAM, FACEBOOK, YOUTUBE, X ]
                  </p>
                  <p className="text-[9px] md:text-xs text-gray-500 font-medium">(Watch our live exposes of local civic issues)</p>
                </div>
              </div>

              
            </div>
          ) : (
            <>
              { }
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amit Kumar" className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                  </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                        placeholder="bhavdiya@gmail.com"
                      />
                    </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Mobile Number</label>
                    <div className="flex bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
                      <span className="bg-gray-100 text-gray-500 font-bold p-3 border-r border-gray-300">+91</span>
                      <input type="tel" maxLength="10" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" className="w-full bg-transparent text-gray-900 p-3 font-bold tracking-widest outline-none" />
                    </div>
                  </div>

                  {/* Dynamic OTP Block */}
                  {otpSent && (
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 animate-in slide-in-from-top-4 duration-300 shadow-inner">
                      <label className="block text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle2 size={14} /> Enter 4-Digit OTP</label>
                      <input type="text" maxLength="4" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="• • • •" className="w-full bg-white border border-gray-300 text-center text-gray-900 text-lg tracking-[1em] rounded-lg p-2 font-black focus:border-blue-500 outline-none shadow-sm" />
                    </div>
                  )}

                    
                  <button
                      onClick={() => otpSent ? handleVerifyOtp() : handleSendOtp()}
                      disabled={isLoading || (otpSent ? otp.length !== 4 : (mobile.length !== 10 || !name || !email.includes('@')))}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-black uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md mt-4"
                  >
                    {otpSent ? "Verify Code" : "Send Verification Code"}
                  </button>
                
              </div>
              )}

              { }
              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-8">
                  <div>
                      <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Your Assembly Constituency</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select value={constituency} onChange={(e) => setConstituency(e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-2.5 pl-9 pr-3 font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm">
                        <option>Faridabad NIT</option>
                        <option>Badkhal</option>
                        <option>Ballabgarh</option>
                        <option>Faridabad Central</option>
                        <option>Tigaon</option>
                      </select>
                    </div>
                  </div>

                  <div>
                      <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">How Do You Want to Power the Movement?</label>
                    <div className="flex flex-col gap-1.5">
                      {motivationOptions.map((opt, idx) => (
                        <button
                          key={idx} onClick={() => toggleMotivation(opt)}
                          className={`text-left px-3 py-2 rounded-xl font-bold border-2 transition-all duration-200 shadow-sm ${motivations.includes(opt) ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleFinalSubmit} disabled={isSubmitting || motivations.length === 0}
                      className="w-full bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-black uppercase tracking-wider hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Joining..." : "Confirm & Join Ground Command"} <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  
  );
}


// --- REPORT VIEW ---

function ReportView({ setTab }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('Broken Road / Pothole');
  const [details, setDetails] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const { requireAuth } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL to display the image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // In a real app, you would also save 'file' to state to send to your backend
    }
  };

  const handleFinalSubmit = () => {
    // Ask for login before submitting!
    requireAuth(async () => {
      setIsSubmitting(true);
      const finalCategory = category === 'Other / Not Listed' ? customCategory : category;
      const formData = new FormData();

      if (imageFile) formData.append('image', imageFile);
      formData.append('category', finalCategory);
      formData.append('description', details || "No description provided");
      formData.append('lat', '28.4089');
      formData.append('lng', '77.3178');

      try {
        const token = localStorage.getItem('aap_citizen_token');
        const response = await fetch(`${API_BASE_URL}/api/complaints`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // Send the token!
          },
          body: formData
        });
        const data = await response.json();
        if (response.ok) setStep(3);
        else alert(`Error: ${data.message || 'Something went wrong'}`);
      } catch (error) {
        console.error("Submission error:", error);
        setStep(3);
      } finally {
        setIsSubmitting(false);
      }
    }, "To ensure accountability and receive updates when AAP fixes this issue, please sign in."); // The custom message
  };


  return (
    <div className="max-w-2xl mx-auto px-4 pt-12 pb-6 animate-in slide-in-from-bottom-4 duration-500">
      {step !== 3 && (
        <button onClick={() => setTab('home')} className="text-slate-500 font-bold text-sm flex items-center gap-1 mb-8 hover:text-blue-700 transition-colors">
          <ArrowLeft size={16} /> Back to Radar
        </button>
      )}

      <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl shadow-lg">
        {step !== 3 && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">Report a Failure</h2>
            <p className="text-sm text-gray-500 font-medium mb-3">Your report directly alerts our ground workers to challenge the administration.</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-3 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative overflow-hidden"
              style={{ minHeight: '200px' }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="text-blue-600" size={32} />
                  </div>
                  <span className="font-bold text-gray-700">Tap or Click to Upload Photo</span>
                </div>
              )}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-4 rounded-lg font-black uppercase tracking-wider hover:bg-blue-700 transition-colors">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right-8">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Issue Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-50 transition-colors">
                <option>Broken Road / Pothole</option>
                <option>Water Logging / Sewage</option>
                <option>Streetlight Failure</option>
                <option>Garbage Dump</option>
                <option>Other / Not Listed</option>
              </select>
              {category === 'Other / Not Listed' && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Please Specify Issue</label>
                  <input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="e.g. Stray Animal Menace" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Details (Optional)</label>
              <textarea rows="3" maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Briefly describe the issue..." className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              <div className="text-right text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{details.length} / 500</div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">Back</button>
              <button onClick={handleFinalSubmit} disabled={isSubmitting || (category === 'Other / Not Listed' && !customCategory.trim())} className="w-2/3 bg-blue-900 text-white py-3 rounded-lg font-black uppercase tracking-wider hover:bg-blue-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                {isSubmitting ? "Submitting..." : "Submit Issue"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center py-8">
            <div className="bg-green-100 p-4 rounded-full mb-6 border-4 border-green-50 shadow-sm">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Issue Reported!</h3>
            <p className="text-gray-600 font-medium leading-relaxed max-w-md mx-auto mb-8">
              <strong className="text-blue-900 font-black">Thank you for being an active citizen.</strong><br />
              Your report has been added to the Live Radar and our ground workers have been notified.
            </p>
            <button onClick={() => setTab('home')} className="w-full sm:w-auto px-8 bg-blue-900 text-white py-3 rounded-lg font-black uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-sm">
              Return to Live Radar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function WorkerLoginView({ setTab }) {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestTelegramOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/worker-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Offline Mode: Simulating OTP sent. Proceed to enter any 4 digits.");
      setStep(2); // Simulated bypass for local preview
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAccess = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/worker-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      });
      const data = await response.json();
      if (response.ok) {
        // Persist session to local storage
        localStorage.setItem('aap_worker_auth', 'true');
        localStorage.setItem('aap_worker_name', data.data.name);
        alert(`Welcome back, ${data.data.name}! Command Center access granted.`);
        setTab('home');
      } else {
        alert("Invalid OTP code.");
      }
    } catch (err) {
      console.log(err);
      alert("Offline Mode: Simulating Auth Success!");
      localStorage.setItem('aap_worker_auth', 'true');
      setTab('home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col items-center pt-20 px-4 animate-in fade-in duration-500 relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <button onClick={() => setTab('home')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-yellow-400 transition-colors">
          <ArrowLeft size={20} /> Back to Public Site
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-950 p-4 rounded-full border border-blue-800 mb-4 shadow-inner">
            <Lock size={32} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Ground Worker Portal</h2>
          <p className="text-xs text-slate-500 font-bold tracking-widest mt-1 uppercase">Restricted Access</p>
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Registered Mobile</label>
              <div className="flex bg-slate-800 border border-slate-700 rounded-lg overflow-hidden focus-within:border-blue-500 transition-all">
                <span className="bg-slate-950 text-slate-500 font-bold p-4 border-r border-slate-700">+91</span>
                <input
                  type="tel" maxLength="10" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10 digits"
                  className="w-full bg-transparent text-white p-4 font-bold tracking-widest outline-none"
                />
              </div>
            </div>
            <button
              onClick={requestTelegramOtp} disabled={mobile.length !== 10 || isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-black uppercase tracking-wider hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {isLoading ? "Connecting..." : "Get Access OTP on Telegram"}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-8">
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-900/50 text-center">
              <p className="text-sm text-slate-300 font-medium">An authorization code has been sent to your registered <strong className="text-blue-400">Telegram App</strong>.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Enter 4-Digit Code</label>
              <input
                type="text" maxLength="4" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full bg-slate-950 border border-slate-700 text-center text-yellow-400 text-3xl tracking-[1em] rounded-lg py-4 font-black focus:border-yellow-400 outline-none"
              />
            </div>
            <button
              onClick={verifyAccess} disabled={otp.length !== 4 || isLoading}
              className="w-full bg-yellow-400 text-slate-950 py-4 rounded-lg font-black uppercase tracking-wider hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? "Verifying..." : "Verify & Enter Command Center"}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-slate-500 text-xs font-bold uppercase hover:text-white transition-colors mt-2">
              &larr; Change Mobile Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}