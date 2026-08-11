import type { ThingsToKnow as ThingsToKnowData } from '@airbnb-clone/types';
import { FlagIcon } from '@/components/icons';

const COLUMNS = [
  { key: 'houseRules', heading: 'House rules' },
  { key: 'safetyAndProperty', heading: 'Safety & property' },
  { key: 'cancellationPolicy', heading: 'Cancellation policy' },
] as const;

export function ThingsToKnow({ data }: { data: ThingsToKnowData }) {
  return (
    <section aria-labelledby="things-to-know-heading" className="py-12">
      <h2 id="things-to-know-heading" className="text-xl">
        Things to know
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <div key={column.key}>
            <h3 className="text-base font-semibold">{column.heading}</h3>
            <ul className="mt-4 space-y-2">
              {data[column.key].map((rule) => (
                <li key={rule.id} className="text-sm">
                  {rule.label}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 text-sm font-semibold underline underline-offset-2 transition-opacity duration-200 hover:opacity-70"
            >
              Show more
              <span className="sr-only"> about {column.heading.toLowerCase()}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center border-t border-hairline-soft pt-6">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold underline underline-offset-2 transition-opacity duration-200 hover:opacity-70"
        >
          <FlagIcon size={16} />
          Report this listing
        </button>
      </div>
    </section>
  );
}
