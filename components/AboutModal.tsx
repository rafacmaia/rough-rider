"use client";
import { Cat } from "lucide-react";
import { useState } from "react";
import CatIcon from "@/public/cat-icon4.svg";
import Image from "next/image";

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="absolute right-4 bottom-4 z-70 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image className={`block size-10`} src={CatIcon} alt={`Cat icon`} />
      </button>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 z-60 backdrop-blur-[2px]"
        >
          <section
            className={`absolute right-13 bottom-13 z-99 flex flex-col items-center-safe rounded-full rounded-br-none border border-accent bg-slate-950 px-8 py-6 font-footer text-sm font-light tracking-wider text-slate-100 opacity-95 drop-shadow-2xl`}
          >
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="absolute right-[7px] bottom-0 cursor-pointer font-footer text-[1rem] text-red-alt"
            >
              x
            </button>
            <div className="mb-3">
              Built by cats & humans at
              <a
                className="ml-[6px] cursor-pointer rounded-full bg-slate-100 p-[0.3rem] px-[0.45rem] font-medium text-slate-950 hover:opacity-80 active:opacity-80"
                href="https://github.com/rafacmaia"
                target="_blank"
                rel="noopener"
              >
                Zou Labs 🐈‍⬛
              </a>
            </div>
            &copy; {new Date().getFullYear()} Licensed under MIT
          </section>
        </div>
      )}
    </>
  );
}
