function Header(props) {
    return (
        <>
            <header className="bg-secondary flex h-[15vh] w-full items-center justify-between rounded-b-full px-20 text-center sm:px-10">
                <h1 className="text-tertiary w-full text-3xl font-bold sm:w-2/4">
                    Counter App
                </h1>
                <div className="hidden h-full items-center justify-center gap-4 sm:flex sm:w-2/5">
                    <span
                        className="text-tertiary hover:border-tertiary h-10 w-10 content-center rounded-full border-2 border-transparent bg-black text-center text-2xl font-semibold transition-all duration-300 sm:h-12 sm:w-12"
                        title={props.user}
                    >
                        {props.user.charAt(0).toUpperCase()}
                    </span>
                </div>
            </header>
        </>
    );
}

export default Header;
