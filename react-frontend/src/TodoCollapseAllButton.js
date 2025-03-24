import "./TodoCollapseAllButton.css"

const CollapseButton = (({ toggleCollapseAllDesc }) => {

    return (
        <div className={`collapse-container`}>
            <button className="collapse-all-button" onClick={() => toggleCollapseAllDesc()}> toggle desc</button>
        </div>
    );
});

export default CollapseButton;