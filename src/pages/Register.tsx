import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dice1 } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password || !confirmPassword || !nickname || !city) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      await register(email, password, nickname, city);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during registration");
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-board-cream p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <Dice1 className="h-8 w-8 text-board-purple" />
            <h1 className="text-2xl font-bold text-board-slate">
              Board<span className="text-board-purple">Haven</span>
            </h1>
          </Link>
          <h2 className="text-xl font-medium mt-2">Create an account</h2>
          <p className="text-board-slate-light">Join the board game community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="rounded-lg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium">
              Nickname
            </label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="GameMaster42"
              className="rounded-lg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              className="rounded-lg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="rounded-lg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="rounded-lg"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-board-purple hover:bg-board-purple-dark rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-board-slate-light">
            Already have an account?{" "}
            <Link to="/login" className="text-board-purple hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
