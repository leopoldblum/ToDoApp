import "./TodoCollapseAllButton.css"

const CollapseButton = (({ toggleCollapseAllDesc, activeHeaders }) => {

    return (
        <div className={`collapse-container ${activeHeaders.includes("header-actives") ? "visible" : ""} `}>
            <button className="collapse-all-button" onClick={() => toggleCollapseAllDesc()}> toggle desc</button>
        </div>
    );
});

export default CollapseButton;