import { useState } from "react";
const MenuDropdown = ({ name, children, icon }) => {

    const [menu, setMenu] = useState(false);

    return (
        <>
            <li className="submenu" onClick={() => setMenu(!menu)} >
                <a href="#" className={`${menu ? "noti-dot subdrop" : "noti-dot"}`}>
                    {icon} <span> {name} </span>
                    <span className="menu-arrow"></span>
                </a>

                <div className={`${menu ? 'MenuOpen' : 'MenuClose'}`}>
                    <ul >
                        {children}
                    </ul>
                </div>

            </li>



        </>
    )
}

export default MenuDropdown;