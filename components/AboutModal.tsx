"use client";
import { Cat } from "lucide-react";
import { useState } from "react";
import CatIcon from "@/public/cat-icon3.svg";
import Image from "next/image";

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="absolute right-4 bottom-4 z-70 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/*<Cat size={32} className="block text-gray-500" strokeWidth={2} />*/}
        <Image className={`block size-8`} src={CatIcon} alt={`Cat icon`} />
      </button>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 z-60 backdrop-blur-[2px]"
        >
          <section
            className={`absolute right-5 bottom-16 z-99 flex flex-col items-center-safe rounded-full rounded-br-none bg-slate-950 px-9 py-6 font-footer text-sm font-light tracking-wider text-slate-100 opacity-95 drop-shadow-xl`}
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
                className="ml-[6px] cursor-pointer rounded-2xl bg-slate-100 p-[0.3rem] px-[0.45rem] font-medium text-slate-950 hover:opacity-80 active:opacity-80"
                href="https://github.com/rafacmaia"
                target="_blank"
                rel="noopener"
              >
                Zou Labs
                {/*🐈‍⬛*/}
              </a>
            </div>
            &copy; {new Date().getFullYear()} Licensed under MIT
          </section>
        </div>
      )}
    </>
  );
}
