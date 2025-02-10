import "./TodoCollapseAllButton.css"

const CollapseButton = (({ funcToggleActiveDesc }) => {

    function collapseAllActiveTodos() {
        funcToggleActiveDesc();
    }

    return (
        <div>
            <button className="collapse-all-button" onClick={() => collapseAllActiveTodos()}> toggle desc</button>
        </div>
    );
});

export default CollapseButton;