import { createContext, useContext, useEffect, useState } from "react";
import { ICachedPage, IUser, IUserResponse } from "../utils/interfaces";
import { getUsers, deleteUser } from "../utils/apis";
import { useToast } from "./ToastContext";

const UserContext = createContext<{
    userList: IUser[];
    currentUser: IUser | null;
    currentUserId: number | null;
    fetchingUserList: boolean;
    currentPage: number;
    totalPages: number;
    setCurrentUserId: React.Dispatch<React.SetStateAction<number | null>>;
    nextPage: () => void;
    prevPage: () => void;
    updateUserList: (updatedUser: IUser) => void;
    deleteUser: (userId: number) => Promise<void>;
}>({
    userList: [],
    currentUser: null,
    currentUserId: null,
    fetchingUserList: false,
    currentPage: 1,
    totalPages: 1,
    setCurrentUserId: () => { },
    nextPage: () => { },
    prevPage: () => { },
    updateUserList: () => { },
    deleteUser: async () => { },
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

    const { addToast } = useToast();

    const [userList, setUserList] = useState<IUser[]>([]);    // State to store the list of users
    const [cachedPages, setCachedPages] = useState<ICachedPage[]>([]);    // State to store the cached pages
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);    // State to store the current user's ID
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);    // State to store the current user
    const [fetchingUserList, setFetchingUserList] = useState<boolean>(false);    // State to track if the user list is being fetched
    const [currentPage, setCurrentPage] = useState<number>(1);    // State to store the current page number
    const [totalPages, setTotalPages] = useState<number>(1);    // State to store the total number of pages

    // Functions to navigate between pages
    const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));

    // Function to update the user list
    const updateUserList = (updatedUser: IUser) => {
        setUserList(prevList => prevList.map(user => user.id === updatedUser.id ? updatedUser : user));
        setCachedPages(prevPagesList => prevPagesList.map(cachedPage => ({
            ...cachedPage,
            users: cachedPage.users.map(user => user.id === updatedUser.id ? updatedUser : user)
        })));

        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };

    // Function to delete a user
    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId);
        } catch (error) {
            addToast("Failed to Delete User", false);
        }

        // Remove user from current list
        setUserList(prevList => prevList.filter(user => user.id !== userId));

        // Remove user from cached pages
        setCachedPages(prevCache =>
            prevCache.map(cachedPage => ({
                ...cachedPage,
                users: cachedPage.users.filter(user => user.id !== userId)
            }))
        );

        addToast("Deleted Successfully!", true);
    };

    // Function to fetch users
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
            addToast(typeof error === "string" ? error : "Failed to fetch users", false);
        } else {
            const userData = data as IUserResponse;
            setUserList(userData.data);
            setTotalPages(userData.total_pages);
            setCachedPages(prev => [...prev, {
                page: userData.page,
                users: userData.data
            }]);
        }
        setFetchingUserList(false);
    };

    // Effect to set the current user when the currentUserId changes
    useEffect(() => {
        setCurrentUser(userList.find(user => user.id === currentUserId) || null);
    }, [currentUserId]);

    // Effect to fetch users when the current page changes
    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    return (
        <UserContext.Provider value={{
            userList,
            currentUser,
            currentUserId,
            fetchingUserList,
            currentPage,
            totalPages,
            setCurrentUserId,
            nextPage,
            prevPage,
            updateUserList,
            deleteUser: handleDeleteUser,
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

