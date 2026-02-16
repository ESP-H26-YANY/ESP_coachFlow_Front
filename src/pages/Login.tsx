import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(""); 
    
    try {
      await authService.login({ 
        email: email, 
        password: password 
      })
      .then((data) => {
          login(data);
          navigate("/dashboard");
      });   
    } catch (err: any) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Connexion
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Votre email</Label>
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Votre mot de passe</Label>
            </div>
            <TextInput
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button type="submit" >
            Se connecter
          </Button>
        </form>
        
        <div className="text-sm text-center text-gray-500">
          Pas de compte ? <Link to="/register" className="text-blue-600 hover:underline">S'inscrire</Link>
        </div>
      </Card>
    </div>
  );
}