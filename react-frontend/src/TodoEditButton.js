import "./TodoEditButton.css"
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon.js"
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon.js"
import { useState, useEffect, useRef } from "react"



const TodoEditButton = ({ currentTodo, updateList }) => {

    const [formContent, setFormContent] = useState({
        formTitle: currentTodo.title,
        formDesc: currentTodo.desc
    })

    const [isModalOpen, setIsModalOpen] = useState(false);
    const dialogRef = useRef(null);


    useEffect(() => {
        setFormContent({
            formTitle: currentTodo.title,
            formDesc: currentTodo.desc
        });
    }, [currentTodo]);

    useEffect(() => {
        if (isModalOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isModalOpen]);



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
        formContent.formTitle = currentTodo.title;
        formContent.formDesc = currentTodo.desc;
    }


    async function updateTodoEdit(e) {
        e.preventDefault();

        console.log("prev. default, Title: " + formContent.formTitle + " Desc:" + formContent.formDesc)

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
            setIsModalOpen(false);
            updateList();
        } catch (error) {
            console.error(error);
        }

    }



    return (
        <div className="todo-entry-edit-container">
            <PencilSquareIcon className="todo-entry-edit-button" onClick={() => setIsModalOpen(true)} />

            <dialog className="todo-entry-edit-modal" ref={dialogRef} onClose={closeAndResetModal}>

                <div className="add-todo-modal-title-container">

                    <div className="add-todo-modal-title">
                        editing todo
                    </div>

                    <div className="add-todo-modal-close-button-container">
                        <XMarkIcon className="add-todo-modal-close-button" onClick={closeAndResetModal} />
                    </div>

                </div>

                <div className="todo-modal-content-container">

                    <form className="addTodoForm " onSubmit={updateTodoEdit} >
                        <input type="text" className="addTodoForm-input" value={formContent.formTitle} autoComplete="off" required onChange={handleTitleChange} />

                        <br />

                        <textarea type="text" className="addTodoForm-desc" form="addTodoForm-update" onChange={handleDescChange} value={formContent.formDesc} autoComplete="off" autoCorrect="off" spellCheck="off" />

                        <br />

                        <input type="submit" className="addTodoForm-submitButton" value={"update!"} />
                    </form>

                </div>

            </dialog>
        </div >
    )
}

export default TodoEditButton;