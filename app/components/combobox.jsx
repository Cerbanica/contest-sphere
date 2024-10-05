<Combobox
value={selected}
onChange={handlePrizeChange}
onClose={() => setQuery('')}
>        <div className="relative w-72">
        <ComboboxInput
          className={clsx(
            'w-full rounded-2xl pr-10  border-none bg-grey-600 py-2  pl-3 text-sm/6 default',
            'focus:outline-none data-[focus]:outline-0 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
          displayValue={(person) => person ? person.name : ''} 
          onChange={(event) => setQuery(event.target.value)}
          disabled
        />
        <ComboboxButton className="group absolute inset-y-0 rounded right-0 px-3  flex items-center justify-center">
          <ChevronDownIcon className="size-4 " />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        anchor="bottom"
        transition
        className={clsx(
          'w-[var(--input-width)] rounded-2xl mt-1 default py-3 [--anchor-gap:var(--spacing-1)] empty:invisible',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 '
        )}
      >
        {filteredPeople.map((person) => (
          <ComboboxOption
            key={person.id}
            value={person}
            className="group flex cursor-default default items-center  gap-2 py-1.5 px-3 select-none data-[focus]:bg-purple-100 dark:data-[focus]:bg-slate-400 " 
          >
            <PlayIcon className="invisible size-4 fill-gray-500 dark:fill-slate-200 group-data-[selected]:visible" />
            <div className="text-sm/6 ">{person.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>