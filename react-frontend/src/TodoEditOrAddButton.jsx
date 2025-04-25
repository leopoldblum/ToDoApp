import "./TodoEditOrAddButton.css"
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon.js"
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon.js"
import { useState, useEffect, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMutationAddTodo } from "./api/queriesAndMutations";

/** 
 * @param currentTodo === null -> add button
 * @param currentTodo !== null -> edit button
**/
const TodoEditOrAddButton = ({ currentTodo }) => {

    const queryClient = useQueryClient()

    const mutationAddTodo = useMutationAddTodo(closeModal, closeAndClearModal);
    // const mutationEditTodo;


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

    function handleSubmit(e) {
        e.preventDefault()

        if (isEdit) {
            mutationEditTodo.mutate({
                inputTitle: formContent.formTitle,
                inputDesc: formContent.formDesc
            })
        }
        else {
            mutationAddTodo.mutate({
                inputTitle: formContent.formTitle,
                inputDesc: formContent.formDesc
            })
        }
        closeAndClearModal();
    }

    /** 
    *   @description opens the modal and sets its content on open
    **/
    function openModal() {
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

        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function clearModal() {
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

    function closeAndClearModal() {
        closeModal();
        clearModal();
    }


    async function submitEditTodo(inputTitle, inputDesc) {

        const todoBody = { title: inputTitle, desc: inputDesc, fulfilled: currentTodo.fulfilled };

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

            closeAndClearModal();

        } catch (error) {
            console.error(error);
        }

    }


    const mutationEditTodo = useMutation({
        mutationFn: ({ inputTitle, inputDesc }) => submitEditTodo(inputTitle, inputDesc),

        onMutate: async ({ inputTitle, inputDesc }) => {
            // optimistically updating todo

            const todoBody = { id: currentTodo.id, title: inputTitle, desc: inputDesc, fulfilled: currentTodo.fulfilled };

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos'])

            queryClient.setQueryData(['todos'], (old) => old.map((todo) => todo.id === currentTodo.id ? todoBody : todo))

            closeModal();
            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos)
            console.error("error when editing todo: " + err)
            throw err;

        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })


    return (
        <div className="todo-entry-edit-container">

            {/* Edit Button */}
            {isEdit &&
                <PencilSquareIcon className="todo-entry-edit-button" onClick={openModal} />
            }

            {/* Add Button */}
            {!isEdit &&
                <button className="openPopup-button" onClick={openModal}>
                    add a new todo
                </button>
            }

            <dialog className="modal-container" ref={dialogRef} onClose={closeAndClearModal}>

                <div className="modal-title-container">

                    <div className="modal-title">
                        {isEdit ? "editing todo" : "new todo"}
                    </div>


                    <div className="modal-close-button-container">
                        <XMarkIcon className="modal-close-button" onClick={closeAndClearModal} />
                    </div>

                </div>

                <div className="todo-modal-content-container">

                    <form className="modal-form" onSubmit={handleSubmit} >

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

