import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0D0B12] text-[#F0EBE0] border-t border-[#C8A96E22] px-6 py-12">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* SERVICES */}
        <div>
          <h6 className="text-[#C8A96E] font-semibold mb-4">Services</h6>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="hover:text-[#C8A96E] cursor-pointer">Branding</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Design</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Marketing</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Advertisement</p>
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <h6 className="text-[#C8A96E] font-semibold mb-4">Company</h6>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="hover:text-[#C8A96E] cursor-pointer">About us</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Contact</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Jobs</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Press kit</p>
          </div>
        </div>

        {/* LEGAL */}
        <div>
          <h6 className="text-[#C8A96E] font-semibold mb-4">Legal</h6>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="hover:text-[#C8A96E] cursor-pointer">Terms of use</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Privacy policy</p>
            <p className="hover:text-[#C8A96E] cursor-pointer">Cookie policy</p>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h6 className="text-[#C8A96E] font-semibold mb-4">Newsletter</h6>

          <p className="text-sm text-gray-400 mb-3">
            Get story updates directly in your inbox
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="email@site.com"
              className="w-full px-3 py-2 rounded-l-lg bg-[#161320] border border-gray-700 text-white outline-none focus:border-[#C8A96E]"
            />
            <button className="px-4 py-2 bg-[#C8A96E] text-black font-medium rounded-r-lg hover:bg-[#e0c07a]">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM LINE */}
      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Story App • Crafted with ❤️
      </div>

    </footer>
  );
}