import { useState, useEffect, useRef } from "react";

function Welcome({ passData }) {
    const [user, setUser] = useState("User");
    const [change, setChange] = useState(true);
    let inpFocus = useRef("");

    // Use Effects
    useEffect(() => {
        if (!change) inpFocus.current.focus();
    }, [change]);

    useEffect(() => {
        const date = new Date();
        !localStorage.getItem("loginTime") &&
            localStorage.setItem(
                "loginTime",
                `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            );
    }, []);

    // Functions
    const handleSubmit = (e) => {
        e.preventDefault();
        setChange(true);
        passData(user);
    };

    const handleDate = () => {
        const date = new Date();
        return (
            localStorage.getItem("loginTime") ===
            `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        );
    };

    const handleChange = (e) => {
        if (e.key === "Enter") setUser(e.target.value);
    };

    // Render
    return (
        <section className="flex h-[40%] flex-col justify-center gap-8">
            <h1 className="text-center text-2xl font-bold">
                {handleDate() ? "Welcome" : "Welcome Back"}
                {user ? ` ${user}!` : " User!"}
            </h1>
            <div className="flex items-center justify-center">
                {change ? (
                    <button
                        type="button"
                        onClick={() => setChange(false)}
                        className="pointer bg-tertiary text-secondary hover: hover:border-secondary cursor-pointer rounded-lg border-2 border-transparent px-4 py-2 font-bold"
                    >
                        Change Username
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Enter Username"
                            onKeyDown={handleChange}
                            ref={inpFocus}
                            className="rounded-lg border-2 p-2"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setChange(true);
                            }}
                            className="bg-tertiary text-secondary hover:border-secondary cursor-pointer rounded-lg border-2 border-transparent p-2 font-bold"
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}

export default Welcome;
