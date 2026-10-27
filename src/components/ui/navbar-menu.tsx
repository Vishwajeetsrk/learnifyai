"use client";
import React from "react";
import { motion, type Transition } from "framer-motion";
import { Link } from "@tanstack/react-router";

const transition: Transition = {
  type: "spring",
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
    <div onMouseEnter={() => setActive(item)} className="relative py-1">
      <motion.div
        transition={{ duration: 0.2 }}
        className="cursor-pointer text-muted-foreground hover:text-foreground text-sm font-medium transition-colors flex items-center gap-1 select-none"
      >
        <span>{item}</span>
      </motion.div>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 z-50 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-3">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-card/95 text-card-foreground dark:bg-black/95 backdrop-blur-md rounded-2xl overflow-hidden border border-border/80 shadow-2xl"
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
  className = "",
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={`relative rounded-full border border-border/60 bg-muted/40 dark:bg-black/40 backdrop-blur-md shadow-xs flex items-center justify-center space-x-4 px-6 py-2 ${className}`}
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
  badge,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
  badge?: string;
}) => {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  const content = (
    <div className="flex space-x-3 group cursor-pointer p-1.5 rounded-xl hover:bg-muted/50 transition-colors">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        loading="lazy"
        className="w-[120px] h-[68px] flex-shrink-0 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform duration-300 border border-border/60"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          {badge && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-xs max-w-[12rem] line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link to={href as any}>{content}</Link>;
};

export const HoveredLink = ({
  children,
  href,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  [key: string]: any;
}) => {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground text-xs lg:text-sm font-medium transition-colors hover:translate-x-0.5"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={href as any}
      className="text-muted-foreground hover:text-foreground text-xs lg:text-sm font-medium transition-colors hover:translate-x-0.5"
      {...rest}
    >
      {children}
    </Link>
  );
};
