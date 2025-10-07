import React from "react";
import { createDrawerItems } from "./drawerItems"; // ✅ import

export default function SideDrawer({addNode}:{addNode:(type:string)=>void}) {
   const items = createDrawerItems(addNode);
  return (
    <div className="drawer flex justify-center drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer-4"
          className="drawer-button btn btn-primary rounded-lg"
        >
          +
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content font-bold font-mono text-2xl min-h-full w-80 p-4">
          {items.map((item) => (
            <li key={item.name}>
              <button onClick={item.onClick} className="flex gap-2 items-center">
                <span>{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
