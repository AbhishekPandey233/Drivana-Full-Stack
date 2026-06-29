"use client";

import React from "react";

type StoredUser = {
  id?: string;
  fullName?: string;
  email?: string;
  username?: string;
};

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;
  onLogoutRequest: () => void;
  onLogoutConfirm: () => void;
  logoutConfirmOpen: boolean;
  user: StoredUser;
}

export default function ProfilePopup({
  open,
  onClose,
  onLogoutRequest,
  onLogoutConfirm,
  logoutConfirmOpen,
  user,
}: ProfilePopupProps) {
  if (!open && !logoutConfirmOpen) {
    return null;
  }

  const displayName = user.fullName || user.username || "Your name";
  const displayEmail = user.email || user.username || "yourname@gmail.com";
  

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-transparent px-4 py-8"
          onClick={onClose}
        >
          {/* Added mt-24 to push the main popup layout slightly down */}
          <div
            className="mt-24 w-full max-w-[520px] rounded-[24px] bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-sm sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8fafc,#cbd5e1)] text-lg font-black text-slate-600">
                    U
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-violet-300 bg-white text-[10px] font-black text-violet-500 shadow-sm">
                    ✎
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">{displayName}</h2>
                  <p className="text-sm text-slate-500">{displayEmail}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 text-lg leading-none text-slate-500 transition-colors hover:bg-violet-50 hover:text-slate-700"
                aria-label="Close profile popup"
              >
                ×
              </button>
            </div>

            <div className="mt-5 border-t border-slate-200/90" />

            <div className="mt-2 divide-y divide-slate-200/80">
              <div className="flex items-center justify-between py-5">
                <span className="text-[15px] font-medium text-slate-700">Name</span>
                <span className="text-[15px] text-slate-500">{displayName}</span>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-[15px] font-medium text-slate-700">Email account</span>
                <span className="text-[15px] text-slate-500">{displayEmail}</span>
              </div>
            </div>

            {/* Structured using an even 3-column grid to fix sibling spacing perfectly */}
            <div className="mt-8 grid grid-cols-3 gap-3 w-full pb-1">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#2F80ED] px-2 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 truncate"
              >
                Save Change
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#2F80ED] px-2 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 truncate"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={onLogoutRequest}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#FF3B3B] px-2 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-500 truncate"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent px-4"
          onClick={onClose}
        >
          <div
            className="w-full max-w-[420px] rounded-[22px] bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Are you sure about logging out?</h3>
            <p className="mt-2 text-sm text-slate-500">Your session will end and you will return to the login page.</p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-w-24 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onLogoutConfirm}
                className="inline-flex min-w-24 items-center justify-center rounded-md bg-[#FF3B3B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}