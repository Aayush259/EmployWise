import { createContext, useContext, useEffect, useState } from "react";
import { IUser, IUserResponse } from "../utils/interfaces";
import { getUsers } from "../utils/apis";

const UserContext = createContext<{
    userList: IUser[];
    currentUser: number | null;
    fetchingUserList: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    setCurrentUser: React.Dispatch<React.SetStateAction<number | null>>;
    nextPage: () => void;
    prevPage: () => void;
}>({
    userList: [],
    currentUser: null,
    fetchingUserList: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    setCurrentUser: () => { },
    nextPage: () => { },
    prevPage: () => { },
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [userList, setUserList] = useState<IUser[]>([]);
    const [currentUser, setCurrentUser] = useState<number | null>(null);
    const [fetchingUserList, setFetchingUserList] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));

    const fetchUsers = async () => {
        if (fetchingUserList) return;
        setFetchingUserList(true);
        const { data, error } = await getUsers(currentPage);

        if (error) {
            setError(typeof error === "string" ? error : "Failed to fetch users");
        } else {
            const userData = data as IUserResponse;
            setUserList(userData.data);
            setTotalPages(userData.total_pages);
            setError(null);
        }
        setFetchingUserList(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    return (
        <UserContext.Provider value={{
            userList,
            currentUser,
            fetchingUserList,
            error,
            currentPage,
            totalPages,
            setCurrentUser,
            nextPage,
            prevPage,
        }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};

export { UserContextProvider, useUser };

