
const HeroIconsButtonLayout = ({ children, onClickFunction }) => {

    return (

        <div className="w-full h-full flex justify-center items-center ">

            <button className="p-4 rounded-md hover:text-text-hover-lm hover:cursor-pointer transition-all duration-300 hover:scale-95"
                onClick={onClickFunction}>

                <div className="w-6 h-6 lg:w-8 lg:h-8 relative font-medium ">
                    {children}
                </div>

            </button>
        </div>
    )
}

export default HeroIconsButtonLayout;