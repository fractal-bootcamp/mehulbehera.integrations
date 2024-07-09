import { useEffect, useState } from "react";

const serverPath = "http://localhost:3000";

//send email
async function sendEmail(fromEmail: string, toEmail: string, subject: string, message: string) {
    const response = await fetch(`${serverPath}/sendEmail`, {
        method: "POST",
        body: JSON.stringify({ fromEmail, toEmail, subject, message }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}

//get all the lists
async function getLists() {
    const response = await fetch(`${serverPath}/getAllLists`);
    const json = await response.json();
    return json;
}



function MailModal() {

    const [fromEmail, setFromEmail] = useState("");
    const [toEmail, setToEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [mailList, setMailList] = useState([]);


    useEffect(() => {
        getLists().then((data) => {
            setMailList(data);
        });
    }, []);

    return (
        <dialog id="mailModal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl  mx-auto my-auto">
                <h3 className="font-bold text-lg">Create Email</h3>
                <form>
                    <div className="flex flex-row mt-4">
                        <label className="mr-4 mt-1 w-20">From:</label>
                        <input type="text" placeholder="example@email.com" className="input input-bordered input-sm w-full" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
                    </div>

                    <div className="flex flex-row mt-4">
                        <label className="mr-4 mt-1 w-20">To:</label>
                        <select className="select select-bordered select-sm w-full" value={toEmail} onChange={(e) => setToEmail(e.target.value)}>
                            {mailList.map((list: { id: string, name: string }) => (
                                <option key={list.id} value={list.id}>{list.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-row mt-4">
                        <label className="mr-4 mt-1 w-20">Subject:</label>
                        <input type="text" placeholder="Email Subject" className="input input-bordered input-sm w-full" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>
                    <div className="flex flex-row mt-4">
                        <label className="mr-4 mt-1 w-20">Email Message:</label>
                        <textarea className="textarea textarea-bordered textarea-md h-52 w-full" placeholder="Email Message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    </div>
                </form>
                <div className="modal-action">
                    <button className="btn" onClick={() => {
                        const mailModal = document.getElementById("mailModal") as HTMLDialogElement | null;



                        sendEmail(fromEmail, toEmail, subject, message);
                        setFromEmail("");
                        setToEmail("");
                        setSubject("");
                        setMessage("");
                        if (mailModal) {
                            mailModal.close();
                        }

                    }}>Send</button>
                </div>

            </div>
            <form id="mailModalForm" method="dialog" className="modal-backdrop">
                <button onClick={() => {
                    setFromEmail("");
                    setToEmail("");
                    setSubject("");
                    setMessage("");

                }}>close</button>
            </form>
        </dialog >
    )
}

export default MailModal;