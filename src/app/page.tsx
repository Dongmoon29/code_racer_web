'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { userStore } from '../../store/store';
import { useRouter } from 'next/navigation';
import { fetchUserProfile } from '@/api/userApi';
import { warn } from 'console';

export default function Home() {
  const { user, setUser, clearUser } = userStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      try {
        if (!user && token) {
          const userProfile = await fetchUserProfile();
          setUser(userProfile);
        }
        setLoading(false);
      } catch (error: any) {
        localStorage.removeItem('token');
        clearUser();
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, setUser, clearUser, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearUser();
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white">
        <nav className="container mx-auto py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            codeRacer
          </Link>
          <div className="space-x-4">
            <Button variant="secondary" asChild>
              <Link href="/games">Game</Link>
            </Button>
            {user ? (
              <Button onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            ) : (
              <Button variant="secondary" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to codeRacer</h1>
            <p className="text-xl mb-8">
              Compete with others to solve coding problems and improve your
              skills!
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/games">Start Racing</Link>
            </Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">
              How it Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Choose a Challenge
                </h3>
                <p>
                  Select from a variety of coding problems across different
                  difficulty levels.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Race Against Others
                </h3>
                <p>
                  Compete in real-time with developers from around the world.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Improve Your Skills
                </h3>
                <p>Learn from your races and track your progress over time.</p>
              </div>
            </div>
          </div>
        </section>

        {user ? null : (
          <section className="bg-gray-100 py-20">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Race?</h2>
              <p className="text-xl mb-8">
                Join codeRacer today and start competing!
              </p>
              <Button size="lg" variant="default" asChild>
                <Link href="/login">Sign Up Now</Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} codeRacer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
