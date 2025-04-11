
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, MapPin } from "lucide-react";

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    setNickname(user.nickname);
    setCity(user.city);
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!nickname || !city) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      await updateProfile(nickname, city);
      setSuccess("Profile updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while updating your profile");
      }
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-board-cream">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-board-slate mb-6">Your Profile</h1>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 bg-board-purple text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user.nickname.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-medium">{user.nickname}</h2>
                <p className="text-board-slate-light">{user.email}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                  {success}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="nickname" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-board-purple" />
                  Nickname
                </label>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="rounded-lg"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-board-purple" />
                  City
                </label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-lg"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="bg-board-purple hover:bg-board-purple-dark rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Email Address</h3>
                <p className="text-board-slate-light">{user.email}</p>
              </div>
              
              <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                Change Password
              </Button>
              
              <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
