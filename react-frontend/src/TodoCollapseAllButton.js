import "./TodoCollapseAllButton.css"

const CollapseButton = (({ funcToggleDesc }) => {

    function toggleDescriptions() {
        funcToggleDesc();
    }

    return (
        <div className="collapse-container">
            <button className="collapse-all-button" onClick={() => toggleDescriptions()}> toggle desc</button>
        </div>
    );
});

export default CollapseButton;