import styles from "../Me/Me.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../../../services/AuthService.tsx";
import type { Profile } from "../Me/Profile.tsx";

interface ProfileForm {
    userName: string;
    email: string;
    phoneNumber: string | null;
}

export function MeEdit() {
    const navigate = useNavigate();
    const [form, setForm] = useState<ProfileForm>({
        userName: "",
        email: "",
        phoneNumber: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [originalEmail, setOriginalEmail] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            const token = authService.getAccessToken();
            if (!token) {
                setErrors({ load: "Authentication required. Please log in again." });
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/Users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error("Failed to load profile");
                }

                const data = await response.json();

                setOriginalEmail(data.email);
                setForm({
                    userName: data.userName || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || ""
                });
            } catch (err: any) {
                setErrors({ load: err.message || "Failed to load profile" });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const validate = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};

        if (!form.userName.trim()) {
            newErrors.userName = "Username is required";
        } else if (form.userName.trim().length < 3) {
            newErrors.userName = "Username must be at least 3 characters";
        } else if (form.userName.trim().length > 20) {
            newErrors.userName = "Username cannot exceed 20 characters";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const clientErrors = validate();
        setErrors(clientErrors);

        if (Object.keys(clientErrors).length > 0) return;

        setSubmitting(true);
        setErrors({}); // Clear previous errors

        const token = authService.getAccessToken();
        if (!token) {
            setErrors({ submit: "Authentication lost. Please log in again." });
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`/api/Users/${originalEmail}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userName: form.userName.trim(),
                    email: form.email.trim(),
                    phoneNumber: form.phoneNumber?.trim() || null,
                    password: 'qwertyuiop' // for now not updating password
                })
            });

            if (!response.ok) {
                // Try to parse JSON error response
                let errorData: any = {};
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    errorData = await response.json();
                } else {
                    // Fallback if not JSON
                    throw new Error("Failed to update profile");
                }

                // Common ASP.NET Core validation problem details format
                if (response.status === 400 && errorData.errors) {
                    // Format: { errors: { UserName: ["Already taken"], Email: ["Invalid"] } }
                    const fieldErrors: Record<string, string> = {};

                    Object.keys(errorData.errors).forEach(key => {
                        const messages = errorData.errors[key];
                        // Take first message, or join if multiple
                        fieldErrors[key.toLowerCase()] = Array.isArray(messages) ? messages[0] : messages;
                    });

                    // Map common backend field names to your form fields
                    const mappedErrors: Record<string, string> = {};
                    if (fieldErrors["username"] || fieldErrors["userName"]) {
                        mappedErrors.userName = fieldErrors["username"] || fieldErrors["userName"];
                    }
                    if (fieldErrors["email"]) {
                        mappedErrors.email = fieldErrors["email"];
                    }
                    if (fieldErrors["phonenumber"] || fieldErrors["phoneNumber"]) {
                        mappedErrors.phoneNumber = fieldErrors["phonenumber"] || fieldErrors["phoneNumber"];
                    }

                    // Add any unmapped or general errors as submit error
                    if (errorData.title || errorData.message) {
                        mappedErrors.submit = errorData.title || errorData.message;
                    }

                    setErrors(mappedErrors);
                    return;
                }
                
                if (errorData.message) {
                    setErrors({ submit: errorData.message });
                    return;
                }
                
                throw new Error("Failed to update profile");
            }
            
            navigate('/me');
        } catch (err: any) {
            setErrors({ submit: err.message || "An unexpected error occurred" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.loading}>Loading profile for editing...</div>
                </main>
            </div>
        );
    }

    if (errors.load) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.error}>{errors.load}</div>
                    <button onClick={() => navigate('/me')} className={styles.editButton}>
                        Back to Profile
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.profileContainer}>
                    <h2 className={styles.title}>Edit Profile</h2>

                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        ← Back
                    </button>

                    <div className={styles.profileCard}>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Username:</span>
                            <input
                                type="text"
                                className={styles.detailValue || styles.input} // fallback if detailValue not styled as input
                                value={form.userName}
                                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                                placeholder="Enter username"
                                disabled={submitting}
                            />
                            {errors.userName && <div className={styles.error}>{errors.userName}</div>}
                        </div>

                        <div className={styles.detailRow}>
                            <span className={styles.label}>Email:</span>
                            <input
                                type="email"
                                className={styles.detailValue || styles.input}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="Enter email"
                                disabled={submitting}
                            />
                            {errors.email && <div className={styles.error}>{errors.email}</div>}
                        </div>

                        <div className={styles.detailRow}>
                            <span className={styles.label}>Phone:</span>
                            <input
                                type="tel"
                                className={styles.detailValue || styles.input}
                                value={form.phoneNumber || ""}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                placeholder="Enter phone number (optional)"
                                disabled={submitting}
                            />
                            {errors.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div>}
                        </div>

                        {errors.submit && <div className={styles.error}>{errors.submit}</div>}

                        <div className={styles.actions}>
                            <button
                                className={styles.editButton}
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}