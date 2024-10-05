import React from "react";
import Link from "next/link";


//INTERNAL IMPORT
import Style from "./Projects.module.css";

const Projects = ({ isWalletConnected }) => {
    //--------PROJECTS NAVIGATION MENU
    const projects = [
        {
            name: "SKYWALK 1000",
            link: "skyWalk1000Page",
        },
        {
            name: "COMING 2025",
            link: "/",
        },
        {
            name: "COMING 2026",
            link: "/",
        },
        {
            name: "COMING 2027",
            link: "/",
        },

    ];


    const filteredProjects = isWalletConnected
        ? projects
        : projects.filter((el) => el.name !== "Projects");


    return (
        <div>
            {filteredProjects.map((el, i) => (
                <div key={i + 1} className={Style.projects}>

                    {/*
          <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
          */}

                    <Link href={{ pathname: `/${el.link}` }}>{el.name}</Link>


                </div>
            ))}
        </div>
    );
};

export default Projects;