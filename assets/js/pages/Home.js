import React, { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import Reviews from '../components/Reviews';
import Navbar from '../components/Navbar'; 
import '../../styles/home.scss';
import axios from 'axios';

const Home = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            try {
                const response = await axios.get('http://localhost:8000/verify-token', {
                    headers: { Authorization: `Bearer ${authData.token}` }
                });
                if (response.status === 200) {
                    setAuth({ token: authData.token, username: response.data.userIdentifier });
                }
            } catch (error) {
                console.error('Erreur de vérification d\'authentification:', error);
                setAuth({ token: null, username: null });
                localStorage.removeItem('auth');
            }
        }
    };

    verifyAuth();
}, [setAuth]);
  

  const handleLogout = async () => {
    // Déconnectez l'utilisateur côté client
    setAuth({ token: null, username: null });
    localStorage.removeItem('auth');

    try {
      await axios.post('http://localhost:8000/logout');
      console.log('Déconnexion réussie du côté serveur');
    } catch (error) {
      console.error('Erreur de déconnexion côté serveur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
     <Navbar auth={auth} handleLogout={handleLogout} />
      <header className="text-center p-6 mt-4">
        <h1 className="text-3xl font-bold">Bienvenue sur notre page de Reviews</h1>
      </header>
      <main className="p-4 mx-auto max-w-4xl">
        <Reviews />
      </main>
    </div>
  );
};

export default Home;