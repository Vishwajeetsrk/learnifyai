"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link as TanstackLink } from "@tanstack/react-router";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white font-medium text-sm transition-colors"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 z-50">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md shadow-lg shadow-black/[0.03] dark:shadow-black/40 flex justify-center items-center space-x-6 px-8 py-3.5"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  const Content = (
    <div className="flex space-x-3 items-center group/item hover:opacity-95 transition-opacity">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        loading="lazy"
        className="flex-shrink-0 w-32 h-18 object-cover rounded-lg shadow-md border border-neutral-200/60 dark:border-neutral-800/60 group-hover/item:scale-[1.02] transition-transform duration-200"
      />
      <div>
        <h4 className="text-sm font-semibold mb-1 text-neutral-900 dark:text-neutral-100 group-hover/item:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 text-xs max-w-[12rem] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {Content}
      </a>
    );
  }

  return (
    <TanstackLink to={href} className="block">
      {Content}
    </TanstackLink>
  );
};

export const HoveredLink = ({
  children,
  href = "#",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  [key: string]: any;
}) => {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  const combinedClass = `text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors duration-150 text-sm font-medium ${className}`;

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClass} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <TanstackLink to={href} className={combinedClass} {...rest}>
      {children}
    </TanstackLink>
  );
};

export default Menu;
