import React, { Component, useState } from "react";

const states = {
    unchecked: {
        id: "1",
        img: "box1.svg"
    },
    checked: {
        id: "2",
        img: "box2.svg"
    }
}



export default function App(isDone) {
    console.log("this.props.isDone => " + isDone)
    if (isDone == "false") {
        return (
            <button> not done </button>
        );
    }
    else {
        return (
            <button> done </button>
        );
    }
}