import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon.js"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon.js"
import { useState, useContext } from "react"
import { useMutationAddTodo, useMutationEditTodo } from "./api/queriesAndMutations";
import { todoListProvider } from "./TodoList-Wrapper";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon.js"
import CheckIcon from "@heroicons/react/24/outline/CheckIcon.js"



/** 
 * @param currentTodo === null -> add button
 * @param currentTodo !== null -> edit button
**/
const TodoEditOrAddButton = ({ currentTodo }) => {

    const mutationAddTodo = useMutationAddTodo();
    const mutationEditTodo = useMutationEditTodo();

    const todoFuncAndData = useContext(todoListProvider);

    const isEdit = currentTodo === null ? false : true;

    const [formContent, setFormContent] = useState(isEdit ?
        {
            formTitle: currentTodo.title,
            formDesc: currentTodo.desc
        }
        :
        {
            formTitle: "",
            formDesc: ""
        }
    )

    const [isModalOpen, setIsModalOpen] = useState(false);

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
        closeModal();
    }

    /** 
    *   @description opens the modal and sets its content on open
    **/
    function openModal() {
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

        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <div className="w-full h-full">

            {/* Edit Button */}
            {isEdit &&

                <button className="w-full h-full flex justify-center items-center pl-6 pr-6 pt-4 pb-4 cursor-pointer hover:scale-95 transition-all duration-500 ease-in-out hover:text-text-hover-lm "
                    onClick={openModal}
                >
                    <PencilSquareIcon className="w-8 h-8" />
                </button>
            }

            {/* Add Button */}
            {!isEdit &&
                <button className="flex items-center justify-center transition-all cursor-pointer duration-200 hover:scale-120 hover:text-text-hover-lm p-3 text-s font-extrabold"
                    onClick={openModal}
                >
                    <PlusIcon className='h-6' />
                </button>
            }

            {/* Modal */}
            {isModalOpen &&
                <div
                    className="fixed inset-0 bg-black/50 flex justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-bg-lm rounded-xl shadow-xl pt-5 pl-15 pr-15 pb-5 h-80 mt-60 mb-auto w-full max-w-md border-2 border-accent-lm"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="text-text-lm text-xl text-left pb-5">
                            {isEdit ? "editing todo" : "adding new todo"}
                        </div>

                        <form className="flex flex-col items-center justify-center w-full" onSubmit={handleSubmit} >

                            <input
                                type="text"
                                className="w-full h-15 mt-2 pl-2 pr-2 rounded-sm bg-modal-input-bg resize-none focus:bg-modal-input-focus-bg focus:outline-none text-modal-input-txt"
                                placeholder="title"
                                value={formContent.formTitle}
                                autoComplete="off"
                                required
                                autoFocus
                                onChange={handleTitleChange}
                            />

                            <textarea
                                type="text"
                                className="w-full h-20 mt-3 pl-2 pr-2 rounded-sm bg-modal-input-bg resize-none focus:bg-modal-input-focus-bg focus:outline-none text-modal-input-txt"
                                onChange={handleDescChange}
                                placeholder="description"
                                value={formContent.formDesc}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="off"
                            />

                            <div className="flex flex-row justify-evenly items-center w-full h-20">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex justify-center items-center cursor-pointer w-2/10 h-full pt-2 pb-2 transition-all duration-200 hover:text-text-hover-lm bg-orange-900">
                                    <XMarkIcon className="p-5" />
                                </button>

                                <button
                                    type="submit"
                                    className="flex justify-center items-center cursor-pointer w-2/10 h-full pt-5 pb-5 transition-all duration-200 hover:text-text-hover-lm bg-cyan-900"
                                >
                                    <CheckIcon className="p-5" />

                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            }
        </div >
    )
}

export default TodoEditOrAddButton;

