import { useUser } from "../context/UserContext";
import { GoPencil } from "react-icons/go";
import { Button, Loader } from "./Reusables";
import { useNavigate } from "react-router-dom";

export default function UserList() {

    const navigate = useNavigate();
    const { userList, fetchingUserList, currentPage, totalPages, error, setCurrentUserId, nextPage, prevPage } = useUser();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl md:text-3xl text-center font-bold mb-6">{"User List"}</h1>

            {
                error && (
                    <div className="text-red-500 mb-4 text-sm">{error}</div>
                )
            }

            {
                (fetchingUserList && userList.length === 0) ? <Loader /> : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-4 md:px-8 lg:px-16">
                            {
                                userList.map((user) => (
                                    <div key={user.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center group relative shadow-in duration-300">
                                        <button
                                            className="opacity-0 group-hover:opacity-100 duration-200 absolute top-4 right-4 cursor-pointer hover:opacity-60"
                                            onClick={() => {
                                                navigate("/edit");
                                                setCurrentUserId(user.id)
                                            }}
                                        >
                                            <GoPencil size={20} />
                                        </button>
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
                            }
                        </div>

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
                    </>
                )
            }
        </div>
    );
}
