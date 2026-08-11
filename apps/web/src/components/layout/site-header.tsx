'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AirbnbLogo, GlobeIcon, MenuIcon, SearchIcon, UserIcon } from '@/components/icons';

/**
 * Segments drop out as the viewport narrows so the pill can shrink instead of
 * pushing the account cluster off-screen — the same order Airbnb collapses them.
 */
const SEARCH_SEGMENTS = [
  { id: 'where', label: 'Anywhere', muted: false, visibility: 'flex' },
  { id: 'when', label: 'Any week', muted: false, visibility: 'hidden sm:flex' },
  { id: 'who', label: 'Add guests', muted: true, visibility: 'hidden md:flex' },
] as const;

const ACCOUNT_MENU = [
  { id: 'signup', label: 'Sign up', emphasis: true },
  { id: 'login', label: 'Log in', emphasis: false },
  { id: 'host', label: 'Airbnb your home', emphasis: false },
  { id: 'experience', label: 'Host an experience', emphasis: false },
  { id: 'help', label: 'Help Center', emphasis: false },
] as const;

/**
 * Top navigation. Sticky so it stays available while the long listing page
 * scrolls, matching the reference behaviour.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapperRef = useRef<HTMLDivElement>(null);

  // Dismiss on outside pointer-down or Escape. Listening on the document keeps
  // the click-away logic off a non-interactive overlay element.
  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuWrapperRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline-soft bg-white">
      <div className="mx-auto flex h-20 max-w-shell items-center justify-between gap-4 px-6 lg:px-10 xl:px-20">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-rausch"
          aria-label="Airbnb — home"
        >
          <AirbnbLogo className="size-8" />
          <span className="hidden text-xl font-bold tracking-tight lg:inline">airbnb</span>
        </Link>

        {/* Search pill */}
        <div className="flex min-w-0 flex-1 justify-center">
          <button
            type="button"
            className="group flex h-12 min-w-0 max-w-full items-center rounded-pill border border-hairline bg-white pr-2 pl-4 shadow-pill transition-shadow duration-200 ease-airbnb hover:shadow-pill-hover sm:pl-6"
            aria-label="Start your search"
          >
            {SEARCH_SEGMENTS.map((segment, index) => (
              <span key={segment.id} className={`min-w-0 items-center ${segment.visibility}`}>
                {index > 0 ? (
                  <span aria-hidden="true" className="mx-1 h-6 w-px bg-hairline sm:mx-2" />
                ) : null}
                <span
                  className={[
                    'truncate px-2 text-sm font-medium',
                    segment.muted ? 'text-ink-muted' : 'text-ink',
                  ].join(' ')}
                >
                  {segment.label}
                </span>
              </span>
            ))}
            <span className="ml-2 grid size-8 shrink-0 place-items-center rounded-full bg-rausch text-white">
              <SearchIcon size={14} strokeWidth={3} />
            </span>
          </button>
        </div>

        {/* Account cluster */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="hidden rounded-pill px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-surface-muted lg:block"
          >
            Airbnb your home
          </button>

          <button
            type="button"
            className="hidden size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-muted sm:grid"
            aria-label="Choose a language and currency"
          >
            <GlobeIcon size={16} />
          </button>

          <div className="relative" ref={menuWrapperRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-controls="account-menu"
              className="flex items-center gap-3 rounded-pill border border-hairline py-1.5 pr-1.5 pl-3 transition-shadow duration-200 ease-airbnb hover:shadow-pill"
            >
              <MenuIcon size={16} />
              <span className="grid size-7 place-items-center rounded-full bg-ink-muted text-white">
                <UserIcon size={18} />
              </span>
              <span className="sr-only">Main navigation menu</span>
            </button>

            {menuOpen ? (
              <div
                id="account-menu"
                role="menu"
                aria-label="Account"
                className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-card bg-white py-2 shadow-card"
              >
                {ACCOUNT_MENU.map((item, index) => (
                  <span key={item.id}>
                    {index === 2 ? (
                      <span className="my-2 block h-px bg-hairline-soft" aria-hidden="true" />
                    ) : null}
                    <button
                      type="button"
                      role="menuitem"
                      className={[
                        'block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-surface-muted',
                        item.emphasis ? 'font-semibold' : 'font-normal',
                      ].join(' ')}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
