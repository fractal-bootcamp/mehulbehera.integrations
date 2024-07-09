import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import MailModal from "./MailModal";
import ListModal from "./ListModal";

function NavBar() {

    return (
        <>
            <div className="navbar shadow-lg bg-base-100">
                <div className="navbar-start">
                    <a className="mx-3 text-2xl">MailList</a>
                </div>

                <div className="navbar-end">

                    <SignedIn>
                        <button onClick={() => {
                            const mailModal = document.getElementById("listModal") as HTMLDialogElement | null;
                            if (mailModal) {
                                mailModal.showModal();
                            }
                        }}>

                            <img src="/List.png" alt="createMail" className="mr-2 w-12 h-12" />
                        </button>

                        <button onClick={() => {
                            const mailModal = document.getElementById("mailModal") as HTMLDialogElement | null;
                            if (mailModal) {
                                mailModal.showModal();
                            }
                        }}>

                            <img src="/createMailIconWhite.png" alt="createMail" className="mr-3 mt-2 w-12 h-12" />
                        </button>
                    </SignedIn>

                    <header className="mr-2">
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </header>
                </div>
            </div>

            <ListModal />
            <MailModal />


        </>
    )
}



export default NavBar