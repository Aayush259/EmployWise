import { useRef, useState } from "react";
import login from "../utils/apis";
import { setToken } from "../utils/funcs";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loggingIn) return;
        setLoggingIn(true);
        setError(null);

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) {
            setError("Please enter email and password");
            setLoggingIn(false);
            return;
        }

        const { data, error } = await login({ email, password });

        if (error) {
            setError(typeof (error) === "string" ? error : "An error occurred");
        } else {
            console.log(data);
            if (data?.error || !data?.token) {
                setError(data?.error || "An error occurred");
            } else {
                setToken(data?.token);
                navigate("/");
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
                    <div className="mt-4">
                        <label htmlFor="email" className="block font-medium">Email</label>
                        <input ref={emailRef} type="email" id="email" name="email" className="mt-1 p-2 w-full rounded-md bg-gray-800" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block font-medium">Password</label>
                        <input ref={passwordRef} type="password" id="password" name="password" className="mt-1 p-2 w-full rounded-md bg-gray-800" />
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="w-full p-2 disabled:opacity-70 disabled:cursor-default cursor-pointer bg-blue-500 rounded-md" disabled={loggingIn}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
