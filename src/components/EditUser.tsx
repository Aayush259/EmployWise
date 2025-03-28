import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Button, Input, Loader } from "./Reusables";
import { IoArrowBack } from "react-icons/io5";
import { useRef, useState } from "react";
import { updateUser } from "../utils/apis";
import { useToast } from "../context/ToastContext";

export default function EditUser() {

    const navigate = useNavigate();
    const { addToast } = useToast();
    const { currentUser, updateUserList } = useUser();

    const [editing, setEditing] = useState<boolean>(false);

    // Refs for the input fields (firstName, lastName, email)
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || editing) return;
        
        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;
        const email = emailRef.current?.value;
        
        // Check if any of the input fields are empty
        if (!firstName || !lastName || !email) {
            addToast("Please fill all fields", false);
            return;
        }

        // Check if the input fields are the same as the current user's details
        if (firstName === currentUser.first_name && lastName === currentUser.last_name && email === currentUser.email) {
            addToast("No changes made", false);
            return;
        }
        setEditing(true);

        // Update the user's details
        const { error: updateError } = await updateUser(currentUser.id, {
            first_name: firstName,
            last_name: lastName,
            email: email
        });

        // Check if the update was successful
        if (updateError) {
            addToast(typeof updateError === "string" ? updateError : "Failed to update user", false);
            setEditing(false);
            return;
        };

        // Update the user list
        updateUserList({
            id: currentUser.id,
            avatar: currentUser.avatar,
            first_name: firstName,
            last_name: lastName,
            email: email
        });

        // Show a success message and navigate to the user list page
        addToast("Updated Successfully!", true);
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
                    {editing ? <Loader /> : "Update"}
                </Button>
            </form>
        </div>
    );
};
