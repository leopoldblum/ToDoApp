import "./TodoEditOrAddButton.css"
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon.js"
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon.js"
import { useState, useEffect, useRef, useContext } from "react"
import { todoListProvider } from "./TodoList-Wrapper";

/** 
    @param currentTodo === null -> add button
    @param currentTodo !== null -> edit button
**/
const TodoEditOrAddButton = ({ currentTodo }) => {

    const todoFuncAndData = useContext(todoListProvider);


    const isEdit = currentTodo === null ? false : true;

    const [formContent, setFormContent] = useState({
        formTitle: "",
        formDesc: ""
    })

    const [isModalOpen, setIsModalOpen] = useState(false);
    const dialogRef = useRef(null);

    // toggling modal
    useEffect(() => {
        if (isModalOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isModalOpen]);

    // update formcontent when props change
    useEffect(() => {
        if (isEdit) {
            setFormContent({
                formTitle: currentTodo.title,
                formDesc: currentTodo.desc
            });
        }
        else {
            setFormContent({
                formTitle: "",
                formDesc: ""
            })
        }
    }, [currentTodo, isEdit]);


    // update formcontent on user-input
    function handleTitleChange(e) {
        const newTitle = e.target.value;
        setFormContent(prev => ({
            ...prev,
            formTitle: newTitle
        }))
    }

    function handleDescChange(e) {
        const newDesc = e.target.value;

        setFormContent(prev => ({
            ...prev,
            formDesc: newDesc
        }))
    }



    function closeAndResetModal() {
        setIsModalOpen(false);

        if (isEdit) {
            setFormContent({
                formTitle: currentTodo.title,
                formDesc: currentTodo.desc
            })
        }
        else {
            setFormContent({
                formTitle: "",
                formDesc: ""
            })
        }
    }


    async function submitEditTodo(e) {
        e.preventDefault();

        const todoBody = { title: formContent.formTitle, desc: formContent.formDesc, fulfilled: currentTodo.fulfilled };

        try {
            const updateResponse = await fetch(
                "http://localhost:8080/updateTodo/" + currentTodo.id,
                {
                    method: "POST",
                    body: JSON.stringify(todoBody),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            if (!updateResponse.ok) {
                throw new Error(
                    "Error - Response Status:" + updateResponse.status,
                );
            }

            closeAndResetModal();
            todoFuncAndData.updateList();

        } catch (error) {
            console.error(error);
        }

    }

    async function submitAddTodo(e) {
        e.preventDefault();

        const todoBody = { title: formContent.formTitle, desc: formContent.formDesc, fulfilled: false };

        try {
            const postNewTodoResponse = await fetch(
                "http://localhost:8080/todo",
                {
                    method: "POST",
                    body: JSON.stringify(todoBody),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            console.log("postNewTodoResponse: " + postNewTodoResponse.status);

            if (!postNewTodoResponse.ok) {
                throw new Error(
                    "Error - Response Status:" + postNewTodoResponse.status,
                );
            }

            closeAndResetModal();
            todoFuncAndData.updateList();

        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="todo-entry-edit-container">

            {/* Edit Button */}
            {isEdit &&
                <PencilSquareIcon className="todo-entry-edit-button" onClick={() => setIsModalOpen(true)} />
            }

            {/* Add Button */}
            {!isEdit &&
                <button className="openPopup-button" onClick={() => setIsModalOpen(true)}>
                    add a new todo
                </button>
            }

            <dialog className="modal-container" ref={dialogRef} onClose={closeAndResetModal}>

                <div className="modal-title-container">

                    <div className="modal-title">
                        {isEdit ? "editing todo" : "new todo"}
                    </div>


                    <div className="modal-close-button-container">
                        <XMarkIcon className="modal-close-button" onClick={closeAndResetModal} />
                    </div>

                </div>

                <div className="todo-modal-content-container">

                    <form className="modal-form" onSubmit={isEdit ? submitEditTodo : submitAddTodo} >
                        <input type="text" className="modal-form-title" placeholder="title" value={formContent.formTitle} autoComplete="off" required onChange={handleTitleChange} />
                        <br />
                        <textarea type="text" className="modal-form-desc" form="addTodoForm-update" onChange={handleDescChange} placeholder="description" value={formContent.formDesc} autoComplete="off" autoCorrect="off" spellCheck="off" />
                        <br />
                        <input type="submit" className="modal-form-submitButton" value={isEdit ? "update" : "add"} />
                    </form>

                </div>

            </dialog >
        </div >
    )
}

export default TodoEditOrAddButton;

