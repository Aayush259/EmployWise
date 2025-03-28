import { useRef, useState } from "react";
import login from "../utils/apis";
import { setToken } from "../utils/funcs";
import { Button, Input, Loader } from "./Reusables";

export default function Login() {

    // State to track if the user is logging in
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for the input fields (email, password)
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loggingIn) return;
        setLoggingIn(true);
        setError(null);

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        // Check if any of the input fields are empty
        if (!email || !password) {
            setError("Please enter email and password");
            setLoggingIn(false);
            return;
        }

        const { data, error } = await login({ email, password });

        if (error) {
            setError(typeof (error) === "string" ? error : "An error occurred");
        } else {
            // Check if the response contains an error or if the token is missing
            if (data?.error || !data?.token) {
                setError(data?.error || "An error occurred");
            } else {
                setToken(data?.token);
                window.location.href = "/";
            }
        }
        setLoggingIn(false);
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="w-[550px] max-w-[95vw] bg-[#131212] p-4 rounded-2xl">
                <div className="flex items-end justify-between flex-wrap">
                    <h2 className="text-xl md:text-2xl">Login</h2>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>

                <form className="mt-6" onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        name="email"
                        reference={emailRef as React.RefObject<HTMLInputElement>}
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        name="password"
                        reference={passwordRef as React.RefObject<HTMLInputElement>}
                    />

                    <div className="mt-6">
                        <Button type="submit" className="w-full" disabled={loggingIn}>
                            {
                                loggingIn ? <Loader /> : "Login"
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
};
