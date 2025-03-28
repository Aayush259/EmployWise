import { useState } from "react";
import { useUser } from "../context/UserContext";
import { GoPencil } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { Button, Loader, Input } from "./Reusables";
import { useNavigate } from "react-router-dom";

export default function UserList() {

    const navigate = useNavigate();
    const { userList, fetchingUserList, currentPage, totalPages, setCurrentUserId, nextPage, prevPage, deleteUser } = useUser();

    const [searchTerm, setSearchTerm] = useState("");    // State to track the search term
    const [deletingId, setDeletingId] = useState<number | null>(null);    // State to track the user being deleted

    // Filter the user list based on the search term
    const filteredUsers = userList.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.first_name.toLowerCase().includes(searchLower) ||
            user.last_name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    });

    // Function to handle the edit button click
    const handleDelete = async (userId: number) => {
        setDeletingId(userId);
        await deleteUser(userId);
        setDeletingId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl md:text-3xl text-center font-bold mb-6">{"User List"}</h1>

            <div className="max-w-md mx-auto mb-8">
                <Input
                    id="search"
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>

            {
                (fetchingUserList && userList.length === 0) ? <Loader className="scale-150" /> : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-4 md:px-8 lg:px-16">
                            {
                                filteredUsers.length === 0 ? (
                                    <div className="col-span-full text-center text-gray-400">
                                        No users found matching your search.
                                    </div>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`bg-gray-800 rounded-lg p-4 flex flex-col items-center group relative shadow-in duration-300 ${deletingId === user.id ? 'opacity-50 pointer-events-none' : ''
                                                }`}
                                        >
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 duration-200 flex items-center gap-2">
                                                <button
                                                    className={`cursor-pointer hover:text-red-500 disabled:cursor-not-allowed disabled:hover:text-inherit ${deletingId === user.id ? 'animate-spin' : ''
                                                        }`}
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deletingId !== null}
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer hover:opacity-60 disabled:cursor-not-allowed disabled:hover:opacity-100"
                                                    onClick={() => {
                                                        navigate("/edit");
                                                        setCurrentUserId(user.id);
                                                    }}
                                                    disabled={deletingId !== null}
                                                >
                                                    <GoPencil size={20} />
                                                </button>
                                            </div>

                                            <img
                                                src={user.avatar}
                                                alt={`${user.first_name} ${user.last_name}`}
                                                height={128}
                                                width={128}
                                                className="h-[128px] w-[128px] object-cover object-top rounded-full"
                                            />
                                            <h3 className="text-xl md:text-3xl font-semibold mt-6 mb-2">
                                                {user.first_name} {user.last_name}
                                            </h3>
                                            <p className="text-gray-400">{user.email}</p>
                                        </div>
                                    ))
                                )
                            }
                        </div>

                        {!searchTerm && (
                            <div className="mt-6 flex justify-center space-x-4">
                                <Button onClick={prevPage} disabled={currentPage === 1 || fetchingUserList}>
                                    {"Previous"}
                                </Button>
                                <span className="px-4 py-2">
                                    {"Page " + currentPage + " of " + totalPages}
                                </span>
                                <Button onClick={nextPage} disabled={currentPage === totalPages || fetchingUserList}>
                                    {"Next"}
                                </Button>
                            </div>
                        )}
                    </>
                )
            }
        </div>
    );
}
