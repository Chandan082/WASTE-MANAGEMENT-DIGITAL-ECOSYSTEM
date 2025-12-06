import { useState, useEffect } from 'react';

// --- Icons (Dark colors for light background) ---
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  MapPin: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  List: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

// --- Spring Background (Green, Yellow, Pink) ---
const SpringBackground = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50 text-gray-800 relative overflow-hidden font-sans selection:bg-pink-200 selection:text-pink-900">
    <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    <div className="relative z-10 w-full h-full">
      {children}
    </div>
  </div>
);

// --- Header ---
const MainHeader = ({ onLogout }) => (
  <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
    <div className="pointer-events-auto group cursor-pointer bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-pink-100">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-yellow-500 to-pink-500">
        WASTE <span className="text-green-600">2</span> BEST
      </h1>
    </div>
    {onLogout && (
      <button onClick={onLogout} className="pointer-events-auto flex items-center gap-2 px-6 py-2 bg-white border border-pink-200 rounded-full text-pink-600 font-bold hover:bg-pink-50 hover:border-pink-300 hover:shadow-md transition-all">
        <Icons.LogOut /> <span className="hidden md:inline">Logout</span>
      </button>
    )}
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [userRole, setUserRole] = useState('user');
  
  // Load LocalStorage
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("complaints_db") || "[]"));
  const [userViewMode, setUserViewMode] = useState('new'); 

  const [loginData, setLoginData] = useState({ email: '', mobile: '', password: '' });
  const [nameDetails, setNameDetails] = useState({ firstName: '', lastName: '' });
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("complaints_db", JSON.stringify(complaints));
  }, [complaints]);

  // --- Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email) return alert("Email is required.");
    if (!loginData.password) return alert("Password is required.");

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await response.json();

      if (response.ok) {
        setUserRole(data.role); 
        setCurrentView(data.role === 'host' ? 'host-dashboard' : 'user-dashboard');
      } else {
        alert(data.message); 
      }
    } catch (error) {
      alert("Could not connect to server. Check backend.");
    } finally {
      setIsLoading(false);
    }
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

  const handleDelete = (id) => {
    if(window.confirm("Permanently delete this report?")) {
        const updatedList = complaints.filter(c => c.id !== id);
        setComplaints(updatedList);
    }
  };

  const handleClearAll = () => {
    if(window.confirm("WARNING: Delete ALL reports?")) {
        setComplaints([]);
        localStorage.removeItem("complaints_db");
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
      
      if(isAdmin) {
        alert("Posted!");
        setPhoto(null); setAdminNote(''); setLocation(null);
      } else {
        setCurrentView('success');
      }
    }, 1500);
  };

  const handleLogout = () => {
    setLoginData({ email: '', mobile: '', password: '' });
    setNameDetails({ firstName: '', lastName: '' });
    setLocation(null); setPhoto(null); setAdminNote('');
    setUserViewMode('new');
    setCurrentView('login');
  };

  // --- VIEWS ---

  // 1. LOGIN
  if (currentView === 'login') {
    return (
      <SpringBackground>
        <MainHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 p-8 transform transition-all hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-center text-gray-500 mb-8 text-sm">Sign in to your eco-friendly dashboard</p>
            
            <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
              <button onClick={() => setUserRole('user')} className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-all ${userRole === 'user' ? 'bg-white text-green-600 shadow-md border border-green-100' : 'text-gray-400 hover:text-gray-600'}`}>
                <Icons.User /> User
              </button>
              <button onClick={() => setUserRole('host')} className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-all ${userRole === 'host' ? 'bg-white text-pink-600 shadow-md border border-pink-100' : 'text-gray-400 hover:text-gray-600'}`}>
                <Icons.Shield /> Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none font-medium" placeholder="Email Address" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} />
              <input type="password" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none font-medium" placeholder="Password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />

              <button disabled={isLoading} className="w-full py-4 mt-6 bg-gradient-to-r from-green-400 to-yellow-400 hover:from-green-500 hover:to-yellow-500 text-white font-black tracking-wide rounded-2xl shadow-lg shadow-yellow-200 transform active:scale-95 transition-all">
                {isLoading ? 'VERIFYING...' : 'LOGIN NOW'}
              </button>

              <button type="button" onClick={async () => {
                  const role = prompt("Enter role (user/host):", "user");
                  if(!role) return;
                  try {
                    await fetch('http://localhost:5000/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...loginData, role })
                    });
                    alert("Registered!");
                  } catch(err) { alert("Failed."); }
                }} className="w-full py-2 text-center text-gray-400 text-sm hover:text-green-600 font-semibold cursor-pointer">
                Create Account?
              </button>
            </form>
          </div>
        </div>
      </SpringBackground>
    );
  }

  // 2. USER DASHBOARD
  if (currentView === 'user-dashboard') {
    return (
      <SpringBackground>
        <MainHeader onLogout={handleLogout} />
        <div className="pt-32 pb-12 px-4 max-w-3xl mx-auto">
          <div className="flex gap-4 mb-8 bg-white/60 backdrop-blur-md p-2 rounded-3xl border border-white shadow-sm">
            <button onClick={() => setUserViewMode('new')} className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${userViewMode === 'new' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200' : 'text-gray-500 hover:bg-white'}`}><Icons.Camera /> Report Waste</button>
            <button onClick={() => setUserViewMode('history')} className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${userViewMode === 'history' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200' : 'text-gray-500 hover:bg-white'}`}><Icons.List /> My Reports</button>
          </div>

          {userViewMode === 'new' ? (
            <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-pink-50">
                <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2"><span className="text-green-500">●</span> New Complaint</h2>
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <input placeholder="First Name" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-pink-300 outline-none transition-all" value={nameDetails.firstName} onChange={e => setNameDetails({...nameDetails, firstName: e.target.value})} />
                    <input placeholder="Last Name" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-pink-300 outline-none transition-all" value={nameDetails.lastName} onChange={e => setNameDetails({...nameDetails, lastName: e.target.value})} />
                </div>
                <div className="mb-6"><button onClick={getLocation} className={`w-full py-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3 font-bold transition-all ${location ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400 hover:border-green-300'}`}><Icons.MapPin /> {location ? 'Location Secured' : 'Attach GPS Location'}</button></div>
                <div className="mb-8 relative h-56 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center overflow-hidden hover:border-pink-300 transition-all">
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {photo ? <img src={photo} className="h-full w-full object-cover" /> : <div className="text-center text-gray-400 font-medium"><Icons.Camera /> Click to Upload Photo</div>}
                </div>
                <button onClick={() => handleSubmit(false)} disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-green-500 to-green-400 hover:to-green-300 text-white font-black tracking-wide rounded-2xl shadow-lg shadow-green-200 transform active:scale-95 transition-all">{isLoading ? 'UPLOADING...' : 'SUBMIT REPORT'}</button>
            </div>
          ) : (
            <div className="space-y-4">
                {complaints.filter(c => c.contact?.email === loginData.email).map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center hover:shadow-md transition-all">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100"><img src={item.photo} className="w-full h-full object-cover" /></div>
                        <div><h4 className="text-gray-800 font-bold text-lg">Report #{item.id.toString().slice(-4)}</h4><p className="text-green-500 font-bold text-sm bg-green-50 px-3 py-1 rounded-full w-fit mt-1">Processing</p></div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </SpringBackground>
    );
  }

  // 3. SUCCESS
  if (currentView === 'success') {
    return (
      <SpringBackground>
         <div className="min-h-screen flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-green-100 max-w-sm w-full">
             <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100 text-white">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
             </div>
             <h2 className="text-3xl font-black text-gray-800 mb-2">Great Job!</h2>
             <p className="text-gray-500 mb-8">Your contribution helps keep our planet clean.</p>
             <button onClick={handleLogout} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl">Back to Home</button>
           </div>
         </div>
      </SpringBackground>
    );
  }

  // 4. HOST DASHBOARD (ADMIN)
  if (currentView === 'host-dashboard') {
    return (
      <SpringBackground>
        <MainHeader onLogout={handleLogout} />
        <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
          <div className="mb-12 bg-white rounded-[2rem] p-8 shadow-xl border border-green-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-pink-400"></div>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><span className="text-pink-500 bg-pink-50 p-2 rounded-lg"><Icons.Plus /></span> Admin Post</h3>
               <button onClick={handleClearAll} className="text-xs font-bold bg-red-50 text-red-500 px-4 py-2 rounded-full border border-red-100 hover:bg-red-500 hover:text-white transition-all">⚠ WIPE DATABASE</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative h-40 md:h-auto">
                 <div className="absolute inset-0 w-full h-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                   {photo ? <img src={photo} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm font-bold flex flex-col items-center"><Icons.Camera /> Upload Image</span>}
                 </div>
                 <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              </div>
              <div className="flex flex-col gap-3">
                 <textarea className="flex-1 rounded-2xl bg-gray-50 border border-gray-100 p-4 text-gray-800 text-sm focus:bg-white focus:border-green-300 outline-none resize-none font-medium" placeholder="Type your announcement here..." value={adminNote} onChange={e => setAdminNote(e.target.value)} />
                 <button onClick={getLocation} className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 rounded-lg px-3 py-2 w-fit hover:bg-green-100">{location ? '✓ Location Attached' : '+ Attach Location'}</button>
              </div>
              <div className="flex items-center justify-center">
                <button onClick={() => handleSubmit(true)} disabled={isLoading} className="w-full h-full bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-colors shadow-lg">{isLoading ? 'Posting...' : 'PUBLISH UPDATE'}</button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Live Feed</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-green-200 to-transparent rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {complaints.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 font-medium">Database is empty.</div>}
              {complaints.map((c) => (
                <div key={c.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-56 overflow-hidden relative">
                    <img src={c.photo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1 rounded-full text-gray-800 shadow-sm">{c.timestamp}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Report #{c.id.toString().slice(-4)}</h3>
                    <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">{c.type === 'admin-post' ? 'Admin Update' : 'User Report'}</p>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{c.note || `Submitted by ${c.user.firstName}`}</p>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                        className="w-full py-3 bg-pink-50 text-pink-500 border border-pink-100 rounded-xl hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-black"
                    >
                        <Icons.Trash /> DELETE
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </SpringBackground>
    );
  }
}

export default App;