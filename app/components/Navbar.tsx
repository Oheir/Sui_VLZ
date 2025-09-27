"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { AlignJustify } from "lucide-react";
import './navbar.css';

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Forum1",
    href: "/counter",
    description: "Hackaton Forum",
  },
  {
    title: "Create Counter",
    href: "/create",
    description: "Create a new counter instance on the blockchain.",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about this counter application.",
  },
];

export default function Navbar() {
  return (
    <NavigationMenu className="navbar">
      <NavigationMenuList className="navbar-content">
        <div className="navbar">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <img src="/shallot_logo_exp.svg" alt="Shallot Logo" />
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="navbar-buttons">Forums</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="dropdown-list">
                <li className="dropdown-card">
                  <NavigationMenuLink asChild>
                    <Link href="/" className="counter-card">
                      <div className="title">Counter App</div>
                      <p className="description">
                        A beautiful counter application built with Next.js and Tailwind CSS.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className = "", title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={`list-item ${className}`}
          {...props}
        >
          <div className="title">{title}</div>
          <p className="description">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
