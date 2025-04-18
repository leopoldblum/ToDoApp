import "./TodoEditOrAddButton.css"
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon.js"
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon.js"
import { useState, useEffect, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";

/** 
    @param currentTodo === null -> add button
    @param currentTodo !== null -> edit button
**/
const TodoEditOrAddButton = ({ currentTodo }) => {

    const queryClient = useQueryClient()


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

    function closeModal() {
        setIsModalOpen(false);
    }

    function closeAndClearModal() {
        closeModal();
        clearModal();
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

            closeAndClearModal();
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

            if (!postNewTodoResponse.ok) {
                throw new Error(
                    "Error - Response Status:" + postNewTodoResponse.status,
                );
            }

            closeAndClearModal();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const mutationAddTodo = useMutation({
        mutationFn: submitAddTodo,

        onMutate: async () => {
            // optimistically adding todo

            const newTodo = { id: "placeholder", title: formContent.formTitle, desc: formContent.formDesc, fulfilled: false };

            await queryClient.cancelQueries({ queryKey: ['todos'] })

            const previousTodos = queryClient.getQueryData(['todos']) || []

            queryClient.setQueryData(['todos'], (old) => old ? [...old, newTodo] : [newTodo]);

            closeModal();
            return { previousTodos }
        },

        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos || [])
            console.error("error when adding todo: " + err)
            throw err;
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    })


    const mutationEditTodo = useMutation({
        mutationFn: submitEditTodo,

        onMutate: async () => {
            // optimistically updating todo

            const todoBody = { id: currentTodo.id, title: formContent.formTitle, desc: formContent.formDesc, fulfilled: currentTodo.fulfilled };

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
                <PencilSquareIcon className="todo-entry-edit-button" onClick={() => setIsModalOpen(true)} />
            }

            {/* Add Button */}
            {!isEdit &&
                <button className="openPopup-button" onClick={() => setIsModalOpen(true)}>
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

                    {/* <form className="modal-form" onSubmit={isEdit ? submitEditTodo : submitAddTodo} > */}
                    <form className="modal-form" onSubmit={isEdit ? mutationEditTodo.mutate : mutationAddTodo.mutate} >

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

