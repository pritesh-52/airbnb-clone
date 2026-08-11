'use client';

import { useState } from 'react';
import { ArrowRightIcon } from '@/components/icons';
import { Modal } from '@/components/ui/modal';

/**
 * Description with Airbnb's truncate-then-expand pattern. The full text is
 * always in the DOM inside the dialog, so search and screen readers reach it
 * regardless of the clamp.
 */
export function Description({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const paragraphs = text.split('\n\n');
  const isTruncated = paragraphs.length > 1;

  return (
    <div className="border-b border-hairline-soft py-6">
      {/* Clamped to three lines rather than cut at a paragraph boundary, so the
          preview ends mid-sentence the way the reference does. */}
      <p className="line-clamp-3 text-base whitespace-pre-line">{text}</p>

      {isTruncated ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold underline underline-offset-2"
          >
            Show more
            <ArrowRightIcon size={14} />
          </button>

          <Modal open={open} onClose={() => setOpen(false)} title="About this space" size="md">
            <h3 className="mb-4 text-xl">About this space</h3>
            <div className="space-y-4 text-base">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Modal>
        </>
      ) : null}
    </div>
  );
}
