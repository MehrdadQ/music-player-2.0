import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Nav = ({ libraryStatus, setLibraryStatus }) => {
  return (
    <nav>
      <a href="https://github.com/MehrdadQ/Music-Player" target="blank">
        <FontAwesomeIcon icon={faGithub} size={"2x"} />
      </a>
      <button onClick={() => setLibraryStatus(!libraryStatus)}>
        <FontAwesomeIcon icon={faMusic} size={"2x"} />
      </button>
    </nav>
  );
};

export default Nav;
