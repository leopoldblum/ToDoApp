import "./TodoCollapseAllButton.css"

const CollapseButton = (({ funcToggleActiveDesc }) => {

    function collapseAllActiveTodos() {
        funcToggleActiveDesc();
    }

    return (
        <div>
            <button className="collapse-all-button" onClick={() => collapseAllActiveTodos()}> collapse all</button>
        </div>
    );
});

export default CollapseButton;