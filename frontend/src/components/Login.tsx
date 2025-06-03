import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./shared/Header";
import styles from "../styles/shared.module.css";
import { getUserByEmail } from "../api/userApi";
import { Toast, ToastType } from "./shared/Toast";
import { useAuth } from "../context/AuthContext";

interface LoginForm {
  email: string;
}

interface ValidationErrors {
  email?: string;
  submit?: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: ""
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await getUserByEmail(formData.email);

        if (!response.success || !response.data) {
          setErrors({ ...errors, submit: "Login failed. Please check your email and try again." });
          setToast({ message: "Login failed. Please check your email and try again.", type: "error" });
          return;
        }

        // Handle successful login
        login(response.data);
        setToast({ message: "Login successful! Redirecting to home page...", type: "success" });

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        setErrors({ ...errors, submit: "Login failed. Please try again." });
        setToast({ message: "Login failed. Please try again.", type: "error" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className={styles.container}>
      <Header showSubmitLink isVertical />

      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email"
          className={errors.email ? styles.inputError : ""}
        />
        {errors.email && <div className={styles.error}>{errors.email}</div>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        {errors.submit && <div className={styles.error}>{errors.submit}</div>}
      </form>

      <div className={styles.loginPrompt}>
        Don't have an account? <Link to="/join">Register</Link>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
