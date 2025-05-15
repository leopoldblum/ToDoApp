import "./TodoEditOrAddButton.css"
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon.js"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon.js"
import { useState, useEffect, useRef, useContext } from "react"
import { useMutationAddTodo, useMutationEditTodo } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon.js"



/** 
 * @param currentTodo === null -> add button
 * @param currentTodo !== null -> edit button
**/
const TodoEditOrAddButton = ({ currentTodo }) => {

    const mutationAddTodo = useMutationAddTodo();
    const mutationEditTodo = useMutationEditTodo();

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
                id: currentTodo.id,
                title: formContent.formTitle,
                desc: formContent.formDesc,
                fulfilled: currentTodo.fulfilled,
                userid: todoFuncAndData.userIDref.current
            })
        }
        else {
            mutationAddTodo.mutate({
                id: null,
                title: formContent.formTitle,
                desc: formContent.formDesc,
                fulfilled: false,
                userid: todoFuncAndData.userIDref.current
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

    return (
        <div className="w-full h-full">

            {/* Edit Button */}
            {isEdit &&

                <div className="flex justify-center items-center w-full ">
                    <PencilSquareIcon
                        className="w-15 p-4 cursor-pointer hover:text-red-400 hover:scale-95 transition-all duration-200 ease-in-out"
                        onClick={openModal}
                    />
                </div>
            }

            {/* Add Button */}
            {!isEdit &&
                <button className="flex items-center justify-center transition-all cursor-pointer duration-200 hover:scale-120 hover:text-red-400"
                    onClick={openModal}
                >
                    <PlusIcon className='h-6' />
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

