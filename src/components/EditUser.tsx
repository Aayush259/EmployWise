import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Button, Input } from "./Reusables";
import { IoArrowBack } from "react-icons/io5";
import { useRef, useState } from "react";
import { updateUser } from "../utils/apis";

export default function EditUser() {

    const navigate = useNavigate();
    const { currentUser, updateUserList } = useUser();

    const [editing, setEditing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || editing) return;

        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;
        const email = emailRef.current?.value;

        if (!firstName || !lastName || !email) {
            setError("Please fill all fields");
            return;
        }

        if (firstName === currentUser.first_name && lastName === currentUser.last_name && email === currentUser.email) {
            setError("No changes made");
            return;
        }

        setEditing(true);
        setError(null);

        const { data, error: updateError } = await updateUser(currentUser.id, {
            first_name: firstName,
            last_name: lastName,
            email: email
        });

        console.log(data);

        if (updateError) {
            setError(typeof updateError === "string" ? updateError : "Failed to update user");
            setEditing(false);
            return;
        };

        updateUserList({
            id: currentUser.id,
            avatar: currentUser.avatar,
            first_name: firstName,
            last_name: lastName,
            email: email
        });

        navigate("/user-list");
    };

    if (!currentUser) {
        return <Navigate to="/user-list" />;
    };

    return (
        <div className="container min-h-screen w-screen flex items-center justify-center relative">
            <Button className="absolute top-8 left-8" onClick={() => navigate(-1)}>
                <IoArrowBack size={30} />
            </Button>

            <form className="w-[550px] max-w-[95vw] bg-[#131212] p-4 rounded-2xl" onSubmit={handleSubmit}>
                <div className="flex items-end justify-between flex-wrap">
                    <h2 className="text-xl md:text-2xl">{"Edit User"}</h2>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>

                <Input
                    id="first_name"
                    label="First Name"
                    type="text"
                    reference={firstNameRef as React.RefObject<HTMLInputElement>}
                    defaultValue={currentUser.first_name}
                />

                <Input
                    id="last_name"
                    label="Last Name"
                    type="text"
                    reference={lastNameRef as React.RefObject<HTMLInputElement>}
                    defaultValue={currentUser.last_name}
                />

                <Input
                    id="email"
                    label="Email"
                    type="email"
                    reference={emailRef as React.RefObject<HTMLInputElement>}
                    defaultValue={currentUser.email}
                />

                <Button className="w-full mt-6" type="submit" disabled={editing}>
                    {editing ? "Editing..." : "Update"}
                </Button>
            </form>
        </div>
    );
};
