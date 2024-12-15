import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterCredentials } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from '../hooks/useForm';
import { validatePassword, validateEmail, validateUsername } from '../utils/validation';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { values, handleChange, handleSubmit } = useForm<RegisterCredentials>({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    onSubmit: async (credentials) => {
      // Validate form
      const newErrors: Record<string, string[]> = {};
      
      if (!validateEmail(credentials.email)) {
        newErrors.email = ['Please enter a valid email address'];
      }
      
      const usernameErrors = validateUsername(credentials.username);
      if (usernameErrors.length > 0) {
        newErrors.username = usernameErrors;
      }
      
      const passwordErrors = validatePassword(credentials.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors;
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        const user = await authService.register(credentials);
        setUser(user);
        toast.success('Registration successful!');
        navigate('/');
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Registration failed');
      }
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              label="Email"
              required
              value={values.email}
              onChange={handleChange}
              error={errors.email?.[0]}
            />
            <Input
              name="username"
              type="text"
              label="Username"
              required
              value={values.username}
              onChange={handleChange}
              error={errors.username?.[0]}
            />
            <Input
              name="password"
              type="password"
              label="Password"
              required
              value={values.password}
              onChange={handleChange}
              error={errors.password?.[0]}
            />
            {errors.password?.length > 0 && (
              <ul className="text-sm text-red-600 list-disc list-inside">
                {errors.password.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;