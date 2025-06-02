import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./shared/Header";
import styles from "../styles/shared.module.css";
import { createUser } from "../api/userApi";
import { Toast, ToastType } from "./shared/Toast";
import { useAuth } from "../context/AuthContext";

interface RegistrationForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface ValidationErrors {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  submit?: string;
}

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegistrationForm>({
    email: "",
    username: "",
    firstName: "",
    lastName: ""
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

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await createUser(formData);

        if (!response.success) {
          if (response.error === "EmailAlreadyInUse") {
            setErrors({ ...errors, email: "Email is already in use" });
            setToast({ message: "Email is already in use", type: "error" });
          } else if (response.error === "UsernameAlreadyTaken") {
            setErrors({ ...errors, username: "Username is already taken" });
            setToast({ message: "Username is already taken", type: "error" });
          } else {
            setErrors({ ...errors, submit: "Registration failed. Please try again." });
            setToast({ message: "Registration failed. Please try again.", type: "error" });
          }
          return;
        }

        // Handle successful registration
        if (response.data) {
          login(response.data);
        }
        setToast({ message: "Registration successful! Redirecting to home page...", type: "success" });

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        setErrors({ ...errors, submit: "Registration failed. Please try again." });
        setToast({ message: "Registration failed. Please try again.", type: "error" });
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

      <h2>Create Account</h2>
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

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="username"
          className={errors.username ? styles.inputError : ""}
        />
        {errors.username && <div className={styles.error}>{errors.username}</div>}

        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="first name"
          className={errors.firstName ? styles.inputError : ""}
        />
        {errors.firstName && <div className={styles.error}>{errors.firstName}</div>}

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="last name"
          className={errors.lastName ? styles.inputError : ""}
        />
        {errors.lastName && <div className={styles.error}>{errors.lastName}</div>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {errors.submit && <div className={styles.error}>{errors.submit}</div>}
      </form>

      <div className={styles.loginPrompt}>
        Already have an account? <Link to="/login">Login</Link>
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
