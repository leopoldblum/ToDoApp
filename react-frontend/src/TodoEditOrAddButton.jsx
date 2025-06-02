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
                userid: todoFuncAndData.userIDref.current,
                optimisticid: currentTodo.optimisticid
            })
        }
        else {
            const optimisticid = crypto.randomUUID()
            mutationAddTodo.mutate({
                id: null,
                title: formContent.formTitle,
                desc: formContent.formDesc,
                fulfilled: false,
                userid: todoFuncAndData.userIDref.current,
                optimisticid: optimisticid
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

                <button className="w-full h-full flex justify-center items-center p-2 lg:p-4 cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out hover:text-text-hover-lm"
                    onClick={openModal}
                >
                    <PencilSquareIcon className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>
            }

            {/* Add Button */}
            {!isEdit &&
                <button className="flex items-center justify-center transition-all cursor-pointer duration-300 hover:scale-120 hover:text-text-hover-lm p-3"
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
                        className="bg-bg-lm rounded-xl shadow-xl pt-5 pl-15 pr-15 pb-5 h-80 mt-30 lg:mt-60 mb-auto w-full max-w-xs lg:max-w-md border-2 border-accent-lm"
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

                            <div className="flex flex-row justify-evenly items-center w-full h-20 text-accent-lm">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex justify-center items-center cursor-pointer w-15 h-15 pt-2 pb-2 transition-all duration-300 hover:text-text-hover-lm">
                                    <XMarkIcon className="h-8 " />
                                </button>

                                <button
                                    type="submit"
                                    className="flex justify-center items-center cursor-pointer w-15 h-15 pt-5 pb-5 transition-all duration-300 hover:text-text-hover-lm"
                                >
                                    <CheckIcon className="h-8 " />

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

