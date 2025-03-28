import { createContext, useContext, useEffect, useState } from "react";
import { ICachedPage, IUser, IUserResponse } from "../utils/interfaces";
import { getUsers } from "../utils/apis";

const UserContext = createContext<{
    userList: IUser[];
    currentUser: IUser | null;
    currentUserId: number | null;
    fetchingUserList: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    setCurrentUserId: React.Dispatch<React.SetStateAction<number | null>>;
    nextPage: () => void;
    prevPage: () => void;
    updateUserList: (updatedUser: IUser) => void;
}>({
    userList: [],
    currentUser: null,
    currentUserId: null,
    fetchingUserList: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    setCurrentUserId: () => { },
    nextPage: () => { },
    prevPage: () => { },
    updateUserList: () => { },
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [userList, setUserList] = useState<IUser[]>([]);
    const [cachedPages, setCachedPages] = useState<ICachedPage[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [fetchingUserList, setFetchingUserList] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));

    const updateUserList = (updatedUser: IUser) => {
        setUserList(prevList => prevList.map(user => user.id === updatedUser.id ? updatedUser : user));
        setCachedPages(prevPagesList => prevPagesList.map(cachedPage => ({
            ...cachedPage,
            users: cachedPage.users.map(user => user.id === updatedUser.id ? updatedUser : user)
        })))
    };

    const fetchUsers = async () => {
        if (fetchingUserList) return;

        const cachedPage = cachedPages.find(p => p.page === currentPage);

        if (cachedPage) {
            setUserList(cachedPage.users);
            return;
        }

        setFetchingUserList(true);
        const { data, error } = await getUsers(currentPage);

        if (error) {
            setError(typeof error === "string" ? error : "Failed to fetch users");
        } else {
            const userData = data as IUserResponse;
            setUserList(userData.data);
            setTotalPages(userData.total_pages);
            setCachedPages(prev => [...prev, {
                page: userData.page,
                users: userData.data
            }]);
            setError(null);
        }
        setFetchingUserList(false);
    };

    useEffect(() => {
        setCurrentUser(userList.find(user => user.id === currentUserId) || null);
    }, [currentUserId]);

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    return (
        <UserContext.Provider value={{
            userList,
            currentUser,
            currentUserId,
            fetchingUserList,
            error,
            currentPage,
            totalPages,
            setCurrentUserId,
            nextPage,
            prevPage,
            updateUserList,
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

