import { useState, useEffect } from 'react';

function App() {
  // --- Global State ---
  const [currentView, setCurrentView] = useState('login'); 
  const [userRole, setUserRole] = useState('user'); 
  
  // --- Data State ---
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("complaints_db");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Login & User Input State ---
  const [loginData, setLoginData] = useState({ email: '', mobile: '', password: '' });
  const [nameDetails, setNameDetails] = useState({ firstName: '', lastName: '' });
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("complaints_db", JSON.stringify(complaints));
  }, [complaints]);

  // --- HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return alert("Please fill in credentials.");

    if (userRole === 'host') {
      if(loginData.password === 'admin') setCurrentView('host-dashboard');
      else alert("Wrong Host Password! (Hint: use 'admin')");
    } else {
      setCurrentView('user-dashboard');
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, () => alert("Permission denied."));
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

  const handleSubmitComplaint = () => {
    if(!nameDetails.firstName) return alert("Name is required");

    const newComplaint = {
      id: Date.now(),
      timestamp: new Date().toLocaleDateString(), // Formatted for your card
      user: nameDetails,
      contact: { email: loginData.email, mobile: loginData.mobile },
      location: location,
      photo: photo
    };

    setComplaints([newComplaint, ...complaints]);
    setCurrentView('success');
  };

  const handleLogout = () => {
    setLoginData({ email: '', mobile: '', password: '' });
    setNameDetails({ firstName: '', lastName: '' });
    setLocation(null);
    setPhoto(null);
    setCurrentView('login');
  };

  // --- RENDER 1: LOGIN SCREEN (Standard React Design) ---
  if (currentView === 'login') {
    return (
      <div className="app-container">
        <div className="card login-card fade-in">
          <h1>🔐 Secure Portal</h1>
          <div className="role-switch">
            <button className={userRole === 'user' ? 'active' : ''} onClick={() => setUserRole('user')}>👤 User</button>
            <button className={userRole === 'host' ? 'active' : ''} onClick={() => setUserRole('host')}>🛡️ Host</button>
          </div>
          <form onSubmit={handleLogin} className="form-stack">
            <div className="input-group">
              <label>Email ID</label>
              <input type="email" placeholder="mail@example.com" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} />
            </div>
            {userRole === 'user' && (
              <div className="input-group">
                <label>Mobile Number</label>
                <input type="tel" placeholder="Mobile No" value={loginData.mobile} onChange={e => setLoginData({...loginData, mobile: e.target.value})} />
              </div>
            )}
            <div className="input-group">
              <label>Password {userRole === 'host' && '(Try: admin)'}</label>
              <input type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
            </div>
            <button type="submit" className="primary-btn">{userRole === 'user' ? 'Login & Report' : 'Access Dashboard'}</button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER 2: USER DASHBOARD (Standard React Design) ---
  if (currentView === 'user-dashboard') {
    return (
      <div className="app-container">
        <div className="dashboard-container fade-in-up">
          <div className="header-simple">
            <h2>📝 New Complaint</h2>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          <div className="card option-card">
            <h3>1. Personal Details</h3>
            <div className="form-row">
              <input placeholder="First Name" value={nameDetails.firstName} onChange={e => setNameDetails({...nameDetails, firstName: e.target.value})}/>
              <input placeholder="Last Name" value={nameDetails.lastName} onChange={e => setNameDetails({...nameDetails, lastName: e.target.value})}/>
            </div>
          </div>
          <div className="card option-card">
            <h3>2. Location Evidence</h3>
            <div className="location-controls">
              <button onClick={getLocation} className="action-btn">📍 Pin My Location</button>
            </div>
            {location && <div className="location-display">Location Fetched ✅</div>}
          </div>
          <div className="card option-card">
            <h3>3. Photo Evidence</h3>
            <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="file-input" />
            {photo && <div className="photo-preview"><img src={photo} alt="Preview" /></div>}
          </div>
          <button className="primary-btn submit-final-btn" onClick={handleSubmitComplaint}>Submit Complaint ✅</button>
        </div>
      </div>
    );
  }

  // --- RENDER 3: SUCCESS SCREEN ---
  if (currentView === 'success') {
    return (
      <div className="app-container">
        <div className="success-card fade-in-up">
           <h2 style={{color: '#10b981'}}>Success!</h2>
           <p>Complaint Registered.</p>
           <button className="primary-btn" onClick={handleLogout} style={{marginTop: '20px'}}>Back</button>
        </div>
      </div>
    );
  }

  // --- RENDER 4: HOST DASHBOARD (YOUR CUSTOM HTML DESIGN) ---
  if (currentView === 'host-dashboard') {
    return (
      <div className="custom-body">
        <div className="container">
            <header className="header_class">
                <h1 className="header_title">WASTE 2 BEST</h1>
                <p className="header_description">
                    This is a joint initiative of our team and Municipal Corporation officials to bring back the glory of the city.
                    <br/>
                    <button onClick={handleLogout} style={{marginTop:'10px', padding:'5px 10px', cursor:'pointer'}}>Logout</button>
                </p>
            </header>

            <main className="main_class">
                {complaints.length === 0 ? (
                   <h2 style={{textAlign: 'center', width: '100%', fontFamily: 'Roboto'}}>No Complaints Yet...</h2>
                ) : (
                   complaints.map((c) => (
                    <div className="card_container" key={c.id}>
                        <a href="#" className="image">
                            {/* Use uploaded photo or a default placeholder if none exists */}
                            <img className="image_class" src={c.photo || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop"} alt="evidence" />
                        </a>
                        <div className="card_description">
                            <a className="address" href="#"> 
                                <h2 className="address_class">
                                  {c.location ? `Lat: ${c.location.lat.toFixed(2)}` : 'UNKNOWN LOCATION'}
                                </h2>
                            </a>
                            <p className="para">
                                Complaint raised by {c.user.firstName}. Needs cleaning ASAP.
                            </p>
                        </div>
                        
                        <div className="footer">
                            <div className="complainer">
                                    {/* Using a generic avatar generator for the user icon */}
                                    <img className="avatar" src={`https://ui-avatars.com/api/?name=${c.user.firstName}&background=random`} alt="" />
                                    <div className="ndate">
                                      <span className="name">{c.user.firstName} {c.user.lastName}</span>
                                      <span className="date">{c.timestamp}</span>
                                    </div>
                                </div>

                            <div className="goto">
                                {/* Open Maps when clicked */}
                                <span 
                                  onClick={() => c.location && window.open(`http://maps.google.com/maps?q=${c.location.lat},${c.location.lng}`)}
                                  style={{cursor: 'pointer'}}
                                >
                                  GO TO
                                </span>
                            </div>
                        </div>
                    </div>
                   ))
                )}
            </main>
        </div>
      </div>
    );
  }
}

export default App;