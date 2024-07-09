import { useEffect, useState } from "react"
import CreateListModal from "./CreateListModal";
import EditUserModal from "./EditUsersModal";

const serverPath = "http://localhost:3000";

//get all the lists
async function getLists() {
    const response = await fetch(`${serverPath}/getAllLists`);
    const json = await response.json();
    return json;
}

//delete list
async function deleteList(listId: string) {
    const response = await fetch(`${serverPath}/deleteList`, {
        method: "POST",
        body: JSON.stringify({ listId }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}


async function deleteUserFromList(listId: string, userId: string) {
    console.log("delete user from list, ", listId, userId);
    const response = await fetch(`${serverPath}/deleteUserFromList`, {
        method: "POST",
        body: JSON.stringify({ listId, userId }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}

function ListModal() {

    const [lists, setLists] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [poller, setPoller] = useState(0);

    const refreshLists = () => {
        getLists().then((data) => {
            setLists(data);
            console.log(data);
        });
    };

    useEffect(() => {
        refreshLists();
    }, []);

    useEffect(() => {
        refreshLists();
    }, [poller]);

    let editListId = "";
    const settings = editMode ? "btn btn-sm bg-gray-200 hover:bg-red-400" : "";
    const editButtonSettings = editMode ? "btn btn-sm bg-green-400" : "btn btn-sm bg-blue-400";

    return (
        <>

            <dialog id="listModal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl  mx-auto my-auto">
                    <h3 className="font-bold text-lg mb-4">Mail List</h3>
                    <img src='plus.png' onClick={() => {
                        const createListModal = document.getElementById("createlistModal") as HTMLDialogElement;
                        if (createListModal) {
                            createListModal.showModal();
                        }


                    }} className="w-10 h-10 absolute top-1 right-1" />


                    {lists.map((list: { id: string, name: string, users: { userId: string, userName: string, userEmail: string }[] }) => (
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="radio" name="my-accordion-2" />
                            <div className="collapse-title text-xl font-medium">{list.name}</div>
                            <div className="collapse-content">
                                {list.users.map((user: { userId: string, userName: string, userEmail: string }) => (
                                    <div key={user.userId} className={`flex flex-row w-80 justify-between ${settings}`} onClick={() => {
                                        if (editMode) {
                                            console.log("remove user from list, ", user.userName);
                                            deleteUserFromList(list.id, user.userId);
                                            setPoller(poller + 1);
                                        }

                                    }}>
                                        <p>{user.userName}</p>
                                        <p>{user.userEmail}</p>
                                        {editMode ? <img src="trashcan.png" className="w-5 mt-1 h-5" /> : null}
                                    </div>
                                ))}
                                <button className="btn btn-sm bg-red-400 absolute right-2 bottom-2" onClick={() => {
                                    deleteList(list.id);
                                    setPoller(poller + 1);
                                }}>Delete</button>
                                <button className={`btn btn-sm ${editButtonSettings} absolute right-20 bottom-2`} onClick={() => {
                                    setEditMode(!editMode);
                                }}>{editMode ? "Done" : "Edit Users"}</button>
                                {editMode ? <button className="btn btn-sm bg-green-400 absolute right-36 bottom-2" onClick={() => {
                                    console.log("add user to list");
                                }}>Add User</button> : null}
                            </div>
                        </div>
                    ))}
                </div>
                <form id="listModalForm" method="dialog" className="modal-backdrop">
                    <button onClick={() => {

                    }}>close</button>
                </form>
            </dialog >

            <CreateListModal />
            <EditUserModal listId={editListId} />


        </>
    )
}

export default ListModal;