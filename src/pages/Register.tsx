import { useState } from "react";
import { authService } from "../services/api";
import { Button, Card, Label, TextInput, Select } from "flowbite-react"; // Ajout de Select
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Valeur par défaut : Élève (user)
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      await authService.register({ 
        name: name, 
        email: email, 
        password: password,
        role: role 
      });
      navigate("/login"); 
    } catch (err: any) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Créer un compte
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name">Nom complet</Label>
            </div>
            <TextInput 
              id="name" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Email</Label>
            </div>
            <TextInput 
              id="email" 
              type="email" 
              placeholder="exemple@mail.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="role">Je suis un</Label>
            </div>
            <Select 
              id="role" 
              required 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Élève</option>
              <option value="coach">Coach</option>
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Mot de passe</Label>
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

          <Button type="submit">
            S'inscrire
          </Button>
        </form>
        
        <div className="text-sm text-center text-gray-500">
          Déjà un compte ? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </div>
      </Card>
    </div>
  );
}