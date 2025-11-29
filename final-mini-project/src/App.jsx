import { useState, useEffect } from 'react';

// --- Icons ---
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  MapPin: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
};

// --- Helper: Regex Email Validation ---
const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// --- Dark Diamond Background ---
const DarkDiamondBackground = ({ children }) => (
  <div className="min-h-screen bg-dark-900 text-slate-200 relative overflow-hidden font-body selection:bg-neon-500 selection:text-black">
    {/* Diamond CSS Pattern */}
    <div className="absolute inset-0 diamond-pattern opacity-10 pointer-events-none"></div>
    
    {/* Ambient Glows */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-float"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
    </div>

    <div className="relative z-10 w-full h-full">
      {children}
    </div>
  </div>
);

// --- Header ---
const MainHeader = ({ onLogout }) => (
  <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
    <div className="pointer-events-auto group cursor-pointer">
      <h1 className="text-4xl md:text-5xl font-brand font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-400 to-purple-400 drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
        WASTE <span className="text-white">2</span> BEST
      </h1>
    </div>
    {onLogout && (
      <button onClick={onLogout} className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 transition-all shadow-lg">
        <Icons.LogOut /> <span className="hidden md:inline">Logout</span>
      </button>
    )}
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [userRole, setUserRole] = useState('user');
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("complaints_db") || "[]"));

  // Login State
  const [loginData, setLoginData] = useState({ email: '', mobile: '', password: '' });
  
  // Complaint/Admin Upload State
  const [nameDetails, setNameDetails] = useState({ firstName: '', lastName: '' });
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [adminNote, setAdminNote] = useState(''); // New for admin
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("complaints_db", JSON.stringify(complaints));
  }, [complaints]);

  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. Validation Logic
    if (!loginData.email) return alert("Email is required.");
    if (!isValidEmail(loginData.email)) return alert("Please enter a valid verified Email ID (e.g., user@domain.com).");
    if (!loginData.password) return alert("Password is required.");

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (userRole === 'host') {
        if(loginData.password === 'admin') setCurrentView('host-dashboard');
        else alert("Wrong Host Password! (Hint: use 'admin')");
      } else {
        setCurrentView('user-dashboard');
      }
    }, 800);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert("Permission denied.")
      );
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (isAdmin = false) => {
    if(!isAdmin && !nameDetails.firstName) return alert("Name is required");
    if(!photo) return alert("Photo is required");

    setIsLoading(true);
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleDateString(),
        type: isAdmin ? 'admin-post' : 'complaint',
        user: isAdmin ? { firstName: 'ADMIN', lastName: 'HOST' } : nameDetails,
        contact: { email: loginData.email },
        location: location,
        photo: photo,
        note: isAdmin ? adminNote : 'User Report'
      };
      setComplaints([newEntry, ...complaints]);
      setIsLoading(false);
      
      // Reset logic
      if(isAdmin) {
        alert("Admin Post Uploaded Successfully!");
        setPhoto(null);
        setAdminNote('');
        setLocation(null);
      } else {
        setCurrentView('success');
      }
    }, 1500);
  };

  const handleLogout = () => {
    setLoginData({ email: '', mobile: '', password: '' });
    setNameDetails({ firstName: '', lastName: '' });
    setLocation(null);
    setPhoto(null);
    setAdminNote('');
    setCurrentView('login');
  };

  // --- VIEWS ---

  // 1. LOGIN VIEW (Dark, Diamond, Enhanced Animation)
  if (currentView === 'login') {
    return (
      <DarkDiamondBackground>
        <MainHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 transform animate-pop-in relative overflow-hidden">
            
            {/* Glossy shine effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-neon-400 blur-3xl opacity-10"></div>

            {/* Role Toggle */}
            <div className="flex bg-dark-800/50 p-1 rounded-xl mb-8 relative border border-white/5">
              <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-neon-500 to-cyan-600 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-spring ${userRole === 'host' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'}`}></div>
              <button onClick={() => setUserRole('user')} className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 font-semibold rounded-lg transition-colors duration-300 ${userRole === 'user' ? 'text-white' : 'text-slate-400'}`}>
                <Icons.User /> User
              </button>
              <button onClick={() => setUserRole('host')} className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 font-semibold rounded-lg transition-colors duration-300 ${userRole === 'host' ? 'text-white' : 'text-slate-400'}`}>
                <Icons.Shield /> Admin
              </button>
            </div>

            <h2 className="text-3xl font-brand text-center text-white mb-2 tracking-wide">
              {userRole === 'host' ? 'Admin Portal' : 'Welcome'}
            </h2>
            <p className="text-center text-slate-400 mb-8 text-sm">
              {userRole === 'user' ? 'Secure login to report waste.' : 'Verify credentials to access.'}
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="group">
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-slate-700 text-white placeholder-slate-500 focus:bg-dark-900 focus:border-neon-400 focus:ring-1 focus:ring-neon-400 transition-all outline-none"
                  placeholder="Valid Email ID"
                  value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              
              {userRole === 'user' && (
                <div className="group animate-fade-in-up">
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-slate-700 text-white placeholder-slate-500 focus:bg-dark-900 focus:border-neon-400 focus:ring-1 focus:ring-neon-400 transition-all outline-none"
                    placeholder="Mobile Number"
                    value={loginData.mobile} onChange={e => setLoginData({...loginData, mobile: e.target.value})}
                  />
                </div>
              )}
              
              <div className="group">
                <input 
                  type="password" 
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-slate-700 text-white placeholder-slate-500 focus:bg-dark-900 focus:border-neon-400 focus:ring-1 focus:ring-neon-400 transition-all outline-none"
                  placeholder={userRole === 'host' ? "Admin Key" : "Password"}
                  value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})}
                />
              </div>

              <button 
                disabled={isLoading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-neon-500 to-cyan-600 hover:from-neon-400 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transform active:scale-95 transition-all flex justify-center items-center tracking-wider"
              >
                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'AUTHENTICATE'}
              </button>
            </form>
          </div>
        </div>
      </DarkDiamondBackground>
    );
  }

  // 2. USER DASHBOARD (Adapted for Dark Mode)
  if (currentView === 'user-dashboard') {
    return (
      <DarkDiamondBackground>
        <MainHeader onLogout={handleLogout} />
        <div className="pt-32 pb-12 px-4 max-w-3xl mx-auto">
          <div className="bg-dark-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 animate-pop-in">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="bg-neon-500/20 text-neon-400 p-2 rounded-lg"><Icons.Camera /></span>
              New Complaint
            </h2>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-slate-700 text-white focus:border-neon-400 outline-none" value={nameDetails.firstName} onChange={e => setNameDetails({...nameDetails, firstName: e.target.value})} />
              <input placeholder="Last Name" className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-slate-700 text-white focus:border-neon-400 outline-none" value={nameDetails.lastName} onChange={e => setNameDetails({...nameDetails, lastName: e.target.value})} />
            </div>

            <div className="mb-6">
              <button 
                onClick={getLocation}
                className={`w-full py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-all ${location ? 'border-neon-400 bg-neon-500/10 text-neon-400' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}
              >
                <Icons.MapPin />
                {location ? `GPS: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Fetch Location'}
              </button>
            </div>

            <div className="mb-8 relative">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`w-full h-48 rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden ${photo ? 'bg-black' : 'bg-dark-900 border-2 border-dashed border-slate-600'}`}>
                  {photo ? (
                    <img src={photo} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="mx-auto w-12 h-12 mb-2"><Icons.Camera /></div>
                      <span>Tap to upload photo</span>
                    </div>
                  )}
                </div>
            </div>

            <button 
               onClick={() => handleSubmit(false)}
               disabled={isLoading}
               className="w-full py-4 bg-gradient-to-r from-neon-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-neon-500/20 hover:shadow-neon-500/40 transform active:scale-95 transition-all"
            >
              {isLoading ? 'Uploading...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </DarkDiamondBackground>
    );
  }

  // 3. SUCCESS VIEW
  if (currentView === 'success') {
    return (
      <DarkDiamondBackground>
         <div className="min-h-screen flex items-center justify-center p-4">
           <div className="bg-dark-800/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 text-center max-w-sm w-full animate-pop-in">
             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">Report Sent!</h2>
             <p className="text-slate-400 mb-8">Thank you for helping us keep the environment clean.</p>
             <button onClick={handleLogout} className="w-full py-3 bg-white text-dark-900 rounded-xl font-bold hover:bg-slate-200 transition-colors">
               Back to Home
             </button>
           </div>
         </div>
      </DarkDiamondBackground>
    );
  }

  // 4. HOST DASHBOARD (Admin Upload + Grid)
  if (currentView === 'host-dashboard') {
    return (
      <DarkDiamondBackground>
        <MainHeader onLogout={handleLogout} />
        
        <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
          
          {/* --- ADMIN UPLOAD SECTION --- */}
          <div className="mb-12 bg-dark-800/60 backdrop-blur-md rounded-2xl p-6 border border-neon-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <h3 className="text-xl font-brand text-neon-400 mb-4 flex items-center gap-2">
              <Icons.Plus /> Create Admin Post
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative h-full min-h-[100px]">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                 <div className={`w-full h-full rounded-xl flex items-center justify-center overflow-hidden border border-dashed ${photo ? 'border-neon-500' : 'border-slate-600 bg-dark-900'}`}>
                    {photo ? <img src={photo} className="h-full w-full object-cover" /> : <span className="text-slate-500 text-sm">Upload Image</span>}
                 </div>
              </div>
              <div className="flex flex-col gap-3">
                 <textarea 
                    className="flex-1 rounded-xl bg-dark-900 border border-slate-700 p-3 text-white text-sm focus:border-neon-400 outline-none resize-none" 
                    placeholder="Write an announcement or update..."
                    value={adminNote} onChange={e => setAdminNote(e.target.value)}
                 />
                 <button onClick={getLocation} className="text-xs text-neon-400 border border-neon-400/30 rounded px-2 py-1 w-fit hover:bg-neon-400/10">
                   {location ? 'Location Attached' : '+ Attach Location'}
                 </button>
              </div>
              <div className="flex items-center justify-center">
                <button onClick={() => handleSubmit(true)} disabled={isLoading} className="w-full h-full max-h-[100px] bg-neon-600 hover:bg-neon-500 text-white font-bold rounded-xl transition-colors">
                  {isLoading ? 'Posting...' : 'Post Update'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-300">Live Feed</h2>
            <div className="h-1 w-24 bg-neon-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {complaints.length === 0 ? (
              <div className="col-span-full text-center py-20 opacity-50">
                 <p className="text-2xl font-brand text-slate-500">No activity yet...</p>
              </div>
            ) : (
              complaints.map((c, index) => (
                <div key={c.id} className={`group bg-dark-800 rounded-2xl overflow-hidden shadow-xl border ${c.type === 'admin-post' ? 'border-neon-500/50' : 'border-white/5'} hover:transform hover:scale-[1.02] transition-all duration-300 animate-pop-in`} style={{animationDelay: `${index * 100}ms`}}>
                  
                  {/* Image Area */}
                  <div className="h-56 overflow-hidden relative">
                    <img src={c.photo} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10">
                      {c.timestamp}
                    </div>
                    {c.type === 'admin-post' && (
                      <div className="absolute top-2 left-2 bg-neon-500 text-black text-[10px] font-bold px-2 py-1 rounded">ADMIN</div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="font-bold text-white text-sm">
                         {c.type === 'admin-post' ? 'SYSTEM UPDATE' : `Report #${c.id.toString().slice(-4)}`}
                       </h3>
                       {c.type !== 'admin-post' && (
                         <span className="text-xs text-slate-400 bg-dark-900 px-2 py-1 rounded-full">{c.user.firstName}</span>
                       )}
                    </div>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                      {c.type === 'admin-post' ? c.note : `Location reported by ${c.user.firstName}. Action pending.`}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <button 
                          onClick={() => c.location && window.open(`http://maps.google.com/maps?q=${c.location.lat},${c.location.lng}`)}
                          className="text-xs font-bold text-neon-400 hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
                        >
                          View Map ↗
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DarkDiamondBackground>
    );
  }
}

export default App;