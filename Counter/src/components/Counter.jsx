import { useState } from "react";

function Counter() {
    const [value, setValue] = useState(0);
    const [message, setMessage] = useState(false);

    const handleDecrement = () => {
        value === 0 ? setMessage(true) : setMessage(false);
        setTimeout(() => {
            setMessage(false);
        }, 1500);
        value === 0 ? setValue(0) : setValue(value - 1);
    };

    const handleIncrement = () => {
        setMessage(false);
        setValue(value + 1);
    };

    return (
        <>
            <section className="flex h-[60%] w-full flex-col items-center justify-center gap-8">
                <h1 className="text-[5rem] font-bold">{value}</h1>

                <div className="flex w-3/4 items-center justify-around rounded-3xl border-2 border-black p-4 md:w-3/6 lg:w-2/5">
                    <button
                        className="button"
                        type="button"
                        onClick={handleDecrement}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="size-6 stroke-3"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14"
                            />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => setValue(0)}
                        className="bg-tertiary text-secondary hover:border-secondary cursor-pointer rounded-lg border-2 border-transparent px-4 py-2 font-bold sm:px-8"
                    >
                        Reset
                    </button>

                    <button
                        className="button"
                        type="button"
                        onClick={handleIncrement}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="size-6 stroke-3"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </button>
                </div>
                <h2
                    className={`${message === true ? "view" : ""} font-semibold`}
                >
                    Minimum Limit Reached!
                </h2>
            </section>
        </>
    );
}

export default Counter;
